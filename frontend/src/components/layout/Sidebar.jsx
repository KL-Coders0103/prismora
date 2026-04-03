import React, { useMemo } from "react";
import {
  LayoutDashboard, BarChart3, Users, Upload, FileText,
  Settings, Brain, Bell, Clock, User, X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../utils/permissions";

const menu = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", key: "dashboard" },
  { icon: Brain, label: "AI Insights", path: "/ai-insights", key: "aiInsights" },
  { icon: Brain, label: "AI Assistant", path: "/ai-chat", key: "aiChat" },
  { icon: BarChart3, label: "Sales Analytics", path: "/sales-analytics", key: "sales" },
  { icon: Users, label: "Customer Analytics", path: "/customers", key: "customers" },
  { icon: Upload, label: "Upload Data", path: "/upload", key: "upload" },
  { icon: FileText, label: "Reports", path: "/reports", key: "reports" },
  { icon: Bell, label: "Alerts", path: "/alerts", key: "alerts" },
  { icon: Users, label: "Team Management", path: "/team", key: "team" },
  { icon: Clock, label: "Activity Logs", path: "/logs", key: "logs" },
  { icon: User, label: "Profile", path: "/profile", key: "profile" },
  { icon: Settings, label: "Settings", path: "/settings", key: "settings" }
];

const Sidebar = ({ open, setOpen }) => {
  const { user } = useAuth();

  // ✅ SAFE + OPTIMIZED RBAC FILTER
  const filteredMenu = useMemo(() => {
    if (!user) return [];

    return menu.filter((item) =>
      PERMISSIONS[item.key]?.includes(user.role?.toLowerCase())
    );
  }, [user]);

  return (
    <aside
      className={`fixed md:static top-0 left-0 z-40 h-screen w-64 flex flex-col
      bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800
      transform ${open ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      {/* LOGO */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            PRISMORA
          </h1>
        </div>
        <button 
          className="md:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4 custom-scrollbar">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          return (
            <Motion.div whileHover={{ x: 4 }} key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200"
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                {item.label}
              </NavLink>
            </Motion.div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;