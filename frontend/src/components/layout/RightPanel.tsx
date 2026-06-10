import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";

export default function RightPanel({
  generating,
  workflowResult,
  mode,
}: {
  generating: boolean;
  workflowResult: any;
  mode: "QA" | "DEV" | null;
}) {
  const agents = [
    { id: "jira", name: "Jira Fetch Agent", time: "120ms" },
    { id: "req", name: "Requirement Agent", time: "1.2s" },
    { id: "qa", name: "Test Agent", time: "2.4s" },
    { id: "dev", name: "Code Generation Agent", time: "3.1s" },
    { id: "review", name: "Review Agent", time: "800ms" },
    { id: "report", name: "Report Agent", time: "50ms" },
  ];

  const getStatus = (id: string) => {
    if (!generating && !workflowResult) return "idle";
    
    if (workflowResult) {
      if (mode === "QA" && (id === "dev" || id === "review")) return "skipped";
      if (mode === "DEV" && id === "qa") return "skipped";
      return "complete";
    }

    if (generating) {
      // Very basic simulated status for MVP since no websocket stream exists
      if (id === "jira" || id === "req") return "complete";
      if (mode === "QA" && id === "qa") return "running";
      if (mode === "DEV" && id === "dev") return "running";
      return "pending";
    }
  };

  return (
    <div className="w-[320px] bg-zinc-950/50 border-l border-white/5 backdrop-blur-3xl flex flex-col h-full shadow-2xl relative z-20">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center">
          <ActivityIcon />
          Activity Feed
        </h2>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
        {agents.map((agent) => {
          const status = getStatus(agent.id);
          
          let Icon = CircleDashed;
          let color = "text-zinc-600";
          let bg = "bg-zinc-900/50 border-white/5";
          
          if (status === "running") {
            Icon = Loader2;
            color = "text-indigo-400";
            bg = "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]";
          } else if (status === "complete") {
            Icon = CheckCircle2;
            color = "text-emerald-400";
            bg = "bg-emerald-500/10 border-emerald-500/20";
          } else if (status === "skipped") {
            color = "text-zinc-700";
            bg = "bg-transparent border-transparent opacity-50";
          }

          return (
            <motion.div
              key={agent.id}
              layout
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${bg}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${color} ${status === "running" ? "animate-spin" : ""}`} />
                <span className={`text-xs font-semibold ${status === "skipped" ? "text-zinc-600 line-through" : "text-zinc-300"}`}>
                  {agent.name}
                </span>
              </div>
              {status === "complete" && <span className="text-[10px] text-zinc-500 font-mono">{agent.time}</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityIcon() {
  return (
    <svg className="w-4 h-4 text-indigo-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
