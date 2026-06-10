import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Loader2, PlayCircle } from "lucide-react";
import type { JobStatus } from "../../lib/types";

export default function AgentStatusPanel({ generating, mode, jobStatus }: { generating: boolean, workflowResult: any, mode: "QA" | "DEV" | null, jobStatus: JobStatus | null }) {
  
  const hasNode = (nodeName: string) => {
    return jobStatus?.timeline?.some(t => t.node === nodeName) ?? false;
  };

  const getNodeTime = (nodeName: string) => {
    const event = jobStatus?.timeline?.find(t => t.node === nodeName);
    if (!event) return null;
    return new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const agents = [
    { id: "jira_node", name: "Jira Agent", active: generating && !hasNode("jira_node"), done: hasNode("jira_node") },
    { id: "requirement_node", name: "Requirement Analyst", active: generating && hasNode("jira_node") && !hasNode("requirement_node"), done: hasNode("requirement_node") },
    { id: "analysis_node", name: "Architecture Agent", active: generating && hasNode("requirement_node") && !hasNode("analysis_node"), done: hasNode("analysis_node") },
    { id: "testcase_node", name: "Test Generator", active: generating && mode === "QA" && hasNode("analysis_node") && !hasNode("testcase_node"), done: hasNode("testcase_node") },
    { id: "codegen_node", name: "Code Generator", active: generating && mode === "DEV" && hasNode("analysis_node") && !hasNode("codegen_node"), done: hasNode("codegen_node") },
    { id: "review_node", name: "Review Agent", active: generating && mode === "DEV" && hasNode("codegen_node") && !hasNode("review_node"), done: hasNode("review_node") },
  ];

  return (
    <div className="w-[320px] bg-[#09090b] border-l border-white/5 h-full flex flex-col shadow-2xl relative z-20 shrink-0">
      <div className="p-6 border-b border-white/5 h-20 shrink-0 flex items-center">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center">
          <PlayCircle className="w-4 h-4 mr-2 text-indigo-400" /> Live Workflow
        </h3>
      </div>
      
      <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
        {agents.map((agent) => {
          if (!agent.active && !agent.done && !generating) return null; 
          // Hide nodes that belong to the other mode
          if (mode === "QA" && (agent.id === "codegen_node" || agent.id === "review_node")) return null;
          if (mode === "DEV" && agent.id === "testcase_node") return null;
          
          let statusColor = "text-zinc-600";
          let Icon = CircleDashed;
          let bgClass = "bg-white/5 border-white/5";
          
          if (agent.done) {
            statusColor = "text-emerald-400";
            Icon = CheckCircle2;
            bgClass = "bg-emerald-500/5 border-emerald-500/20";
          } else if (agent.active) {
            statusColor = "text-indigo-400";
            Icon = Loader2;
            bgClass = "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]";
          }

          return (
            <motion.div 
              key={agent.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-xl border flex items-center space-x-3 transition-all ${bgClass}`}
            >
              <div className={statusColor}>
                <Icon className={`w-5 h-5 ${agent.active && !agent.done ? 'animate-spin' : ''}`} />
              </div>
              <div className="flex flex-col flex-1">
                <span className={`text-sm font-semibold ${agent.done ? 'text-white' : agent.active ? 'text-indigo-100' : 'text-zinc-400'}`}>
                  {agent.name}
                </span>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
                    {agent.done ? "Completed" : agent.active ? "Executing..." : "Pending"}
                  </span>
                  {agent.done && (
                    <span className="text-[9px] font-mono text-zinc-600">{getNodeTime(agent.id)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        
        {/* Activity Timeline */}
        {jobStatus?.timeline && jobStatus.timeline.length > 0 && (
          <div className="pt-8 mt-8 border-t border-white/5">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Activity Timeline</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[9px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {jobStatus.timeline.slice().reverse().map((event, idx) => (
                 <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                   <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/10 bg-zinc-900 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                     <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                   </div>
                   <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg bg-white/5 border border-white/10">
                     <div className="flex items-center justify-between space-x-2 mb-1">
                       <div className="font-bold text-[11px] text-white capitalize">{event.node.replace('_node', '')} Completed</div>
                     </div>
                     <div className="text-[9px] font-mono text-zinc-500">{new Date(event.timestamp).toLocaleTimeString()}</div>
                   </div>
                 </div>
              ))}
              {jobStatus.status === "completed" && (
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mt-6">
                   <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white/10 bg-zinc-900 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                     <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                   </div>
                   <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                     <div className="font-bold text-[11px] text-emerald-400">Workflow Complete</div>
                     <div className="text-[9px] text-emerald-600/70">All tasks finished successfully.</div>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
