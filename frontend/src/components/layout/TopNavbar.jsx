import React, { useEffect, useState, useRef } from "react";
import { Bell, Search, Menu, User, LogOut, Sun, Moon } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";
import socket from "../../services/socket"; 
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const TopNavbar = ({ setOpen }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const dropdownRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const res = await API.get("/alerts");
        setAlerts(res.data || []);
      } catch (error) {
        console.error("Failed to load alerts", error);
      }
    };
    loadAlerts(); 

    const handleAlert = (alert) => setAlerts((prev) => [alert, ...prev]);
    socket.on("alert", handleAlert);
    return () => socket.off("alert", handleAlert);
   
  }, []);

  // Close dropdowns on outside click
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
    logout(); // Calls context logout (clears state & storage safely)
    navigate("/login");
  };

  return (
    <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
      
      {/* LEFT: Mobile Menu & Search */}
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center bg-gray-100 border border-transparent focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 px-3 py-2 rounded-lg transition-all dark:bg-gray-800 dark:focus-within:bg-gray-900 w-64 lg:w-96">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            className="bg-transparent outline-none ml-2 text-sm w-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Search datasets, insights..."
          />
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3 sm:gap-5 relative">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell size={20} />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <Motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4 dark:bg-gray-900 dark:border-gray-800 z-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Alerts</h3>
                  {alerts.length > 0 && <span className="text-xs text-indigo-500 cursor-pointer">Mark all read</span>}
                </div>
                {alerts.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">You're all caught up!</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {alerts.map((alert, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {alert.message}
                      </div>
                    ))}
                  </div>
                )}
              </Motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 cursor-pointer p-1 pr-2 rounded-full border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold dark:bg-indigo-900 dark:text-indigo-300">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900 dark:text-white leading-none">
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
              </span>
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <Motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl p-1.5 dark:bg-gray-900 dark:border-gray-800 z-50"
              >
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  Log out
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