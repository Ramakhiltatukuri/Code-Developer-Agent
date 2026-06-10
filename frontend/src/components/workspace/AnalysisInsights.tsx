import { AlertTriangle, ShieldAlert, Cpu, Activity, Database, LayoutTemplate, Zap } from "lucide-react";

export default function AnalysisInsights() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 shrink-0">
      {/* Column 1: AI Insights */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center">
          <Zap className="w-3 h-3 mr-2" /> AI Insights
        </h3>
        
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-400">Security Validation Missing</h4>
            <p className="text-xs text-red-400/80 mt-1">Ticket lacks details on input sanitization for the generated endpoints.</p>
          </div>
        </div>

        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-orange-400">Edge Cases Not Defined</h4>
            <p className="text-xs text-orange-400/80 mt-1">Empty states and failure scenarios are not explicitly stated in requirements.</p>
          </div>
        </div>
      </div>

      {/* Column 2: Complexity & Architecture */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center">
          <Cpu className="w-3 h-3 mr-2" /> Engineering Analysis
        </h3>
        
        <div className="bg-[#0f0f11] border border-white/5 rounded-xl p-6 shadow-lg flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Complexity Score</h4>
            <p className="text-xs text-zinc-500 mt-1">Based on required components</p>
            <div className="mt-3 inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
              6/10 Medium
            </div>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset="70" className="text-orange-500" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">60%</span>
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-white/5 rounded-xl p-5 shadow-lg">
          <h4 className="text-sm font-semibold text-white mb-3">Recommended Architecture</h4>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold"><Database className="w-3 h-3 mr-1" /> Models</span>
            <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold"><Activity className="w-3 h-3 mr-1" /> APIs</span>
            <span className="inline-flex items-center px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-semibold"><LayoutTemplate className="w-3 h-3 mr-1" /> Views</span>
          </div>
        </div>
      </div>

      {/* Column 3: Effort Estimation */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center">
          <Activity className="w-3 h-3 mr-2" /> Effort Estimation
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0f0f11] border border-white/5 rounded-xl p-4 text-center">
            <p className="text-xs text-zinc-500 font-medium">Frontend</p>
            <p className="text-xl font-bold text-white mt-1">2d</p>
          </div>
          <div className="bg-[#0f0f11] border border-white/5 rounded-xl p-4 text-center">
            <p className="text-xs text-zinc-500 font-medium">Backend</p>
            <p className="text-xl font-bold text-white mt-1">3d</p>
          </div>
          <div className="bg-[#0f0f11] border border-white/5 rounded-xl p-4 text-center">
            <p className="text-xs text-zinc-500 font-medium">Testing</p>
            <p className="text-xl font-bold text-white mt-1">1.5d</p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
            <p className="text-xs text-indigo-400 font-medium">Total</p>
            <p className="text-xl font-bold text-indigo-400 mt-1">6.5d</p>
          </div>
        </div>
      </div>
    </div>
  );
}
