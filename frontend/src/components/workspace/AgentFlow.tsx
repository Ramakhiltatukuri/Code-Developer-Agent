import { useEffect } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "jira",
    type: "default",
    data: { label: "Jira Agent" },
    position: { x: 250, y: 0 },
    style: { background: "#1e1e24", color: "#fff", border: "1px solid #333", borderRadius: "8px", padding: "10px" },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: "req",
    type: "default",
    data: { label: "Requirement Agent" },
    position: { x: 250, y: 100 },
    style: { background: "#1e1e24", color: "#fff", border: "1px solid #333", borderRadius: "8px", padding: "10px" },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: "qa",
    type: "default",
    data: { label: "QA Test Agent" },
    position: { x: 100, y: 200 },
    style: { background: "#1e1e24", color: "#fff", border: "1px solid #333", borderRadius: "8px", padding: "10px" },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: "dev",
    type: "default",
    data: { label: "Code Generation Agent" },
    position: { x: 400, y: 200 },
    style: { background: "#1e1e24", color: "#fff", border: "1px solid #333", borderRadius: "8px", padding: "10px" },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: "review",
    type: "default",
    data: { label: "Review Agent" },
    position: { x: 400, y: 300 },
    style: { background: "#1e1e24", color: "#fff", border: "1px solid #333", borderRadius: "8px", padding: "10px" },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: "report",
    type: "default",
    data: { label: "Report Agent" },
    position: { x: 250, y: 400 },
    style: { background: "#1e1e24", color: "#fff", border: "1px solid #333", borderRadius: "8px", padding: "10px" },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
];

const initialEdges = [
  { id: "e1-2", source: "jira", target: "req", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e2-3", source: "req", target: "qa", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e2-4", source: "req", target: "dev", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e4-5", source: "dev", target: "review", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e3-6", source: "qa", target: "report", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e5-6", source: "review", target: "report", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function AgentFlow({ isGenerating, mode }: { isGenerating: boolean, mode: "QA" | "DEV" | null }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update edge animations and node colors based on state
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        let bg = "#1e1e24";
        let border = "1px solid #333";
        let boxShadow = "none";
        
        // Very basic mock highlighting for MVP
        if (isGenerating) {
           if (node.id === "jira" || node.id === "req") {
               bg = "#1e1b4b"; // indigo-950
               border = "1px solid #6366f1";
               boxShadow = "0 0 15px rgba(99,102,241,0.4)";
           }
           if (mode === "QA" && node.id === "qa") {
               bg = "#064e3b"; 
               border = "1px solid #10b981";
               boxShadow = "0 0 15px rgba(16,185,129,0.4)";
           }
           if (mode === "DEV" && (node.id === "dev" || node.id === "review")) {
               bg = "#064e3b"; 
               border = "1px solid #10b981";
               boxShadow = "0 0 15px rgba(16,185,129,0.4)";
           }
        }

        return {
          ...node,
          style: { ...node.style, background: bg, border, boxShadow },
        };
      })
    );

    setEdges((eds) => 
      eds.map(edge => ({
        ...edge,
        animated: isGenerating,
        style: { stroke: isGenerating ? "#6366f1" : "#333", strokeWidth: 2 }
      }))
    );
  }, [isGenerating, mode, setNodes, setEdges]);

  return (
    <div className="w-full h-[500px] border border-white/5 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        colorMode="dark"
      >
        <Background color="#333" gap={16} />
      </ReactFlow>
    </div>
  );
}
