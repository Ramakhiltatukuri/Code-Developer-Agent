import { Ticket, TestTube, FileCode2, BarChart2, TrendingUp } from "lucide-react";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";

export default function DashboardMetrics() {
  const history = useWorkspaceStore(state => state.history);

  const totalTickets = history.length;
  const totalTestCases = history.reduce((acc, h) => {
    const qaCount = (h.workflowResult.test_cases?.positive?.length || 0) +
                    (h.workflowResult.test_cases?.negative?.length || 0) +
                    (h.workflowResult.test_cases?.boundary?.length || 0);
    return acc + qaCount;
  }, 0);
  
  const totalFiles = history.reduce((acc, h) => {
    return acc + (h.workflowResult.generated_code?.files?.length || 0);
  }, 0);

  const avgScore = totalTickets > 0 ? Math.round(history.reduce((acc, h) => {
    return acc + (h.workflowResult.review_report?.score || 0);
  }, 0) / totalTickets) : 0;

  const metrics = [
    { label: "Tickets Processed", value: totalTickets.toString(), trend: "0%", icon: Ticket, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Test Cases Generated", value: totalTestCases.toString(), trend: "0%", icon: TestTube, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Files Generated", value: totalFiles.toString(), trend: "0%", icon: FileCode2, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Avg Quality Score", value: avgScore.toString() + "/100", trend: "0%", icon: BarChart2, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
      {metrics.map((m, i) => (
        <div key={i} className="bg-[#0f0f11] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-xl ${m.bg}`}>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
            {m.value !== "0" && m.value !== "0/100" && (
              <div className="flex items-center text-emerald-400 text-[10px] font-bold bg-emerald-400/10 px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3 mr-1" /> ACTIVE
              </div>
            )}
          </div>
          <div>
            <h3 className="text-zinc-400 text-sm font-medium">{m.label}</h3>
            <p className="text-3xl font-black text-white mt-1 tracking-tight">{m.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
