import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { category: "Electronics", sales: 4000 },
  { category: "Fashion", sales: 3000 },
  { category: "Home", sales: 2000 },
  { category: "Beauty", sales: 2780 },
];

const CategoryChart = () => {
  return (
    <BarChart width={500} height={300} data={data}>
      <XAxis dataKey="category" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="sales" fill="#6366f1" />
    </BarChart>
  );
};

export default CategoryChart;
