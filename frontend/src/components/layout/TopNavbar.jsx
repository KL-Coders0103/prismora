import React, { useEffect, useState, useRef } from "react";
import { Bell, Search, Menu, LogOut, Sun, Moon } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import socket from "../../services/socket";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const TopNavbar = ({ setOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Load initial UNREAD alerts
    const loadAlerts = async () => {
      try {
        const res = await API.get("/alerts/unread");
        setAlerts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadAlerts();

    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("join_dashboard", user);

    // Listeners
    const handleAlert = (alert) => {
      console.log("Received alert:", alert);
      setAlerts((prev) => {
        if (prev.some((a) => a._id === alert._id)) return prev;
        return [alert, ...prev];
      });
      // ✅ Trigger toast for ALL users when a new alert arrives
      toast.success(`New Alert: ${alert.message}`, { icon: '🔔' });
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

  // Handle Outside Click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    socket.disconnect();
    navigate("/");
  };

  const markAsRead = async (id) => {
    // Optimistic UI Update: Remove it instantly before API finishes
    setAlerts((prev) => prev.filter((a) => a._id !== id));
    try {
      await API.patch(`/alerts/${id}/read`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button onClick={() => setOpen(true)} className="md:hidden">
          <Menu size={20} />
        </button>
        {/* RIGHT INSIDE YOUR LEFT SECTION */}
        <div 
          onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
          className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-64 dark:bg-gray-800 cursor-pointer hover:ring-2 hover:ring-indigo-500/50 transition-all group"
        >
          <Search size={18} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
          <span className="ml-2 text-gray-400 text-sm w-full select-none">
            Search... <kbd className="hidden lg:inline-block ml-8 text-[10px] border px-1 rounded bg-white dark:bg-gray-700 text-gray-500">Ctrl K</kbd>
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">
        <button onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* 🔔 NOTIFICATIONS */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Bell size={20} className="align-middle" />
            {alerts.length > 0 && (
              <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 shadow-xl rounded-xl p-4 z-50 border dark:border-gray-800"
              >
                <h3 className="text-sm font-semibold mb-2">Unread Notifications</h3>

                {alerts.length === 0 ? (
                  <p className="text-sm text-center py-4 text-gray-400">All caught up!</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {alerts.map((alert) => (
                      <div
                        key={alert._id}
                        onClick={() => markAsRead(alert._id)}
                        className="p-3 rounded-lg text-sm cursor-pointer transition bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <p className="font-medium text-gray-900 dark:text-white">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfile(!showProfile)}>
            <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-medium">
              {user?.email?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <Motion.div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-xl rounded-xl p-2 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;