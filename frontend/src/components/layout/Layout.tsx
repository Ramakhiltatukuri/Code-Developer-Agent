import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AgentStatusPanel from "./AgentStatusPanel";
import CommandPalette from "./CommandPalette";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";

export default function Layout() {
  const generating = useWorkspaceStore(state => state.generating);
  const workflowResult = useWorkspaceStore(state => state.workflowResult);
  const jobStatus = useWorkspaceStore(state => state.jobStatus);
  const activeTab = useWorkspaceStore(state => state.activeTab);
  
  return (
    <div className="flex h-screen bg-[#060608] text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/10 rounded-full mix-blend-screen blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-900/10 rounded-full mix-blend-screen blur-[120px] opacity-40"></div>
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10 overflow-hidden bg-[#09090b]">
        <Outlet />
      </div>

      <AgentStatusPanel generating={generating} workflowResult={workflowResult} mode={activeTab === "QA" ? "QA" : "DEV"} jobStatus={jobStatus} />
      <CommandPalette />
    </div>
  );
}
