import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, ShieldAlert, X, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../services/api";
import socket from "../../services/socket"; 

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const res = await API.get("/alerts");
        setAlerts(res.data);
      } catch (err) {
        console.error("Alerts Error:", err);
        setError("Failed to load alerts.");
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();

   
    const handler = (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 50));
    };
    socket.on("alert", handler);
    return () => socket.off("alert", handler);
    
  }, []);

  const dismissAlert = async (id) => {
    try {
      // Optimistic UI update
      setAlerts(prev => prev.filter(a => a._id !== id));
      
      // Actual backend call (Assuming your backend has a DELETE or PUT /alerts/:id)
      await API.delete(`/alerts/${id}`);
      toast.success("Alert dismissed");
    } catch  {
      toast.error("Failed to dismiss alert");
      // Revert if failed (optional, simplified here)
    }
  };

  const getAlertConfig = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "high":
        return {
          icon: ShieldAlert,
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-50 dark:bg-red-500/10",
          border: "border-red-200 dark:border-red-500/20"
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-500/10",
          border: "border-amber-200 dark:border-amber-500/20"
        };
      default: // info
        return {
          icon: Info,
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-50 dark:bg-blue-500/10",
          border: "border-blue-200 dark:border-blue-500/20"
        };
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl space-y-6"
    >
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          System Alerts
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Real-time monitoring of ML anomalies, system errors, and threshold breaches.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
          <p className="font-medium">⚠️ {error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-900/50">
          <CheckCircle2 size={48} className="mb-4 text-green-500 opacity-80" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Clear</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No active alerts or anomalies detected.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {alerts.map((alert) => {
              const config = getAlertConfig(alert.severity || alert.type);
              const Icon = config.icon;

              return (
                <Motion.div
                  key={alert._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className={`flex items-start justify-between rounded-xl border p-4 shadow-sm transition-colors ${config.bg} ${config.border}`}
                >
                  <div className="flex gap-4">
                    <div className={`mt-0.5 shrink-0 ${config.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {alert.message}
                      </h4>
                      <div className="mt-1 flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span className="uppercase tracking-wider">{alert.type || "System"}</span>
                        <span>•</span>
                        <span>
                          {new Date(alert.createdAt).toLocaleString('en-IN', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert._id)}
                    className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-gray-200/50 hover:text-gray-600 dark:hover:bg-gray-800/50 dark:hover:text-gray-300 transition-colors"
                    aria-label="Dismiss alert"
                  >
                    <X size={18} />
                  </button>
                </Motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </Motion.div>
  );
};

export default Alerts;