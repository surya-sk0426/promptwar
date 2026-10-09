import React, { useEffect, useState } from 'react';
import { FileText, ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function AuditLogs() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/audit')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#161618] border border-gray-800 rounded-xl flex flex-col h-[calc(100vh-6rem)] overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-accentBlue" />
          Security Audit Logs
        </h2>
        <p className="text-sm text-gray-400 mt-1">Immutable record of all AI actions, policy decisions, and execution outcomes.</p>
      </div>

      <div className="flex-1 overflow-auto p-0">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading audit events...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1C1C1E] sticky top-0 z-10 shadow">
              <tr>
                <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Requested Action</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Decision</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Outcome</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Threat Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {events.map((event, i) => (
                <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-mono text-xs">
                    {event.requested_action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${event.policy_decision === 'ALLOW' ? 'bg-successGreen/10 text-successGreen border border-successGreen/20' :
                        event.policy_decision === 'BLOCK' ? 'bg-errorRed/10 text-errorRed border border-errorRed/20' :
                          'bg-warningAmber/10 text-warningAmber border border-warningAmber/20'
                      }`}>
                      {event.policy_decision}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {event.execution_outcome.replace(/_/g, ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {event.threat_categories.replace(/_/g, ' ')}
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No audit events found. Run a scenario in the Attack Lab first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
