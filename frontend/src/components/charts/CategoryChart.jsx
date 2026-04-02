import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const CategoryChart = ({ data = [] }) => {
  const { theme } = useTheme();

  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";
  const axisColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const tooltipBg = theme === "dark" ? "#0f172a" : "#ffffff";

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
        No category data available.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis dataKey="category" stroke={axisColor} axisLine={false} tickLine={false} dy={10} />
          <YAxis stroke={axisColor} axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f1f5f9' }}
            contentStyle={{ backgroundColor: tooltipBg, borderRadius: "8px", border: "none", color: theme === 'dark' ? '#fff' : '#000' }}
          />
          <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? "#4f46e5" : "#818cf8"} />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;