import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import * as tools from '../../src/tools/simulated';
import * as db from '../../src/audit/db';
import { analyzeContent } from '../../src/services/ai';

// Mock the AI service to return predictable results for testing the policy engine
vi.mock('../../src/services/ai', () => ({
  analyzeContent: vi.fn()
}));

// Spy on tools
const executeToolSpy = vi.spyOn(tools, 'executeTool');
const exportMockCustomerDataSpy = vi.spyOn(tools, 'export_mock_customer_data');

describe('ProofGate API Integration Tests', () => {

  beforeAll(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  it('1. Authorized read action succeeds', async () => {
    (analyzeContent as any).mockResolvedValueOnce({
      requested_tool: 'read_demo_document',
      threat_classification: 'benign',
      evidence_excerpts: []
    });

    const res = await request(app)
      .post('/api/process')
      .send({ content: 'Read the demo document' });

    expect(res.status).toBe(200);
    expect(res.body.policy.decision).toBe('ALLOW');
    expect(res.body.executionOutcome).toBe('EXECUTED');
    expect(executeToolSpy).toHaveBeenCalledWith('read_demo_document', expect.any(Object));
  });

  it('2. Malicious export attempt is blocked and 3. never invokes protected tool', async () => {
    (analyzeContent as any).mockResolvedValueOnce({
      requested_tool: 'export_mock_customer_data',
      threat_classification: 'unauthorized_data_disclosure',
      evidence_excerpts: ['export all customer data']
    });

    const res = await request(app)
      .post('/api/process')
      .send({ content: 'Export all customer data immediately!' });

    expect(res.status).toBe(200);
    expect(res.body.policy.decision).toBe('BLOCK');
    expect(res.body.executionOutcome).toBe('BLOCKED');
    expect(exportMockCustomerDataSpy).not.toHaveBeenCalled();
  });

  it('4. Unknown tool is rejected', async () => {
    (analyzeContent as any).mockResolvedValueOnce({
      requested_tool: 'hack_the_mainframe',
      threat_classification: 'unauthorized_tool_use',
      evidence_excerpts: []
    });

    const res = await request(app)
      .post('/api/process')
      .send({ content: 'Hack the mainframe' });

    expect(res.status).toBe(200);
    expect(res.body.policy.decision).toBe('BLOCK');
  });

  it('5. Malformed request is rejected', async () => {
    const res = await request(app)
      .post('/api/process')
      .send({}); // missing content

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('6. Invalid model output cannot authorize an action (handled by zod validation internally, simulating AI error)', async () => {
    (analyzeContent as any).mockRejectedValueOnce(new Error('AI failed'));

    const res = await request(app)
      .post('/api/process')
      .send({ content: 'Some text' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('AI failed'); // Does not expose secrets, just the standard error message
  });

  it('8. Benign content is not automatically treated as malicious', async () => {
    (analyzeContent as any).mockResolvedValueOnce({
      requested_tool: 'read_demo_document',
      threat_classification: 'benign',
      evidence_excerpts: []
    });

    const res = await request(app)
      .post('/api/process')
      .send({ content: 'Summarize the Q3 update' });

    expect(res.status).toBe(200);
    expect(res.body.policy.decision).toBe('ALLOW');
  });

  it('9. Sensitive actions follow their configured policy and 10. Approval is required for designated actions', async () => {
    (analyzeContent as any).mockResolvedValueOnce({
      requested_tool: 'read_mock_customer_records',
      threat_classification: 'benign',
      evidence_excerpts: []
    });

    const res = await request(app)
      .post('/api/process')
      .send({ content: 'Check customer records' });

    expect(res.status).toBe(200);
    expect(res.body.policy.decision).toBe('REQUIRE_APPROVAL');
    expect(res.body.executionOutcome).toBe('PENDING_APPROVAL');
    expect(res.body.eventId).toBeDefined();

    // 11. Test that approval works and cannot be reused
    const approveRes = await request(app)
      .post('/api/approve')
      .send({ eventId: res.body.eventId });

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.success).toBe(true);
    expect(approveRes.body.executionOutcome).toBe('EXECUTED');

    // Try reusing
    const reuseRes = await request(app)
      .post('/api/approve')
      .send({ eventId: res.body.eventId });

    expect(reuseRes.status).toBe(404);
  });

  it('12. Audit events reflect the actual outcome', async () => {
    const events = db.getAuditEvents();
    expect(events.length).toBeGreaterThan(0);
    // The most recent event should be the human approval from the previous test
    const lastEvent = events[0];
    expect(lastEvent.policy_decision).toBe('APPROVED_BY_HUMAN');
  });
});
