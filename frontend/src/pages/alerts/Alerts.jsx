import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, ShieldAlert, X } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../services/api";
import socket from "../../services/socket";
import { useAuth } from "../../context/AuthContext";

const Alerts = () => {
  const { user } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newAlert, setNewAlert] = useState("");
  const [type, setType] = useState("system");
  const [severity, setSeverity] = useState("warning");

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Unknown time";
    return d.toLocaleString("en-IN");
  };

  useEffect(() => {
    if (!user) return;

    // Load ALL alerts for the history page
    const loadAlerts = async () => {
      try {
        const res = await API.get("/alerts");
        setAlerts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAlerts();

    if (!socket.connected) socket.connect();
    socket.emit("join_dashboard", user);

    const handleAlert = (alert) => {
      setAlerts((prev) => {
        if (prev.some((a) => a._id === alert._id)) return prev;
        return [alert, ...prev];
      });
    };

    const handleRead = ({ id, userId }) => {
  // Agar kis aur ne padha hai, toh mere UI mein kuch change mat karo
  if (user?._id !== userId && user?.id !== userId) return;

  setAlerts((prev) =>
    prev.map((a) => (a._id === id ? { ...a, isRead: true } : a))
  );
};

    socket.on("alert", handleAlert);
    socket.on("alert_read", handleRead);

    return () => {
      socket.off("alert", handleAlert);
      socket.off("alert_read", handleRead);
    };
  }, [user]);

  const createAlert = async () => {
    if (!newAlert.trim()) return;

    try {
      // 1. Alert create karo backend par (sirf wait karna hai, response save karne ki zarurat nahi)
      await API.post("/alerts", { message: newAlert, type, severity });
      
      setNewAlert("");
      
      // ✅ Jaise hi alert ban jaye, hum turant list ko dobara fetch kar lenge
      const freshAlerts = await API.get("/alerts");
      setAlerts(freshAlerts.data);

      toast.success("Alert sent successfully!");

    } catch (err) {
      console.error(err);
      toast.error("Failed to create alert");
    }
  };

  const dismissAlert = async (id) => {
    setAlerts((prev) => prev.filter((a) => a._id !== id));
    try {
      await API.delete(`/alerts/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    // Optimistic Update
    setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, isRead: true } : a)));
    try {
      await API.patch(`/alerts/${id}/read`);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (severity) => {
    if (severity === "critical") return ShieldAlert;
    if (severity === "warning") return AlertTriangle;
    return Info;
  };

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">System Alerts</h1>

      {/* ADMIN CREATE */}
      {user?.role === "admin" && (
        <div className="grid md:grid-cols-4 gap-2">
          <input
            value={newAlert}
            onChange={(e) => setNewAlert(e.target.value)}
            placeholder="Enter alert..."
            className="border px-3 py-2 rounded-lg col-span-2 bg-transparent"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border px-2 py-2 rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white"
          >
            <option value="system">System</option>
            <option value="sales">Sales</option>
            <option value="ai">AI</option>
            <option value="security">Security</option>
          </select>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="border px-2 py-2 rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
          <button
            onClick={createAlert}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg col-span-4 md:col-span-1 hover:bg-indigo-700 transition"
          >
            Create
          </button>
        </div>
      )}

      {loading && <div>Loading...</div>}

      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => {
            const Icon = getIcon(alert.severity);

            return (
              <Motion.div
                key={alert._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => !alert.isRead && markAsRead(alert._id)}
                className={`p-4 border dark:border-gray-800 rounded-lg flex justify-between items-center transition ${
                  alert.isRead
                    ? "opacity-60 bg-transparent"
                    : "bg-gray-50 dark:bg-gray-800 cursor-pointer shadow-sm"
                }`}
              >
                <div className="flex gap-4 items-center">
                  <div className={`${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className={`font-medium ${alert.isRead ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                      {alert.message}
                    </p>
                    <small className="text-gray-400">{formatDate(alert.createdAt)}</small>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissAlert(alert._id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition"
                >
                  <X size={18} />
                </button>
              </Motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Alerts;