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

// ✅ SAFE DATE FORMATTER
const formatDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Unknown";
  return {
    date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
};

// ✅ SAFE STRINGIFY
const safeStringify = (data) => {
  try {
    return typeof data === "string" ? data : JSON.stringify(data);
  } catch {
    return "Details unavailable";
  }
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadLogs = async () => {
      try {
        const res = await API.get("/activity");
        console.log("Fetched Logs:", res.data);

        if (!isMounted) return;

        const safeLogs = Array.isArray(res.data) ? res.data : [];

        // ✅ LIMIT LOGS (PERFORMANCE)
        setLogs(safeLogs.slice(0, 100));
      } catch (err) {
        console.error("Activity Logs Error:", err);

        if (isMounted) {
          setError("Failed to load activity logs.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadLogs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl space-y-6"
    >
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Activity Logs
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Comprehensive audit trail of user actions.
        </p>
      </div>

      {error && (
        <div className="text-red-500">{error}</div>
      )}

      <div className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            No activity recorded yet.
          </div>
        ) : (
          <div className="divide-y">
            {logs.map((log, index) => {
              const { icon: Icon, bg } = getIconConfig(log?.action);

              const userName =
                log?.user?.name ||
                log?.user?.email ||
                "System";

              const { date, time } = formatDate(log?.createdAt);

              return (
                <div
                  key={`${log?._id || "log"}-${index}`} // ✅ SAFE KEY
                  className="flex justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex gap-4">
                    <div className={`h-10 w-10 flex items-center justify-center rounded-full ${bg}`}>
                      <Icon size={18} />
                    </div>

                    <div>
                      <div className="text-sm">
                        <strong>{userName}</strong> performed{" "}
                        <span>{log?.action?.replace(/_/g, " ") || "action"}</span>
                      </div>

                      {log?.details && (
                        <div className="text-xs text-gray-500">
                          {safeStringify(log.details)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-xs text-gray-500">
                    <div>{date}</div>
                    <div>{time}</div>
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