import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { getSalesByCategory } from "../../services/analyticsService";

const SalesChart = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadData = async () => {

      try {

        const result = await getSalesByCategory();

        const formatted = result
          .map(item => ({
            category: item._id,
            sales: item.totalSales
          }))
          .sort((a,b) => b.sales - a.sales);

        setData(formatted);

      } catch (error) {

        console.error("Sales chart error:", error);

      } finally {

        setLoading(false);

      }

    };

    loadData();

  }, []);


  if (loading) {

    return (

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

        <h2 className="text-lg font-bold mb-4">
          Sales by Category
        </h2>

        <div className="animate-pulse h-72 bg-slate-800 rounded"></div>

      </div>

    );

  }

  return (

    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

      <h2 className="text-lg font-bold mb-4">
        Sales by Category
      </h2>

      <ResponsiveContainer width="100%" height={320}>

        <BarChart data={data}>

          <defs>

            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">

              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />

              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4} />

            </linearGradient>

          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis dataKey="category" stroke="#94a3b8" />

          <YAxis stroke="#94a3b8" />

          <Tooltip
            contentStyle={{
              backgroundColor:"#0f172a",
              border:"1px solid #334155",
              borderRadius:"8px"
            }}
          />

          <Bar
            dataKey="sales"
            fill="url(#salesGradient)"
            radius={[6,6,0,0]}
            animationDuration={800}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

};

export default SalesChart;