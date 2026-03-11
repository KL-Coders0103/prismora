import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", revenue: 8000 },
  { month: "Feb", revenue: 9000 },
  { month: "Mar", revenue: 12000 },
  { month: "Apr", revenue: 15000 },
  { month: "May", revenue: 14000 },
];

const RevenueChart = () => {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid stroke="#eee" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="revenue" stroke="#22c55e" />
    </LineChart>
  );
};

export default RevenueChart;
