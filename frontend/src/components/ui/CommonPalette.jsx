import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { 
  Search, LayoutDashboard, FileText, BrainCircuit, Users, 
  UploadCloud, LogOut, User, Settings, TrendingUp, PieChart, 
  Bell, Sparkles, Shield, Activity, Home 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Listen for Ctrl+K or Cmd+K
  // Listen for Ctrl+K, Cmd+K, OR Custom Click Event from Navbar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };

    // This function runs when the Navbar search is clicked
    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

 const commands = [
    // Core Business Pages
    { name: "Go to Dashboard", icon: LayoutDashboard, action: () => navigate("/dashboard") },
    { name: "Sales Analytics", icon: TrendingUp, action: () => navigate("/sales-analytics") },
    { name: "Customer Analytics", icon: PieChart, action: () => navigate("/customers") },
    
    // AI Features
    { name: "View AI Insights", icon: Sparkles, action: () => navigate("/ai-insights") },
    { name: "Ask AI Chat", icon: BrainCircuit, action: () => navigate("/ai-chat") },
    
    // Tools & Data
    { name: "View Reports", icon: FileText, action: () => navigate("/reports") },
    { name: "Upload Data", icon: UploadCloud, action: () => navigate("/upload") },
    { name: "System Alerts", icon: Bell, action: () => navigate("/alerts") },
    
    // Admin & Management
    { name: "Manage Team", icon: Shield, action: () => navigate("/team") },
    { name: "Activity Logs", icon: Activity, action: () => navigate("/logs") },
    
    // Personal / Settings
    { name: "My Profile", icon: User, action: () => navigate("/profile") },
    { name: "Settings", icon: Settings, action: () => navigate("/settings") },
    { name: "Public Home Page", icon: Home, action: () => navigate("/") },
    
    // Actions
    { name: "Log Out", icon: LogOut, action: () => { logout(); navigate("/"); }, danger: true },
  ];

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (action) => {
    action();
    setIsOpen(false);
    setSearch("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm"
          />
          
          {/* Palette Modal */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-gray-200 dark:border-gray-800">
              <Search className="text-gray-400" size={20} />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full bg-transparent border-none outline-none px-4 text-gray-900 dark:text-white placeholder-gray-400 text-lg"
              />
              <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500 font-mono">ESC</div>
            </div>

            {/* Command List */}
            <div className="max-h-72 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No results found.</p>
              ) : (
                filteredCommands.map((cmd, index) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(cmd.action)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        cmd.danger 
                        ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{cmd.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;