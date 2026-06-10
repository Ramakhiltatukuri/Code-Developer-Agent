import { ClipboardCheck, Code2 } from "lucide-react";

export default function ActionCenter({ onGenerate }: { onGenerate: (mode: "QA" | "DEV") => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full shrink-0 mb-8">
      <button 
        onClick={() => onGenerate("QA")}
        className="group relative flex flex-col items-start p-8 rounded-[2rem] bg-gradient-to-br from-[#18181b] to-[#09090b] border border-white/5 hover:border-blue-500/50 transition-all text-left overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-colors"></div>
        
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-8 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.15)] relative z-10">
          <ClipboardCheck className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Generate Test Cases</h3>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-sm relative z-10">
          Generate Positive, Negative, Boundary, Security, Performance and Regression scenarios based on requirements.
        </p>
      </button>

      <button 
        onClick={() => onGenerate("DEV")}
        className="group relative flex flex-col items-start p-8 rounded-[2rem] bg-gradient-to-br from-[#18181b] to-[#09090b] border border-white/5 hover:border-emerald-500/50 transition-all text-left overflow-hidden"
      >
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full group-hover:bg-emerald-500/30 transition-colors"></div>
        
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-8 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.15)] relative z-10">
          <Code2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Generate Code</h3>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-sm relative z-10">
          Generate production-ready implementation, complete with architecture suggestions, using the Engineering Swarm.
        </p>
      </button>
    </div>
  );
}
