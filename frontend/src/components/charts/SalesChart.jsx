import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { category: "Electronics", sales: 2400 },
  { category: "Clothing", sales: 1800 },
  { category: "Furniture", sales: 1400 },
  { category: "Sports", sales: 900 }
];

const SalesChart = () => {
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