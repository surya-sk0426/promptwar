import React from 'react';
import { Shield, Server, FileLock2, BrainCircuit } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <div className="mx-auto w-16 h-16 bg-accentViolet/20 rounded-2xl flex items-center justify-center mb-6 border border-accentViolet/30">
          <Shield className="w-8 h-8 text-accentViolet" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">ProofGate Architecture</h1>
        <p className="text-xl text-gray-400">The Security Firewall for AI Agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#161618] border border-gray-800 rounded-xl p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-accentBlue/20 rounded-xl flex items-center justify-center border border-accentBlue/30 mb-6">
            <BrainCircuit className="w-6 h-6 text-accentBlue" />
          </div>
          <h3 className="text-xl font-bold text-white">AI Threat Analyzer (Gemini)</h3>
          <p className="text-gray-400 leading-relaxed text-sm">
            ProofGate uses the Gemini API to analyze untrusted inputs. The system prompt is engineered to treat all input as untrusted data, extracting observations and proposed tool calls into a strict JSON schema via Zod validation. The AI recommends a threat classification and identifies requested actions, but has absolutely zero authorization capability.
          </p>
        </div>

        <div className="bg-[#161618] border border-gray-800 rounded-xl p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-errorRed/20 rounded-xl flex items-center justify-center border border-errorRed/30 mb-6">
            <Server className="w-6 h-6 text-errorRed" />
          </div>
          <h3 className="text-xl font-bold text-white">Independent Policy Engine</h3>
          <p className="text-gray-400 leading-relaxed text-sm">
            A deterministic Node.js backend intercepts every requested tool call. It evaluates the requested tool against a strict, immutable policy matrix. Unknown tools, data export requests, and external communications are blocked unconditionally. Actions requiring approval are paused pending human verification.
          </p>
        </div>
      </div>

      <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FileLock2 className="w-6 h-6 text-successGreen" />
          The Prompt Injection Problem
        </h3>
        <p className="text-gray-300 leading-relaxed mb-6">
          LLMs are susceptible to prompt injection because they fundamentally process instructions and data through the same natural language interface. An attacker can embed malicious instructions inside an email or document that the AI is asked to process.
        </p>
        <p className="text-gray-300 leading-relaxed">
          <strong>ProofGate solves this not by trying to build an unhackable prompt, but by establishing a defensible security boundary.</strong> Even if an attacker successfully tricks the AI into requesting the exfiltration of customer records, the independent backend policy engine will intercept and block the action.
        </p>
      </div>
    </div>
  );
}
