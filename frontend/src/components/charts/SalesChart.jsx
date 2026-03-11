import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 7000 },
  { month: "May", sales: 6000 },
];

const SalesChart = () => {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid stroke="#eee" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="sales" stroke="#6366f1" />
    </LineChart>
  );
};

export default SalesChart;