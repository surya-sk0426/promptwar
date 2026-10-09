import sqlite3 from 'better-sqlite3';
import path from 'path';

// Using in-memory for testing or a file for persistence. Let's use a file so it persists between restarts.
const dbPath = path.resolve(__dirname, '../../audit.db');
const db = new sqlite3(dbPath);

db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    scenario_id TEXT,
    requested_action TEXT,
    policy_decision TEXT,
    reason TEXT,
    execution_outcome TEXT,
    threat_categories TEXT,
    evidence TEXT
  );
`);

export interface AuditEvent {
  id: string;
  scenario_id?: string;
  requested_action: string;
  policy_decision: string;
  reason: string;
  execution_outcome: string;
  threat_categories: string;
  evidence?: string;
  timestamp?: string;
}

export const insertAuditEvent = (event: AuditEvent) => {
  const stmt = db.prepare(`
    INSERT INTO audit_events (
      id, scenario_id, requested_action, policy_decision, reason, execution_outcome, threat_categories, evidence
    ) VALUES (
      @id, @scenario_id, @requested_action, @policy_decision, @reason, @execution_outcome, @threat_categories, @evidence
    )
  `);
  stmt.run({
    id: event.id,
    scenario_id: event.scenario_id || null,
    requested_action: event.requested_action,
    policy_decision: event.policy_decision,
    reason: event.reason,
    execution_outcome: event.execution_outcome,
    threat_categories: event.threat_categories,
    evidence: event.evidence || null,
  });
};

export const getAuditEvents = () => {
  const stmt = db.prepare('SELECT * FROM audit_events ORDER BY timestamp DESC, rowid DESC');
  return stmt.all();
};
