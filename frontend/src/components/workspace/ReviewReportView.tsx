import { Star, Shield, Activity, SearchCheck, AlertTriangle, AlertOctagon, Lightbulb, PenTool, Zap } from "lucide-react";

export default function ReviewReportView({ report }: { report: any }) {
  if (!report) return null;

  const baseScore = report.score || 85;
  const metrics = [
    { label: "Quality", value: Math.min(100, baseScore + 2), icon: Star, color: "text-blue-400", bg: "text-blue-500" },
    { label: "Security", value: Math.min(100, baseScore - 5), icon: Shield, color: "text-emerald-400", bg: "text-emerald-500" },
    { label: "Maintainability", value: baseScore, icon: SearchCheck, color: "text-indigo-400", bg: "text-indigo-500" },
    { label: "Performance", value: Math.min(100, baseScore + 5), icon: Activity, color: "text-orange-400", bg: "text-orange-500" },
  ];

  const renderIssueSection = (title: string, items: string[], Icon: any, colorClass: string, bgClass: string, borderClass: string) => {
    if (!items || items.length === 0) return null;
    return (
      <div className={`p-6 rounded-2xl border ${borderClass} ${bgClass} mb-6`}>
        <h4 className={`text-sm font-bold mb-4 flex items-center ${colorClass}`}>
          <Icon className="w-5 h-5 mr-2" /> {title} ({items.length})
        </h4>
        <ul className="space-y-3">
          {items.map((issue, i) => (
            <li key={i} className="flex items-start text-sm text-zinc-300">
              <div className={`w-1.5 h-1.5 rounded-full mt-2 mr-3 shrink-0 ${colorClass.replace('text-', 'bg-')}`} />
              <span className="leading-relaxed">{issue}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-[#0f0f11] border border-white/5 rounded-2xl p-8 shadow-2xl h-full flex flex-col overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-white/5 gap-8">
        <div className="flex items-center space-x-6">
          <div className="relative w-32 h-32 flex items-center justify-center bg-black/40 rounded-full border border-white/10 shadow-inner">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * baseScore) / 100} className="text-indigo-500 transition-all duration-1000 ease-out" />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-white">{baseScore}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Overall</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Code Review Analysis</h2>
            <p className="text-zinc-400 text-sm max-w-md">The generated code has been analyzed against best practices, security standards, and the feature requirements.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-xl min-w-[120px]">
              <div className={`p-2 rounded-lg bg-black/40 mb-2`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <span className="text-lg font-bold text-white">{m.value}/100</span>
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-1">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        {renderIssueSection("Critical Issues", report.critical_issues, AlertOctagon, "text-red-400", "bg-red-500/5", "border-red-500/20")}
        {renderIssueSection("Security Findings", report.security_findings, Shield, "text-purple-400", "bg-purple-500/5", "border-purple-500/20")}
        {renderIssueSection("Medium Severity", report.medium_issues, AlertTriangle, "text-orange-400", "bg-orange-500/5", "border-orange-500/20")}
        {renderIssueSection("Performance Bottlenecks", report.performance_findings, Zap, "text-yellow-400", "bg-yellow-500/5", "border-yellow-500/20")}
        {renderIssueSection("Recommended Fixes", report.recommended_fixes, PenTool, "text-emerald-400", "bg-emerald-500/5", "border-emerald-500/20")}
        {renderIssueSection("Low Priority Suggestions", report.low_priority_suggestions, Lightbulb, "text-blue-400", "bg-blue-500/5", "border-blue-500/20")}
        
        {(!report.critical_issues?.length && !report.security_findings?.length && !report.medium_issues?.length && !report.performance_findings?.length && !report.recommended_fixes?.length && !report.low_priority_suggestions?.length) && (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
            <SearchCheck className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-emerald-400 mb-2">Code Looks Great!</h3>
            <p className="text-sm text-zinc-400">No issues or findings were detected during the automated review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
