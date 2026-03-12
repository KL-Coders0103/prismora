import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { getSalesByCategory } from "../../services/analyticsService";

const SalesChart = () => {

  const [data, setData] = useState([]);

  useEffect(() => {

    const loadData = async () => {

      const result = await getSalesByCategory();

      const formatted = result.map(item => ({
        category: item._id,
        sales: item.totalSales
      }));

      setData(formatted);
    };

    loadData();

  }, []);

  if (!data.length) {
  return <div className="p-5">Loading...</div>;
}

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">

      <h2 className="text-lg font-bold mb-4">
        Sales by Category
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default SalesChart;