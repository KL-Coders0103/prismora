import { PieChart, Pie, Tooltip, Cell } from "recharts";

const data = [
  { name: "New Customers", value: 400 },
  { name: "Returning Customers", value: 300 },
  { name: "Inactive Customers", value: 200 },
];

const COLORS = ["#6366f1", "#22c55e", "#ef4444"];

const CustomerPieChart = () => {
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>

      <Tooltip />
    </PieChart>
  );
};

export default CustomerPieChart;
