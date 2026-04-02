import React from "react";
import { motion as Motion } from "framer-motion";
import { TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

const InsightCard = ({ title, message, type = "insight", confidence = 0 }) => {
  const getTheme = () => {
    switch (type.toLowerCase()) {
      case "alert":
      case "anomaly":
        return { color: "text-red-600 dark:text-red-400", icon: <AlertCircle size={18} /> };
      case "opportunity":
      case "recommendation":
        return { color: "text-green-600 dark:text-green-400", icon: <Lightbulb size={18} /> };
      default:
        return { color: "text-indigo-600 dark:text-indigo-400", icon: <TrendingUp size={18} /> };
    }
  };

  const theme = getTheme();
  const safeConfidence = Math.min(Math.max(confidence, 0), 100);

  return (
    <Motion.div 
      whileHover={{ y: -4 }}
      className="flex w-full max-w-sm flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className={theme.color}>{theme.icon}</div>
        <h3 className={`font-semibold ${theme.color}`}>{title}</h3>
      </div>
      
      <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-300">
        {message}
      </p>
      
      <div className="mt-auto">
        <div className="mb-1.5 flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
          <span>AI Confidence</span>
          <span>{safeConfidence}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
            style={{ width: `${safeConfidence}%` }}
          />
        </div>
      </div>
    </Motion.div>
  );
};

export default InsightCard;