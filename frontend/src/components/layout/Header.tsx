import { Search, Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="h-14 shrink-0 border-b border-white/5 bg-zinc-950/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center w-full max-w-lg bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all shadow-inner">
        <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
        <input 
          placeholder="Search workspace..." 
          className="bg-transparent border-none text-sm text-white placeholder:text-zinc-600 focus:outline-none w-full h-6"
        />
        <div className="flex items-center ml-2 space-x-1 shrink-0">
           <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-white/5 rounded border border-white/10">⌘</kbd>
           <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-white/5 rounded border border-white/10">K</kbd>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 shrink-0 ml-4">
        <button className="text-zinc-400 hover:text-white relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full border border-zinc-950"></span>
        </button>
        <div className="h-4 w-px bg-white/10 mx-1"></div>
        <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center border border-white/10 shadow-lg cursor-pointer hover:opacity-90 transition-opacity">
          <User className="w-4 h-4 text-white" />
        </button>
      </div>
    </header>
  );
}
