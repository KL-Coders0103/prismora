import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { getSalesByRegion } from "../../services/analyticsService";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4"
];

const CustomerChart = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {

    const loadData = async () => {

      try {

        const result = await getSalesByRegion();

        const formatted = result.map(item => ({
          name: item._id,
          value: item.totalRevenue
        }));

        const totalRevenue = formatted.reduce(
          (sum, item) => sum + item.value,
          0
        );

        setTotal(totalRevenue);
        setData(formatted);

      } catch (error) {

        console.error("Customer chart error:", error);

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
          Revenue by Region
        </h2>

        <div className="animate-pulse h-72 bg-slate-800 rounded"></div>

      </div>

    );

  }

  return (

    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

      <h2 className="text-lg font-bold mb-4">
        Revenue by Region
      </h2>

      <div className="relative">

        <ResponsiveContainer width="100%" height={320}>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              animationDuration={800}
            >

              {data.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor:"#0f172a",
                border:"1px solid #334155",
                borderRadius:"8px"
              }}
            />

          </PieChart>

        </ResponsiveContainer>

        {/* Center Label */}

        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <span className="text-sm text-gray-400">
            Total Revenue
          </span>

          <span className="text-xl font-bold">
            ${total}
          </span>

        </div>

      </div>

    </div>

  );

};

export default CustomerChart;