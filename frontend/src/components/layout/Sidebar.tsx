import { useState } from "react";
import { Sparkles, LayoutDashboard, History, Settings, User, Moon, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: History, label: "History", path: "/history" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <motion.div 
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-[#09090b] border-r border-white/5 flex flex-col h-full relative z-20 shadow-2xl shrink-0"
    >
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-[#18181b] border border-white/10 rounded-full p-1 z-30 text-zinc-400 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="p-6 h-20 border-b border-white/5 flex items-center shrink-0">
        <div className="flex items-center space-x-3 overflow-hidden whitespace-nowrap">
          <div className="p-2 bg-white rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.4)] shrink-0">
            <Sparkles className="w-5 h-5 text-black" fill="black" />
          </div>
          {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl font-bold tracking-tight text-white">Dev AI</motion.span>}
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) => `w-full flex items-center px-4 py-3 rounded-xl transition-all ${
              isActive
                ? "bg-white/10 text-white shadow-inner"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            } ${collapsed ? "justify-center" : "space-x-3"}`}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : ""}`} />
                {!collapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 space-y-2 shrink-0">
        <button 
          title={collapsed ? "Toggle Theme" : undefined}
          className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all text-zinc-400 hover:bg-white/5 hover:text-zinc-200 ${collapsed ? "justify-center" : "space-x-3"}`}
        >
          <Moon className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Dark Mode</span>}
        </button>
        
        <button 
          title={collapsed ? "Logout" : undefined}
          className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-all text-red-400 hover:bg-red-500/10 ${collapsed ? "justify-center" : "space-x-3"}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        <div className={`flex items-center p-3 mt-2 rounded-xl bg-white/5 border border-white/5 cursor-pointer ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-indigo-500/50 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col ml-3 overflow-hidden">
              <span className="text-sm font-semibold text-white whitespace-nowrap text-ellipsis">Akhil T.</span>
              <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap text-ellipsis">akhil@dev.ai</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
