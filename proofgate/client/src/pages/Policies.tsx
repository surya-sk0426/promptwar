import React from 'react';
import { Shield, Lock, Users, AlertTriangle } from 'lucide-react';

const policies = [
  { tool: 'read_demo_document', decision: 'ALLOW', desc: 'Reading demo documents is explicitly permitted.', req: 'doc:read' },
  { tool: 'draft_email', decision: 'ALLOW', desc: 'Drafting emails without sending is a safe operation.', req: 'email:draft' },
  { tool: 'read_mock_customer_records', decision: 'REQUIRE_APPROVAL', desc: 'Accessing customer records requires explicit human approval.', req: 'customer:read' },
  { tool: 'export_mock_customer_data', decision: 'BLOCK', desc: 'Exporting customer data is strictly prohibited by policy.', req: 'customer:export' },
  { tool: 'send_simulated_email', decision: 'BLOCK', desc: 'Sending external emails is prohibited in the current environment.', req: 'email:send' },
  { tool: '*', decision: 'BLOCK', desc: 'Unknown or unauthorized tools are blocked by default.', req: 'none' },
];

export default function Policies() {
  return (
    <div className="space-y-6">
      <div className="bg-[#161618] border border-gray-800 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Lock className="w-6 h-6 text-accentViolet" />
          Backend Security Policies
        </h2>
        <p className="text-gray-400 max-w-3xl">
          The ProofGate policy engine operates independently of the AI model. 
          Even if a prompt injection attack successfully convinces the AI to recommend a prohibited action, 
          the backend policy engine will evaluate the requested tool and enforce the deterministic rules below.
        </p>
      </div>

      <div className="bg-[#161618] border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#1C1C1E] border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Target Tool</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Policy Decision</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Required Permission</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {policies.map((p, i) => (
              <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-5 text-sm text-gray-200 font-mono text-xs">{p.tool}</td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    p.decision === 'ALLOW' ? 'bg-successGreen/10 text-successGreen' :
                    p.decision === 'BLOCK' ? 'bg-errorRed/10 text-errorRed' :
                    'bg-warningAmber/10 text-warningAmber'
                  }`}>
                    {p.decision === 'ALLOW' ? <Shield className="w-3 h-3" /> : p.decision === 'BLOCK' ? <AlertTriangle className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                    {p.decision}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-gray-400">{p.desc}</td>
                <td className="px-6 py-5 text-sm text-gray-500 font-mono text-xs">{p.req}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
