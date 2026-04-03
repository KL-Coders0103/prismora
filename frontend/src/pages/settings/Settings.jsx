import React, { useState } from "react";
import { Moon, Sun, Bell, Database, ShieldCheck, Lock, Globe, Smartphone, Webhook } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { motion as Motion, AnimatePresence } from "framer-motion";

const Settings = () => {
  const themeContext = useTheme();
  const theme = themeContext?.theme || "light";
  const toggleTheme = themeContext?.toggleTheme;

  const [toggling, setToggling] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleToggle = () => {
    if (!toggleTheme || toggling) return;
    setToggling(true);
    toggleTheme();
    setTimeout(() => setToggling(false), 300);
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "developers", label: "API & Webhooks", icon: Webhook },
  ];

  return (
    <div className="max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workspace Settings</h1>
        <p className="text-sm text-gray-500 mt-1 mb-8">Manage your platform preferences and integrations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR TABS */}
        <div className="md:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <Icon size={18} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* SETTINGS CONTENT */}
        <div className="flex-1 min-h-[400px]">
          <AnimatePresence mode="wait">
            <Motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              
              {/* === GENERAL TAB === */}
              {activeTab === "general" && (
                <>
                  <SettingItem
                    icon={theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                    title="Display Theme"
                    description="Switch between light and dark mode for your dashboard."
                    action={<ToggleSwitch isActive={theme === "dark"} onToggle={handleToggle} disabled={toggling} />}
                  />
                  <SettingItem
                    icon={<Database size={20} />}
                    title="Data Synchronization"
                    description="Automatic real-time ingestion of new sales records."
                    action={<span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Connected</span>}
                  />
                </>
              )}

              {/* === NOTIFICATIONS TAB === */}
              {activeTab === "notifications" && (
                <>
                  <SettingItem
                    icon={<Bell size={20} />}
                    title="Email Alerts"
                    description="Receive daily summaries and high-severity AI anomalies via email."
                    action={<ToggleSwitch isActive={true} onToggle={() => {}} />}
                  />
                  <SettingItem
                    icon={<Smartphone size={20} />}
                    title="Push Notifications"
                    description="Get real-time browser alerts when a team member tags you."
                    action={<ToggleSwitch isActive={false} onToggle={() => {}} />}
                  />
                </>
              )}

              {/* === SECURITY TAB === */}
              {activeTab === "security" && (
                <>
                  <div className="p-6 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl flex items-center gap-4 mb-4">
                    <ShieldCheck className="text-indigo-600 dark:text-indigo-400 shrink-0" size={32} />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Enterprise Security Active</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Your session is encrypted using 256-bit AES protection. All major actions are logged.</p>
                    </div>
                  </div>
                  <SettingItem
                    icon={<Lock size={20} />}
                    title="Two-Factor Authentication (2FA)"
                    description="Add an extra layer of security to your account."
                    action={<button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Enable</button>}
                  />
                </>
              )}

              {/* === DEVELOPERS TAB === */}
              {activeTab === "developers" && (
                <>
                  <SettingItem
                    icon={<Webhook size={20} />}
                    title="API Access"
                    description="Manage your secret keys for external integrations."
                    action={<button className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">Generate Key</button>}
                  />
                  <SettingItem
                    icon={<Globe size={20} />}
                    title="Outgoing Webhooks"
                    description="Send real-time PRISMORA events to your custom endpoints."
                    action={<span className="text-xs text-gray-400">0 Active</span>}
                  />
                </>
              )}

            </Motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Reusable Custom Toggle Switch Component
const ToggleSwitch = ({ isActive, onToggle, disabled }) => (
  <button
    onClick={onToggle}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
      isActive ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
    }`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

const SettingItem = ({ icon, title, description, action }) => (
  <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 rounded-lg">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="shrink-0 ml-4">{action}</div>
  </div>
);

export default Settings;