import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const SalesAnalytics = () => {

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {

    const loadData = async () => {

      const revenueRes = await API.get("/analytics/monthly-revenue");

      const formattedRevenue = revenueRes.data.map(item => ({
        month: item._id,
        revenue: item.totalRevenue
      }));

      setMonthlyRevenue(formattedRevenue);

      const productRes = await API.get("/analytics/top-products");

      setTopProducts(productRes.data);

    };

    loadData();

  }, []);

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Sales Analytics
      </h1>

      {/* Revenue Trend */}

      <div className="bg-slate-900 p-6 rounded-xl mb-8">

        <h2 className="text-xl mb-4">
          Monthly Revenue
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={monthlyRevenue}>

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>


      {/* Top Products Table */}

      <div className="bg-slate-900 p-6 rounded-xl">

        <h2 className="text-xl mb-4">
          Top Selling Products
        </h2>

        <table className="w-full">

          <thead>

            <tr className="text-left border-b border-gray-700">

              <th className="py-2">Product</th>

              <th>Total Sales</th>

            </tr>

          </thead>

          <tbody>

            {topProducts.map((product, index) => (

              <tr key={index} className="border-b border-gray-800">

                <td className="py-2">{product._id}</td>

                <td>{product.totalSales}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  );

};

export default SalesAnalytics;