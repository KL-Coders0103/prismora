import React from "react";
import { Moon, Sun, Bell, Database, ShieldCheck } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">System Settings</h1>

      <div className="space-y-4">
        <SettingItem
          icon={theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
          title="Display Theme"
          description="Switch between light and dark mode for your dashboard."
          action={
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                theme === "dark" ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          }
        />

        <SettingItem
          icon={<Bell size={20} />}
          title="Notification Alerts"
          description="Receive desktop and email alerts for high-severity AI anomalies."
          action={<span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Active</span>}
        />

        <SettingItem
          icon={<Database size={20} />}
          title="Data Synchronization"
          description="Automatic real-time ingestion of new sales records."
          action={<span className="text-xs font-bold text-green-500 uppercase tracking-widest">Connected</span>}
        />

        <div className="p-6 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl flex items-center gap-4">
          <ShieldCheck className="text-indigo-600 dark:text-indigo-400 shrink-0" size={32} />
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Enterprise Security Enabled</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Your session is encrypted using 256-bit AES protection. Activity is being logged for audit purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, title, description, action }) => (
  <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="shrink-0 ml-4">{action}</div>
  </div>
);

export default Settings;