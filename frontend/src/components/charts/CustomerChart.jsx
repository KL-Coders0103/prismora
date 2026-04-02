import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];

const CustomerChart = ({ data = [], loading }) => {
  const { theme } = useTheme();
  const tooltipBg = theme === "dark" ? "#0f172a" : "#ffffff";
  const tooltipBorder = theme === "dark" ? "#334155" : "#e2e8f0";

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Revenue by Region</h2>
        <div className="h-72 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800"></div>
      </div>
    );
  }

  const chartData = data[0]?.name ? data : data.map(item => ({ name: item._id || "Unknown", value: item.totalRevenue || 0 }));
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: "compact" // Shows "₹1.5M" or "₹50K" to fit inside the pie chart nicely
  }).format(total);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Revenue by Region</h2>
      
      <div className="relative h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={4}
              stroke="none"
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px", color: theme === 'dark' ? '#fff' : '#000' }}
              formatter={(value) => [new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value), "Revenue"]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Perfectly centered label using absolute inset + pointer-events-none */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{formattedTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerChart;