import React from "react";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

const AlertCard = ({ title, message, severity = "info" }) => {
  const getTheme = () => {
    switch (severity.toLowerCase()) {
      case "high":
      case "critical":
        return {
          border: "border-l-red-500",
          bg: "bg-white dark:bg-gray-900",
          icon: <AlertCircle className="text-red-500" size={20} />,
          text: "text-red-600 dark:text-red-400"
        };
      case "medium":
      case "warning":
        return {
          border: "border-l-amber-500",
          bg: "bg-white dark:bg-gray-900",
          icon: <AlertTriangle className="text-amber-500" size={20} />,
          text: "text-amber-600 dark:text-amber-400"
        };
      default:
        return {
          border: "border-l-blue-500",
          bg: "bg-white dark:bg-gray-900",
          icon: <Info className="text-blue-500" size={20} />,
          text: "text-blue-600 dark:text-blue-400"
        };
    }
  };

  const theme = getTheme();

  return (
    <div className={`flex w-full max-w-sm flex-col rounded-r-xl border-y border-r border-gray-200 border-l-4 p-4 shadow-sm transition-colors dark:border-gray-800 ${theme.border} ${theme.bg}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{theme.icon}</div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{message}</p>
          <span className={`mt-2 inline-block text-xs font-bold uppercase tracking-wider ${theme.text}`}>
            {severity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;