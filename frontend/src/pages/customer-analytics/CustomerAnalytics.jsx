import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getCustomerByRegion } from "../../services/analyticsService";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"];

const CustomerAnalytics = () => {
  const { theme } = useTheme();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tooltipBg = theme === "dark" ? "#0f172a" : "#ffffff";
  const tooltipBorder = theme === "dark" ? "#334155" : "#e2e8f0";

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const result = await getCustomerByRegion();

        if (!isMounted) return;

        // ✅ SAFE DATA HANDLING
        const formatted = (Array.isArray(result) ? result : []).map((item, index) => ({
          name: item?._id || `Region ${index + 1}`,
          value: Number(item?.customers) || 0,
          key: `${item?._id || "region"}-${index}` // ✅ unique key
        }));

        setData(formatted);
      } catch (err) {
        console.error("Customer Analytics Error:", err);
        if (isMounted) {
          setError("Failed to load customer analytics data.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Customer Analytics
        </h1>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
          <p className="font-medium">⚠️ {error}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
        <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
          Customers by Region
        </h2>

        {loading ? (
          <div className="h-[320px] w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
        ) : data.length === 0 ? (
          <div className="flex h-[320px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            No customer data available.
          </div>
        ) : (
          <div className="h-[360px] w-full">
            {/* ✅ FIXED HEIGHT BUG */}
            <ResponsiveContainer width="100%" height={360}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={3}
                  stroke="none"
                  animationDuration={1000}
                >
                  {data.map((entry) => (
                    <Cell key={entry.key} fill={COLORS[data.indexOf(entry) % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: "8px",
                    color: theme === "dark" ? "#fff" : "#000",
                  }}
                  formatter={(value) => [
                    new Intl.NumberFormat("en-IN").format(value),
                    "Orders",
                  ]}
                />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    color: theme === "dark" ? "#cbd5e1" : "#475569",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Motion.div>
  );
};

export default CustomerAnalytics;