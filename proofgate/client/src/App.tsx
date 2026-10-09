import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, ShieldAlert, FlaskConical, FileText, Settings, Info, Activity } from 'lucide-react';
import Overview from './pages/Overview';
import Analyze from './pages/Analyze';
import AttackLab from './pages/AttackLab';
import AuditLogs from './pages/AuditLogs';
import Policies from './pages/Policies';
import About from './pages/About';

function App() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/analyze', label: 'Analyze Content', icon: ShieldAlert },
    { path: '/attack-lab', label: 'Attack Lab', icon: FlaskConical },
    { path: '/audit-logs', label: 'Audit Logs', icon: FileText },
    { path: '/policies', label: 'Policies', icon: Settings },
    { path: '/about', label: 'About ProofGate', icon: Info },
  ];

  return (
    <div className="flex h-screen bg-graphite text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-[#161618] flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="bg-accentViolet p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ProofGate</h1>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-accentBlue' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <Activity className="w-4 h-4 text-successGreen animate-pulse" />
            <div className="text-xs">
              <p className="text-gray-300 font-medium">System Status</p>
              <p className="text-successGreen">Active & Protecting</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-800 bg-[#161618]/50 backdrop-blur flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-gray-200">
            {navItems.find(i => i.path === location.pathname)?.label || 'ProofGate'}
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-accentBlue/10 text-accentBlue border border-accentBlue/20">
              <Shield className="w-4 h-4" />
              Local Test Mode
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/attack-lab" element={<AttackLab />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
