import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { LogIn, UploadCloud, DownloadCloud, Activity, Settings, User } from "lucide-react";
import API from "../../services/api";

const getIconConfig = (action) => {
  const act = action?.toLowerCase() || "";
  if (act.includes("login") || act.includes("auth")) return { icon: LogIn, bg: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" };
  if (act.includes("upload") || act.includes("import")) return { icon: UploadCloud, bg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" };
  if (act.includes("download") || act.includes("export")) return { icon: DownloadCloud, bg: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400" };
  if (act.includes("setting") || act.includes("config")) return { icon: Settings, bg: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300" };
  if (act.includes("user") || act.includes("profile")) return { icon: User, bg: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400" };
  return { icon: Activity, bg: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" };
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await API.get("/activity"); // Adjusted assuming this is your endpoint
        setLogs(res.data || []);
      } catch (err) {
        console.error("Activity Logs Error:", err);
        setError("Failed to load activity logs.");
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl space-y-6"
    >
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Activity Logs
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Comprehensive audit trail of user actions and system events.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
          <p className="font-medium">⚠️ {error}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
        
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                  <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-gray-500 dark:text-gray-400">
            No activity recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs.map((log) => {
              const { icon: Icon, bg: iconBg } = getIconConfig(log.action);
              const userName = log.user?.name || log.user?.email || "System";
              
              return (
                <div key={log._id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="font-semibold">{userName}</span>
                        <span className="text-gray-500 dark:text-gray-400 font-normal">performed</span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {log.action?.replace(/_/g, " ")}
                        </span>
                      </div>
                      {/* Optional details if your log object supports it */}
                      {log.details && (
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Motion.div>
  );
};

export default ActivityLogs;