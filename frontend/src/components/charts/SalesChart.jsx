import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const SalesChart = ({ data = [], loading }) => {
  const { theme } = useTheme();

  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";
  const axisColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const tooltipBg = theme === "dark" ? "#0f172a" : "#ffffff";
  const tooltipBorder = theme === "dark" ? "#334155" : "#e2e8f0";

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Sales by Category</h2>
        <div className="h-72 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800"></div>
      </div>
    );
  }

  const chartData = data[0]?.category ? data : data.map(item => ({ category: item._id || "N/A", sales: item.totalSales || 0 })).sort((a, b) => b.sales - a.sales);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Sales by Category</h2>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="category" stroke={axisColor} axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke={axisColor} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f1f5f9' }}
              contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px", color: theme === 'dark' ? '#fff' : '#000' }}
            />
            <Bar dataKey="sales" radius={[4, 4, 0, 0]} animationDuration={1000}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? "#3b82f6" : "#93c5fd"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;