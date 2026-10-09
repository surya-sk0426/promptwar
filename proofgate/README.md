# ProofGate: The Security Firewall for AI Agents

**Tagline:** Trust the task. Verify the action.

## Problem Statement
AI agents can process untrusted emails, documents, and external content. Such content may contain malicious instructions designed to manipulate an agent into disclosing information or performing unauthorized actions (Prompt Injection). A language model's judgment alone is not a sufficient security boundary.

## Solution
ProofGate is an AI-agent security gateway that analyzes untrusted content, identifies suspicious instructions, evaluates requested actions, independently enforces backend permissions, and records what happened.

The central principle is:
**The AI can recommend an action. Only the backend policy engine can authorize its execution.**

## Technology Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide-React
- **Backend:** Node.js, Express, Zod for validation, SQLite for audit logs
- **AI:** Google Gemini API (@google/genai)
- **Testing:** Vitest, Supertest

## Setup Instructions
1. Install dependencies:
   \`\`\`bash
   cd server && npm install
   cd ../client && npm install
   \`\`\`
2. Set up the `.env` file in the `server` directory (see `.env.example`). Provide your `GEMINI_API_KEY`. If no key is provided, the system falls back to a deterministic local test mode.
3. Start the application:
   \`\`\`bash
   # In terminal 1
   cd server && npm run dev
   
   # In terminal 2
   cd client && npm run dev
   \`\`\`

## Architecture & AI Usage
ProofGate uses the Gemini API to analyze untrusted inputs. The system prompt requires the model to extract evidence and propose a threat classification, but it relies on a strict Zod schema for structured JSON output. 

Critically, the AI cannot execute tools. It proposes a tool, which is then intercepted by the independent deterministic Policy Engine.

## Known Limitations
- This is a hackathon prototype using simulated tools.
- The SQLite audit log is stored locally and is not cryptographically immutable in this version.
- Authentication for the dashboard itself is omitted for the demonstration.
