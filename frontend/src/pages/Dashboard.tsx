import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Activity, Layers } from "lucide-react";
import DashboardMetrics from "../components/workspace/DashboardMetrics";
import TicketHero from "../components/workspace/TicketHero";
import ActionCenter from "../components/workspace/ActionCenter";
import CodeEditorView from "../components/workspace/CodeEditor";
import TestCaseView from "../components/workspace/TestCaseView";
import AgentFlow from "../components/workspace/AgentFlow";
import ReviewReportView from "../components/workspace/ReviewReportView";
import { useWorkspaceStore } from "../store/useWorkspaceStore";
import type { JobStatus } from "../lib/types";

export default function Dashboard() {
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"QA" | "DEV" | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  
  // Connect to Zustand store
  const ticketData = useWorkspaceStore(state => state.ticketData);
  const workflowResult = useWorkspaceStore(state => state.workflowResult);
  const generating = useWorkspaceStore(state => state.generating);
  const activeTab = useWorkspaceStore(state => state.activeTab);
  
  const setTicketData = useWorkspaceStore(state => state.setTicketData);
  const setWorkflowResult = useWorkspaceStore(state => state.setWorkflowResult);
  const setJobStatus = useWorkspaceStore(state => state.setJobStatus);
  const setGenerating = useWorkspaceStore(state => state.setGenerating);
  const setActiveTab = useWorkspaceStore(state => state.setActiveTab);
  const saveToHistory = useWorkspaceStore(state => state.saveToHistory);

  const handleFetchTicket = async () => {
    if (!ticketId) return;
    setLoading(true);
    setError("");
    setTicketData(null);
    setWorkflowResult(null);
    setMode(null);
    setJobId(null);
    setJobStatus(null);
    try {
      const response = await fetch("http://localhost:8000/api/ticket/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId })
      });
      const result = await response.json();
      if (response.ok && result.status === "success") {
        setTicketData(result.data);
      } else {
        setError(result.detail || "Failed to fetch ticket");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (selectedMode: "QA" | "DEV") => {
    setGenerating(true);
    setWorkflowResult(null);
    setError("");
    setMode(selectedMode);
    setActiveTab("FLOW");
    setJobId(null);
    setJobStatus(null);
    
    try {
      const response = await fetch("http://localhost:8000/api/jobs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketData?.id || ticketId, workflow_mode: selectedMode })
      });
      const result = await response.json();
      if (response.ok && result.status === "success") {
        setJobId(result.job_id);
      } else {
        setError(result.detail || "Failed to start generation job");
        setGenerating(false);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred starting generation");
      setGenerating(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobId && generating) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/jobs/${jobId}/status`);
          const data = await res.json();
          if (res.ok) {
            setJobStatus(data as JobStatus);
            if (data.status === "completed" || data.status === "failed") {
              setGenerating(false);
              clearInterval(interval);
              if (data.status === "completed") {
                const resultRes = await fetch(`http://localhost:8000/api/jobs/${jobId}/result`);
                const resultData = await resultRes.json();
                if (resultRes.ok) {
                   setWorkflowResult(resultData.data);
                   setActiveTab(mode === "QA" ? "QA" : "DEV");
                   // Ensure state updates completely before saving to history
                   setTimeout(() => {
                     saveToHistory();
                   }, 100);
                }
              } else {
                setError(data.error || "Job failed");
              }
            }
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [jobId, generating, mode]);

  return (
    <>
      <header className="h-14 shrink-0 border-b border-white/5 bg-zinc-950/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center w-full max-w-lg bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all shadow-inner">
          <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
          <input 
            placeholder="Search Jira Ticket (e.g., KAN-2) and press Enter..." 
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetchTicket()}
            className="bg-transparent border-none text-sm text-white placeholder:text-zinc-600 focus:outline-none w-full h-6"
          />
          {loading && <Activity className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />}
        </div>
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center">
          {error ? <span className="text-red-400">{error}</span> : "Workspace Ready"}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 flex flex-col relative z-0">
        <AnimatePresence mode="wait">
          {!ticketData ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center mt-20"
            >
              <div className="w-24 h-24 mb-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.1)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                <Layers className="w-10 h-10 text-indigo-400 relative z-10" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">AI Engineering Workspace</h2>
              <p className="mt-2 text-zinc-400 max-w-md text-sm leading-relaxed">
                Analyze Jira tickets, generate QA artifacts, and accelerate development. Enter a ticket ID in the top search bar to begin.
              </p>
            </motion.div>
          ) : (
            <motion.div key="workspace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col pb-12">
              
              <DashboardMetrics />
              <TicketHero ticketData={ticketData} />

              {!generating && !workflowResult ? (
                <ActionCenter onGenerate={handleGenerate} />
              ) : (
                <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col min-h-[600px]">
                  <div className="flex space-x-8 border-b border-white/5 mb-6 px-2 shrink-0 overflow-x-auto">
                    {["OVERVIEW", "REQUIREMENTS", "ARCHITECTURE", "QA", "DEV", "REPORT"].map((tab) => {
                        // Adjust tabs based on state
                        if (tab === "OVERVIEW") {
                          if (generating) return null;
                        }
                        // Dynamic flows
                        if (generating && tab === "FLOW") {
                          // Allow FLOW if generating
                        } else if (generating) return null;
                        
                        if (workflowResult && tab === "REQUIREMENTS" && !workflowResult.requirements) return null;
                        if (workflowResult && tab === "ARCHITECTURE" && !workflowResult.engineering_analysis) return null;
                        if (workflowResult && tab === "QA" && !workflowResult.test_cases) return null;
                        if (workflowResult && tab === "DEV" && !workflowResult.generated_code) return null;
                        if (workflowResult && tab === "REPORT" && !workflowResult.review_report) return null;

                        const isActive = activeTab === tab;

                        return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`pb-4 pt-2 text-xs font-bold tracking-[0.15em] transition-colors relative whitespace-nowrap ${
                            isActive ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {tab === "OVERVIEW" ? "FLOW" : tab}
                          {isActive && (
                            <motion.div 
                              layoutId="activeTabUnderlineMain"
                              className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-indigo-500 rounded-t-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" 
                            />
                          )}
                        </button>
                        )
                    })}
                  </div>

                  <div className="flex-1 overflow-hidden min-h-0 relative">
                    <AnimatePresence mode="wait">
                      {(activeTab === "FLOW" || activeTab === "OVERVIEW") && (
                        <motion.div key="flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                          <AgentFlow isGenerating={generating} mode={mode} />
                        </motion.div>
                      )}
                      
                      {activeTab === "DEV" && workflowResult?.generated_code && (
                        <motion.div key="dev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                          <CodeEditorView files={workflowResult.generated_code.files} />
                        </motion.div>
                      )}

                      {activeTab === "QA" && workflowResult?.test_cases && (
                        <motion.div key="qa" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2">
                          <TestCaseView testCases={workflowResult.test_cases} ticketId={ticketData.id} />
                        </motion.div>
                      )}

                      {activeTab === "REQUIREMENTS" && workflowResult?.requirements && (
                        <motion.div key="req" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2">
                          <div className="grid grid-cols-2 gap-6">
                            {Object.entries(workflowResult.requirements).map(([key, list]: [string, any]) => (
                              <div key={key} className="bg-zinc-950/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">{key.replace("_", " ")}</h3>
                                <ul className="space-y-3">
                                  {Array.isArray(list) ? list.map((item, i) => (
                                    <li key={i} className="flex items-start text-sm text-zinc-300">
                                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-3 shrink-0" />
                                      {item}
                                    </li>
                                  )) : <p className="text-zinc-600 text-sm">No items detected.</p>}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "ARCHITECTURE" && workflowResult?.engineering_analysis && (
                        <motion.div key="arch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2">
                          <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-white mb-4">Architecture Recommendation</h3>
                            <p className="text-zinc-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">{workflowResult.engineering_analysis.architecture_recommendation}</p>
                            
                            <div className="grid grid-cols-3 gap-4 mb-6">
                              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                 <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1 font-bold">Complexity</div>
                                 <div className="text-2xl font-semibold text-white">{workflowResult.engineering_analysis.complexity_score} / 100</div>
                              </div>
                              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                 <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1 font-bold">Risk Assessment</div>
                                 <div className="text-2xl font-semibold text-white">{workflowResult.engineering_analysis.risk_assessment}</div>
                              </div>
                              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                 <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1 font-bold">Story Points</div>
                                 <div className="text-2xl font-semibold text-white">{workflowResult.engineering_analysis.story_point_estimate}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-bold">Impacted Modules</div>
                                <div className="flex flex-wrap gap-2">
                                  {workflowResult.engineering_analysis.impacted_modules.map((m, i) => (
                                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-zinc-300">{m}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-bold">Dependencies</div>
                                <div className="flex flex-wrap gap-2">
                                  {workflowResult.engineering_analysis.dependencies.map((d, i) => (
                                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-zinc-300">{d}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "REPORT" && workflowResult?.review_report && (
                         <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 overflow-y-auto custom-scrollbar pr-2">
                           <ReviewReportView report={workflowResult.review_report} />
                         </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
