import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { useEffect, useState } from "react";
import API from "../../services/api";

const RevenueChart = () => {

  const [data, setData] = useState([]);

  useEffect(() => {

    const loadRevenue = async () => {

      try {

        const res = await API.get("/analytics/revenue/monthly");

        const formatted = res.data.map(item => ({
          month: `M${item._id}`,
          revenue: item.totalRevenue
        }));

        setData(formatted);

      } catch (error) {

        console.error("Revenue chart error:", error);

      }

    };

    loadRevenue();

  }, []);

  return (

    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

      <h2 className="text-lg font-bold mb-4">
        Revenue Trend
      </h2>

      <ResponsiveContainer width="100%" height={320}>

        <LineChart data={data}>

          {/* Gradient */}

          <defs>

            <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">

              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>

              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>

            </linearGradient>

          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis dataKey="month" stroke="#94a3b8" />

          <YAxis stroke="#94a3b8" />

          <Tooltip
            contentStyle={{
              backgroundColor:"#0f172a",
              border:"1px solid #334155",
              borderRadius:"8px"
            }}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r:4 }}
            activeDot={{ r:6 }}
            animationDuration={800}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

};

export default RevenueChart;