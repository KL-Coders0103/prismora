import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const RevenueChart = ({ data = [], loading }) => {
  const { theme } = useTheme();

  // Dynamic colors for Recharts based on Tailwind global theme
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";
  const axisColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const tooltipBg = theme === "dark" ? "#0f172a" : "#ffffff";
  const tooltipBorder = theme === "dark" ? "#334155" : "#e2e8f0";

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Revenue Trend</h2>
        <div className="h-72 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Revenue Trend</h2>
        <div className="flex h-72 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          No revenue data available for this period.
        </div>
      </div>
    );
  }

  // Map backend `_id` to `month` if needed
  const chartData = data[0]?.month ? data : data.map(item => ({ month: item._id || "N/A", revenue: item.revenue || 0 }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Revenue Trend</h2>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="month" stroke={axisColor} axisLine={false} tickLine={false} dy={10} />
            <YAxis 
              stroke={axisColor} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} 
            />
            <Tooltip
              contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px", color: theme === 'dark' ? '#fff' : '#000' }}
              itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
              formatter={(value) => [new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value), "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;