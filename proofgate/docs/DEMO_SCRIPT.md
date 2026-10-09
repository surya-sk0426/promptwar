# 90-Second Demo Script

## Step 1: The Pitch (10s)
"Hi, I'm building ProofGate, the Security Firewall for AI Agents. When AI agents process untrusted data like emails, they are vulnerable to prompt injections. ProofGate solves this by ensuring the AI can only recommend actions, while an independent deterministic backend authorizes them."

## Step 2: Benign Task (25s)
- Navigate to the **Attack Lab**.
- Select the "Benign Document Summarization" scenario.
- Click **Run Scenario**.
- *Explanation:* "The AI correctly identifies no threat and recommends the \`read_demo_document\` tool. The backend Policy Engine sees this is an ALLOWED action and executes it safely. The audit log is updated."

## Step 3: Malicious Task (35s)
- Select the "Malicious Data Export" scenario.
- Click **Run Scenario**.
- *Explanation:* "Here, an attacker hid an instruction in the document telling the agent to export customer records to an external email. The AI flagged it as 'unauthorized_data_disclosure'. Even if the AI had been fully compromised and didn't flag it, it would request the \`export_mock_customer_data\` tool. Our backend Policy Engine sees this request, matches it against our strict rules, and firmly **BLOCKS** it. The tool is never executed."

## Step 4: Audit & Explainability (20s)
- Navigate to the **Audit Logs**.
- *Explanation:* "Every action is immutably recorded. You can see the blocked exfiltration attempt. We don't just rely on good prompts; we enforce real security boundaries."

## Backup Plan
If the Gemini API is rate-limited or unavailable, ProofGate automatically falls back to a local deterministic mode that demonstrates the exact same architectural boundary and UI state.
