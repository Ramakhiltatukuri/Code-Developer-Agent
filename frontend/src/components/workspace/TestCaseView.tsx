import { useState } from "react";
import { Download, CheckSquare, Bug, Shield, Activity, FileText, Copy, FileSpreadsheet, ChevronDown, FileJson } from "lucide-react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

export default function TestCaseView({ testCases, ticketId }: { testCases: Record<string, string[]>, ticketId: string }) {
  const [activeTab, setActiveTab] = useState(Object.keys(testCases)[0] || "positive");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const handleExportCSV = () => {
    let csv = "Category,Test Case ID,Description\n";
    Object.entries(testCases).forEach(([category, cases]) => {
      cases.forEach((tc, i) => {
        csv += `${category},TC-${(i + 1).toString().padStart(2, "0")},"${tc.replace(/"/g, '""')}"\n`;
      });
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `test_cases_${ticketId || "export"}.csv`);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(testCases, null, 2)], { type: "application/json" });
    saveAs(blob, `test_cases_${ticketId || "export"}.json`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text(`Test Cases - ${ticketId || "QA Report"}`, 20, y);
    y += 10;
    
    Object.entries(testCases).forEach(([category, cases]) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 255);
      doc.text(category.toUpperCase(), 20, y);
      y += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      
      cases.forEach((tc, i) => {
        const title = `TC-${(i + 1).toString().padStart(2, "0")}: ${tc.split('\n')[0]}`;
        const lines = doc.splitTextToSize(title, 170);
        if (y + (lines.length * 7) > 280) { doc.addPage(); y = 20; }
        doc.text(lines, 20, y);
        y += lines.length * 7 + 4;
      });
      y += 5;
    });
    
    doc.save(`test_cases_${ticketId || "export"}.pdf`);
  };

  const handleCopyAll = () => {
    const text = testCases[activeTab]?.map((tc, i) => `TC-${(i+1).toString().padStart(2, '0')}: ${tc}`).join('\n\n');
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const categories = Object.keys(testCases);

  const icons: any = {
    positive: <CheckSquare className="w-5 h-5 text-emerald-400" />,
    negative: <Bug className="w-5 h-5 text-red-400" />,
    security: <Shield className="w-5 h-5 text-purple-400" />,
    boundary: <Activity className="w-5 h-5 text-orange-400" />,
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat} className="bg-[#0A0A0F] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center shadow-lg">
            <div className="text-2xl font-bold text-white mb-1">{testCases[cat].length}</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold flex items-center">
              {icons[cat] || <FileText className="w-3 h-3 mr-1" />}
              {cat}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-[#0A0A0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 bg-[#0f0f11] px-4 py-2 sm:py-0">
          <div className="flex space-x-1 pt-2 w-full sm:w-auto overflow-x-auto custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveTab(cat); setExpanded({}); }}
                className={`px-4 py-3 text-sm font-semibold capitalize transition-all border-b-2 whitespace-nowrap ${
                  activeTab === cat
                    ? "border-indigo-500 text-indigo-300"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <button
              onClick={handleExportJSON}
              className="flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-zinc-300 transition-all border border-white/5"
            >
              <FileJson className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
              JSON
            </button>
            <button
              onClick={handleCopyAll}
              className="flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-zinc-300 transition-all border border-white/5"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              {copied ? "Copied!" : "Copy All"}
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold transition-all border border-emerald-500/20"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
              CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-xs font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              PDF
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-black/20 custom-scrollbar">
          <div className="space-y-3">
            {testCases[activeTab]?.map((tc, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-colors overflow-hidden"
              >
                <div 
                  className="px-5 py-4 flex items-start justify-between cursor-pointer"
                  onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
                >
                  <div className="flex items-start">
                    <span className="text-zinc-600 font-mono text-xs font-bold w-14 shrink-0 pt-0.5 tracking-wider">
                      TC-{(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-sm text-zinc-200 leading-relaxed font-medium">
                      {tc.split('\n')[0].substring(0, 80)}{tc.length > 80 ? '...' : ''}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${expanded[i] ? 'rotate-180' : ''}`} />
                </div>
                
                {expanded[i] && (
                  <div className="px-5 pb-4 pl-[76px] text-xs text-zinc-400 border-t border-white/5 pt-3">
                     <p className="whitespace-pre-wrap">{tc}</p>
                     <div className="mt-4 flex space-x-4 border-t border-white/5 pt-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Status: Draft</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">Priority: High</span>
                     </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
