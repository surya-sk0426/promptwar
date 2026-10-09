# Architecture

## Component Diagram
1. **Frontend Dashboard (React):** Sends untrusted content to the API.
2. **Analysis Service (Gemini SDK):** Evaluates content, extracts requested tool, and classifies threat using structured Zod output.
3. **Policy Engine (Node.js/TypeScript):** Evaluates the requested tool against deterministic backend rules.
4. **Tool Executor:** Invokes the simulated tool if ALLOWED, or waits if REQUIRE_APPROVAL.
5. **Audit Logger (SQLite):** Records every transaction immediately.

## Data Flow
- User Input -> /api/process -> Gemini AI Analysis
- Gemini AI Output -> Zod Schema Validation -> Policy Engine
- Policy Engine -> Decision (ALLOW/BLOCK/REQUIRE_APPROVAL)
- Decision == ALLOW -> Execute Tool -> Return Result + Audit Log
- Decision == BLOCK -> Skip Execution -> Return Result + Audit Log

## Boundaries
**AI Analysis Boundary:** The LLM is sandboxed. It can only return JSON. It has no direct access to tools or APIs.
**Policy Enforcement Boundary:** The Node.js application is the single source of truth for authorization. A malicious AI response proposing \`export_mock_customer_data\` is deterministically rejected by the policy matrix.
