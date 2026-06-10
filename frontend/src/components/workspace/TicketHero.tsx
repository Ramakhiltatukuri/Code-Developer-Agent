import { ChevronDown, ListChecks } from "lucide-react";
import type { TicketData } from "../../lib/types";

export default function TicketHero({ ticketData }: { ticketData: TicketData }) {
  return (
    <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8 shadow-2xl mb-8 flex-shrink-0">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">{ticketData.id}</span>
          <h2 className="text-3xl font-bold text-white mt-2 leading-tight">{ticketData.summary}</h2>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                <span className="text-[10px] text-white font-medium">{ticketData.assignee?.charAt(0) || "U"}</span>
              </div>
              <span className="text-sm text-zinc-400">{ticketData.assignee || "Unassigned"}</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-sm text-zinc-400">Story Points: <span className="text-white font-medium">5</span></span>
          </div>
        </div>
        <div className="flex space-x-3">
          <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            {ticketData.status}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
            {ticketData.priority}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="group border border-white/5 bg-black/20 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between p-4 cursor-pointer">
              <span className="text-sm font-semibold text-white">Description</span>
              <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <div className="px-4 pb-4 text-sm text-zinc-400 max-h-32 overflow-y-auto custom-scrollbar border-t border-white/5 pt-4">
              {typeof ticketData.description === 'string' ? ticketData.description : "Complex description rendering not fully supported in plain text."}
            </div>
          </div>
        </div>
        
        <div className="col-span-1">
          <div className="border border-indigo-500/20 bg-indigo-500/5 rounded-xl p-5 h-full">
            <div className="flex items-center space-x-2 mb-3">
              <ListChecks className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-white">Acceptance Criteria</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start text-xs text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 shrink-0" />
                Must support edge cases for blank inputs.
              </li>
              <li className="flex items-start text-xs text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 shrink-0" />
                Performance within 200ms.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
