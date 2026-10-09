import React from 'react';
import { Shield, Activity, Lock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Overview() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accentViolet/20 via-graphite to-accentBlue/20 border border-gray-800 p-8 sm:p-10">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Shield className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trust the task. <span className="text-accentBlue">Verify the action.</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            ProofGate is an AI-agent security gateway that analyzes untrusted content, identifies suspicious instructions, evaluates requested actions, and independently enforces backend permissions.
          </p>
          <div className="flex gap-4">
            <Link to="/analyze" className="px-6 py-3 bg-accentBlue hover:bg-accentBlue/90 text-white font-medium rounded-lg transition-colors shadow-lg shadow-accentBlue/20">
              Test Security Gateway
            </Link>
            <Link to="/attack-lab" className="px-6 py-3 bg-[#1C1C1E] border border-gray-700 hover:border-gray-500 text-gray-200 font-medium rounded-lg transition-colors">
              Enter Attack Lab
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Threats Blocked', value: '142', icon: Shield, color: 'text-errorRed', bg: 'bg-errorRed/10' },
          { label: 'Actions Allowed', value: '891', icon: Activity, color: 'text-successGreen', bg: 'bg-successGreen/10' },
          { label: 'Pending Approvals', value: '3', icon: Users, color: 'text-warningAmber', bg: 'bg-warningAmber/10' },
          { label: 'Active Policies', value: '12', icon: Lock, color: 'text-accentBlue', bg: 'bg-accentBlue/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161618] border border-gray-800 rounded-xl p-6 flex items-center gap-4">
            <div className={`${stat.bg} p-3 rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Differentiators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161618] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Deterministic Policy</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            The AI recommends an action, but the backend policy engine is the sole authority. LLM hallucinations cannot bypass security controls.
          </p>
        </div>
        <div className="bg-[#161618] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Human-in-the-loop</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Sensitive actions can be routed for explicit human approval, binding the authorization directly to the exact requested parameters.
          </p>
        </div>
        <div className="bg-[#161618] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Immutable Audit</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Every analysis, decision, and outcome is recorded, providing clear explainability and a verifiable trail of security enforcement.
          </p>
        </div>
      </div>
    </div>
  );
}
