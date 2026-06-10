import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { Search, LayoutDashboard, History, Settings, Ticket } from "lucide-react";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";
import "../../styles/cmdk.css";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const history = useWorkspaceStore(state => state.history);
  const loadFromHistory = useWorkspaceStore(state => state.loadFromHistory);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-[#0f0f11] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <Command label="Global Command Menu" className="flex flex-col w-full h-full bg-transparent">
          <div className="flex items-center px-4 border-b border-white/5 shrink-0">
            <Search className="w-5 h-5 text-zinc-500 mr-2 shrink-0" />
            <Command.Input 
              autoFocus 
              placeholder="Search Dev AI workspace... (Type a ticket ID or command)"
              className="flex-1 bg-transparent border-none py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-0 text-lg"
            />
            <div className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-1 rounded">ESC</div>
          </div>

          <Command.List className="flex-1 overflow-y-auto p-2 custom-scrollbar text-white">
            <Command.Empty className="p-6 text-center text-zinc-500 text-sm">No results found.</Command.Empty>

            <Command.Group heading="Navigation" className="text-xs font-semibold text-zinc-500 px-2 py-2">
              <Command.Item 
                onSelect={() => runCommand(() => navigate("/"))}
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400 cursor-pointer text-sm font-medium text-zinc-300 transition-colors my-1 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-400"
              >
                <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => navigate("/history"))}
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400 cursor-pointer text-sm font-medium text-zinc-300 transition-colors my-1 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-400"
              >
                <History className="w-4 h-4 mr-3" /> History
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => navigate("/settings"))}
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-400 cursor-pointer text-sm font-medium text-zinc-300 transition-colors my-1 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-400"
              >
                <Settings className="w-4 h-4 mr-3" /> Settings
              </Command.Item>
            </Command.Group>

            {history.length > 0 && (
              <Command.Group heading="Recent Workspaces" className="text-xs font-semibold text-zinc-500 px-2 py-2 border-t border-white/5">
                {history.map((h, i) => (
                  <Command.Item 
                    key={i}
                    onSelect={() => runCommand(() => { loadFromHistory(h.id); navigate("/"); })}
                    className="flex items-center px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-sm font-medium text-zinc-300 transition-colors my-1 aria-selected:bg-white/5"
                  >
                    <Ticket className="w-4 h-4 mr-3 text-indigo-400" />
                    {h.id}
                    <span className="ml-3 text-zinc-500 text-xs truncate max-w-xs font-normal">{h.ticketData.summary}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
      <div className="absolute inset-0 z-[-1]" onClick={() => setOpen(false)} />
    </div>
  );
}
