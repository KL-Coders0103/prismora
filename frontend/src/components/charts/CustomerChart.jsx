import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { getSalesByRegion } from "../../services/analyticsService";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

const CustomerChart = () => {

  const [data, setData] = useState([]);

  useEffect(() => {

    const loadData = async () => {

      const result = await getSalesByRegion();

      const formatted = result.map(item => ({
        name: item._id,
        value: item.totalRevenue
      }));

      setData(formatted);

    };

    loadData();

  }, []);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">

      <h2 className="text-lg font-bold mb-4">
        Revenue by Region
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>

          <Pie data={data} dataKey="value" outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
};

export default CustomerChart;