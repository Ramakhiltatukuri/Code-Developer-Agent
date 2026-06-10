import { useState, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { 
  FileJson, FileCode2, Copy, Check, FolderOpen, Maximize2, 
  Download, Archive, Search, FileText, Image as ImageIcon, Database 
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { CodeFile } from "../../lib/types";

export default function CodeEditorView({ files }: { files: CodeFile[] }) {
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-zinc-500 text-sm bg-[#09090b] rounded-2xl border border-white/5">
        <FolderOpen className="w-12 h-12 mb-4 text-zinc-700" />
        No code files generated.
      </div>
    );
  }

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    return files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [files, searchQuery]);

  // Adjust active index if filtering hides the active file
  const displayActiveFile = filteredFiles.length > 0 ? (filteredFiles.includes(files[activeFileIdx]) ? files[activeFileIdx] : filteredFiles[0]) : null;

  const handleCopy = () => {
    if (!displayActiveFile) return;
    navigator.clipboard.writeText(displayActiveFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!displayActiveFile) return;
    const blob = new Blob([displayActiveFile.content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, displayActiveFile.name.split('/').pop() || "file.txt");
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    files.forEach(f => {
      zip.file(f.name, f.content);
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "generated-code.zip");
  };

  const getFileIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.endsWith(".py") || n.endsWith(".js") || n.endsWith(".ts") || n.endsWith(".jsx") || n.endsWith(".tsx")) {
      return <FileCode2 className="w-4 h-4 mr-2.5 opacity-70 text-blue-400" />;
    }
    if (n.endsWith(".json")) {
      return <FileJson className="w-4 h-4 mr-2.5 opacity-70 text-yellow-400" />;
    }
    if (n.endsWith(".md") || n.endsWith(".txt")) {
      return <FileText className="w-4 h-4 mr-2.5 opacity-70 text-zinc-400" />;
    }
    if (n.endsWith(".sql") || n.endsWith(".db")) {
      return <Database className="w-4 h-4 mr-2.5 opacity-70 text-purple-400" />;
    }
    if (n.endsWith(".png") || n.endsWith(".svg") || n.endsWith(".jpg")) {
      return <ImageIcon className="w-4 h-4 mr-2.5 opacity-70 text-emerald-400" />;
    }
    return <FileCode2 className="w-4 h-4 mr-2.5 opacity-70" />;
  };

  return (
    <div className={`flex bg-[#0A0A0F] shadow-2xl transition-all ${isFullscreen ? "fixed inset-0 z-[100] h-screen border-none rounded-none" : "h-full min-h-[600px] border border-white/10 rounded-2xl overflow-hidden"}`}>
      {/* File Tree Sidebar (Left) */}
      <div className="w-64 border-r border-white/5 bg-[#0f0f11] flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
          <div className="flex items-center"><FolderOpen className="w-3 h-3 mr-2" /> Explorer</div>
          <button onClick={handleDownloadZip} title="Download All as ZIP" className="hover:text-white transition-colors">
            <Archive className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="px-3 py-2 border-b border-white/5">
           <div className="flex items-center bg-black/40 border border-white/10 rounded-md px-2 py-1">
             <Search className="w-3 h-3 text-zinc-500 mr-2" />
             <input 
               type="text" 
               placeholder="Search files..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
             />
           </div>
        </div>
        <div className="flex-1 overflow-auto py-2 custom-scrollbar">
          {filteredFiles.map((file) => {
            const idx = files.indexOf(file);
            return (
              <button
                key={idx}
                onClick={() => setActiveFileIdx(idx)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center transition-colors ${
                  activeFileIdx === idx
                    ? "bg-indigo-500/10 text-indigo-300 border-l-2 border-indigo-500 font-medium"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border-l-2 border-transparent"
                }`}
              >
                {getFileIcon(file.name)}
                <span className="truncate">{file.name.split('/').pop()}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Editor Main Area (Center - Full Width) */}
      <div className="flex-1 flex flex-col min-w-0 relative z-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0f0f11]">
          <div className="flex items-center space-x-2 text-sm text-zinc-300 font-mono bg-white/5 px-3 py-1 rounded-md border border-white/10">
            {displayActiveFile ? displayActiveFile.name : "No file selected"}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> : <Copy className="w-3.5 h-3.5 text-zinc-400 mr-1.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={handleDownloadFile}
              className="flex items-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400 mr-1.5" /> Download
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          {displayActiveFile ? (
            <Editor
              height="100%"
              theme="vs-dark"
              path={displayActiveFile.name}
              defaultLanguage={displayActiveFile.name.endsWith(".py") ? "python" : (displayActiveFile.name.endsWith(".json") ? "json" : "typescript")}
              value={displayActiveFile.content}
              options={{
                readOnly: true,
                minimap: { enabled: true, scale: 0.75 },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                renderLineHighlight: "all",
                wordWrap: "on"
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">
              No content to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
