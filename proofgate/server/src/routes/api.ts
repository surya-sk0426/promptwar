import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { analyzeContent } from '../services/ai';
import { evaluatePolicy } from '../policies/engine';
import { executeTool } from '../tools/simulated';
import { insertAuditEvent, getAuditEvents } from '../audit/db';

export const apiRouter = express.Router();

// Memory store for pending approvals
const pendingApprovals: Record<string, { tool: string; parameters: any }> = {};

apiRouter.post('/process', async (req, res) => {
  try {
    const { content, scenarioId } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const aiResult = await analyzeContent(content);
    const requestedTool = aiResult.requested_tool;

    let executionOutcome = 'NOT_EXECUTED';
    let policyResult = evaluatePolicy({ tool: requestedTool });
    let actionData = null;
    let eventId = uuidv4();

    if (policyResult.decision === 'ALLOW') {
      try {
        const result = await executeTool(requestedTool, { content });
        executionOutcome = 'EXECUTED';
        actionData = result.data;
      } catch (e: any) {
        executionOutcome = 'ERROR';
        actionData = e.message;
      }
    } else if (policyResult.decision === 'REQUIRE_APPROVAL') {
      executionOutcome = 'PENDING_APPROVAL';
      pendingApprovals[eventId] = { tool: requestedTool, parameters: { content } };
    } else {
      executionOutcome = 'BLOCKED';
    }

    insertAuditEvent({
      id: eventId,
      scenario_id: scenarioId,
      requested_action: requestedTool,
      policy_decision: policyResult.decision,
      reason: policyResult.reason,
      execution_outcome: executionOutcome,
      threat_categories: aiResult.threat_classification,
      evidence: JSON.stringify(aiResult.evidence_excerpts)
    });

    res.json({
      eventId,
      analysis: aiResult,
      policy: policyResult,
      executionOutcome,
      actionData
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

apiRouter.post('/approve', async (req, res) => {
  try {
    const { eventId } = req.body;
    const pending = pendingApprovals[eventId];

    if (!pending) {
      return res.status(404).json({ error: 'Pending approval not found or already processed.' });
    }

    let policyResult = evaluatePolicy({ tool: pending.tool });
    if (policyResult.decision === 'BLOCK') {
      return res.status(403).json({ error: 'Approval cannot bypass absolute policy prohibitions.' });
    }

    let executionOutcome = 'NOT_EXECUTED';
    let actionData = null;

    try {
      const result = await executeTool(pending.tool, pending.parameters);
      executionOutcome = 'EXECUTED';
      actionData = result.data;
      delete pendingApprovals[eventId];
    } catch (e: any) {
      executionOutcome = 'ERROR';
      actionData = e.message;
    }

    insertAuditEvent({
      id: uuidv4(),
      requested_action: pending.tool,
      policy_decision: 'APPROVED_BY_HUMAN',
      reason: 'Human user explicitly approved the pending action.',
      execution_outcome: executionOutcome,
      threat_categories: 'none',
      evidence: 'Approved event ' + eventId
    });

    res.json({
      success: true,
      executionOutcome,
      actionData
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

apiRouter.get('/audit', (req, res) => {
  try {
    const events = getAuditEvents();
    res.json({ events });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});
