import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { getMonthlyRevenue, getTopProducts } from "../../services/analyticsService";
import { useTheme } from "../../context/ThemeContext";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SalesAnalytics = () => {
  const { theme } = useTheme();
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic colors for Recharts
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";
  const axisColor = theme === "dark" ? "#94a3b8" : "#64748b";
  const tooltipBg = theme === "dark" ? "#0f172a" : "#ffffff";
  const tooltipBorder = theme === "dark" ? "#334155" : "#e2e8f0";

  useEffect(() => {
    const loadData = async () => {
      try {
        const [revenueData, productData] = await Promise.all([
          getMonthlyRevenue(),
          getTopProducts(),
        ]);

        const formattedRevenue = revenueData.map((item) => ({
          month: item._id ? months[item._id - 1] : "Unknown",
          revenue: item.totalRevenue || 0,
        }));

        setMonthlyRevenue(formattedRevenue);
        setTopProducts(productData || []);
      } catch (err) {
        console.error("Sales Analytics Error:", err);
        setError("Failed to load sales analytics data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
            <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Monthly Revenue Trend</h2>

            {monthlyRevenue.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                No revenue data available for the current period.
              </div>
            ) : (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke={axisColor} axisLine={false} tickLine={false} dy={10} />
                    <YAxis 
                      stroke={axisColor} 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} 
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px", color: theme === 'dark' ? '#fff' : '#000' }}
                      formatter={(value) => [new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value), "Revenue"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: tooltipBg }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#4f46e5" }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* TOP PRODUCTS TABLE */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
            <div className="border-b border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Selling Products</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">Rank</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Product Name</th>
                    <th scope="col" className="px-6 py-4 font-semibold text-right">Total Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {topProducts.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No product data available
                      </td>
                    </tr>
                  ) : (
                    topProducts.map((product, index) => (
                      <tr key={product._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                            index === 1 ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                            index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                            'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {product._id}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                          {new Intl.NumberFormat("en-IN").format(product.totalSales)} units
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