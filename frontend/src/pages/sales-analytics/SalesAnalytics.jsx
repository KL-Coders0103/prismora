import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { getMonthlyRevenue, getTopProducts } from "../../services/analyticsService";
import { useTheme } from "../../context/ThemeContext";

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const SalesAnalytics = () => {
  const { theme } = useTheme();

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";
  const axisColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const tooltipBg = theme === "dark" ? "#0f172a" : "#ffffff";
  const tooltipBorder = theme === "dark" ? "#334155" : "#e2e8f0";

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [revenueData, productData] = await Promise.all([
          getMonthlyRevenue(),
          getTopProducts(),
        ]);

        if (!isMounted) return;

        // ✅ SAFE + SORTED DATA
        const formattedRevenue = (Array.isArray(revenueData) ? revenueData : [])
  .map((item) => {
    const monthIndex = parseInt(item?._id, 10);

    // 🔥 HANDLE BOTH CASES (VERY IMPORTANT)
    const revenueValue =
      item?.revenue ??
      item?.totalRevenue ??
      item?.value ??
      0;

    return {
      month:
        monthIndex >= 1 && monthIndex <= 12
          ? months[monthIndex - 1]
          : "N/A",
      monthIndex: monthIndex || 0,
      revenue: Number(revenueValue)
    };
  })
  .filter(item => item.monthIndex !== 0) // ✅ remove invalid data
  .sort((a, b) => a.monthIndex - b.monthIndex);
console.log("RAW API:", revenueData);
console.log("FORMATTED:", formattedRevenue);
        setMonthlyRevenue(formattedRevenue);
        setTopProducts(Array.isArray(productData) ? productData : []);
      } catch (err) {
        console.error("Sales Analytics Error:", err);
        if (isMounted) {
          setError("Failed to load sales analytics data.");
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
          Sales Analytics
        </h1>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
          <p className="font-medium">⚠️ {error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="h-80 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-64 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"></div>
        </div>
      ) : (
        <>
          {/* REVENUE CHART */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
            <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
              Monthly Revenue Trend
            </h2>

            {!monthlyRevenue || monthlyRevenue.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                No revenue data available for the current period.
              </div>
            ) : (
              <div className="h-[320px] w-full">
                {/* ✅ FIXED HEIGHT ISSUE */}
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke={axisColor} />
                    <YAxis
                      stroke={axisColor}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4f46e5"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* TOP PRODUCTS TABLE */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
            <div className="border-b border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Top Selling Products
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <tbody>
                  {topProducts.length === 0 ? (
                    <tr>
                      <td className="px-6 py-8 text-center">
                        No product data available
                      </td>
                    </tr>
                  ) : (
                    topProducts.map((product, index) => (
                      <tr key={`${product?._id || "product"}-${index}`}>
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{product?._id || "Unknown"}</td>
                        <td className="px-6 py-4 text-right">
                          {new Intl.NumberFormat("en-IN").format(product?.totalSales || 0)} units
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Motion.div>
  );
};

export default SalesAnalytics;