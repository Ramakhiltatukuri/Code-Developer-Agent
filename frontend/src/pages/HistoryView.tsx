import { useNavigate } from "react-router-dom";
import { History, ArrowRight, Ticket, BarChart2 } from "lucide-react";
import { useWorkspaceStore } from "../store/useWorkspaceStore";

export default function HistoryView() {
  const history = useWorkspaceStore(state => state.history);
  const loadFromHistory = useWorkspaceStore(state => state.loadFromHistory);
  const navigate = useNavigate();

  const handleOpenWorkspace = (id: string) => {
    loadFromHistory(id);
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#09090b] text-zinc-100">
      <header className="h-14 shrink-0 border-b border-white/5 bg-zinc-950/40 px-6 flex items-center">
        <h1 className="text-sm font-bold text-white uppercase tracking-widest flex items-center">
          <History className="w-4 h-4 mr-2 text-indigo-400" /> Workspace History
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <History className="w-16 h-16 text-zinc-800 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">No History Yet</h2>
              <p className="text-zinc-500 text-sm">Processed tickets and generated code will appear here automatically.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((item, idx) => (
                <div key={idx} className="bg-[#0f0f11] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors shadow-lg flex items-center justify-between group">
                  <div className="flex items-center space-x-6">
                    <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20 text-indigo-400">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-bold text-white">{item.ticketData.id}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          COMPLETED
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400 line-clamp-1 max-w-lg">{item.ticketData.summary}</p>
                      <div className="flex items-center space-x-4 mt-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center"><BarChart2 className="w-3 h-3 mr-1 text-purple-400"/> Score: {item.workflowResult.review_report?.score || 0}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenWorkspace(item.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
