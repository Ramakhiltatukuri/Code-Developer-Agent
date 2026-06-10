import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TicketData, WorkflowResult, JobStatus } from '../lib/types';

export interface WorkspaceState {
  // Current active workspace
  ticketData: TicketData | null;
  workflowResult: WorkflowResult | null;
  jobStatus: JobStatus | null;
  generating: boolean;
  activeTab: string;
  
  // Actions
  setTicketData: (data: TicketData | null) => void;
  setWorkflowResult: (result: WorkflowResult | null) => void;
  setJobStatus: (status: JobStatus | null) => void;
  setGenerating: (generating: boolean) => void;
  setActiveTab: (tab: string) => void;
  
  // History
  history: {
    id: string;
    date: string;
    ticketData: TicketData;
    workflowResult: WorkflowResult;
  }[];
  saveToHistory: () => void;
  loadFromHistory: (id: string) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      ticketData: null,
      workflowResult: null,
      jobStatus: null,
      generating: false,
      activeTab: "OVERVIEW",
      history: [],

      setTicketData: (data) => set({ ticketData: data }),
      setWorkflowResult: (result) => set({ workflowResult: result }),
      setJobStatus: (status) => set({ jobStatus: status }),
      setGenerating: (generating) => set({ generating }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      saveToHistory: () => {
        const { ticketData, workflowResult, history } = get();
        if (!ticketData || !workflowResult) return;
        
        // Prevent duplicate saves of the same ticket, update instead
        const existingIdx = history.findIndex(h => h.id === ticketData.id);
        
        const snapshot = {
          id: ticketData.id,
          date: new Date().toISOString(),
          ticketData,
          workflowResult
        };

        if (existingIdx >= 0) {
          const newHistory = [...history];
          newHistory[existingIdx] = snapshot;
          set({ history: newHistory });
        } else {
          set({ history: [snapshot, ...history] });
        }
      },

      loadFromHistory: (id: string) => {
        const item = get().history.find(h => h.id === id);
        if (item) {
          set({
            ticketData: item.ticketData,
            workflowResult: item.workflowResult,
            jobStatus: { job_id: "historical", status: "completed", timeline: [] },
            generating: false,
            activeTab: "OVERVIEW"
          });
        }
      },

      clearWorkspace: () => set({
        ticketData: null,
        workflowResult: null,
        jobStatus: null,
        generating: false,
        activeTab: "OVERVIEW"
      })
    }),
    {
      name: 'dev-ai-workspace-storage',
      // We don't want to persist 'generating' or 'jobStatus' as they are ephemeral to a specific browser session
      partialize: (state) => ({ 
        ticketData: state.ticketData,
        workflowResult: state.workflowResult,
        activeTab: state.activeTab,
        history: state.history
      }),
    }
  )
);
