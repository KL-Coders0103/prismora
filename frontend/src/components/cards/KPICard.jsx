import React from "react";
import { motion as Motion } from "framer-motion";
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Users, Percent } from "lucide-react";

const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const iconMap = {
  Revenue: IndianRupee,
  Sales: ShoppingCart,
  Customers: Users,
  "Conversion Rate": Percent,
};

// Updated styling for pristine Light + Dark mode support
const themeMap = {
  Revenue: {
    bg: "bg-green-50 dark:bg-green-500/10",
    border: "border-green-100 dark:border-green-500/20",
    iconBg: "bg-green-100 dark:bg-green-500/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
  Sales: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-100 dark:border-blue-500/20",
    iconBg: "bg-blue-100 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  Customers: {
    bg: "bg-purple-50 dark:bg-purple-500/10",
    border: "border-purple-100 dark:border-purple-500/20",
    iconBg: "bg-purple-100 dark:bg-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  "Conversion Rate": {
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-100 dark:border-orange-500/20",
    iconBg: "bg-orange-100 dark:bg-orange-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
};

const KPICard = ({ title, value, change, loading }) => {
  const Icon = iconMap[title] || Users;
  const theme = themeMap[title] || themeMap.Sales;

  const changeValue  = parseFloat(change) || 0;
  const isPositive = changeValue > 0;
  const isNeutral = changeValue === 0;
  

  let displayValue = value;
  if (!loading) {
    if (title === "Revenue") displayValue = formatINR(value);
    else if (title === "Conversion Rate") displayValue = `${value}%`;
    else displayValue = new Intl.NumberFormat("en-IN").format(value);
  }

  if (loading) {
    return (
      <div className={`rounded-xl border ${theme.border} ${theme.bg} p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
        <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-2"></div>
        <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
    );
  }

  return (
    <Motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`rounded-xl border ${theme.border} ${theme.bg} p-6 shadow-sm transition-colors duration-300`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </h3>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${theme.iconBg}`}>
          <Icon size={20} className={theme.iconColor} />
        </div>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
        {displayValue}
      </h2>

      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 text-sm font-medium ${isNeutral ? "text-gray-500 dark:text-gray-400" : 
          isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {isNeutral ? null : isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{change || "0%"}</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
      </div>
    </Motion.div>
  );
};

export default KPICard;