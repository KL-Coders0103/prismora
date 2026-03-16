import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import {
  getMonthlyRevenue,
  getTopProducts
} from "../../services/analyticsService";

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const SalesAnalytics = () => {

  const [monthlyRevenue,setMonthlyRevenue] = useState([]);
  const [topProducts,setTopProducts] = useState([]);

  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(()=>{

    const loadData = async ()=>{

      try{

        const [revenueData, productData] = await Promise.all([
          getMonthlyRevenue(),
          getTopProducts()
        ]);

        const formattedRevenue = revenueData.map(item=>({

          month: months[item._id-1] || "Unknown",
          revenue: item.totalRevenue

        }));

        setMonthlyRevenue(formattedRevenue);
        setTopProducts(productData);

      }catch(err){

        console.error(err);

        setError("Failed to load sales analytics");

      }finally{

        setLoading(false);

      }

    };

    loadData();

  },[]);

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Sales Analytics
      </h1>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (

        <div className="space-y-6">

          <div className="h-72 bg-slate-800 animate-pulse rounded-xl"></div>

          <div className="h-48 bg-slate-800 animate-pulse rounded-xl"></div>

        </div>

      )}

      {!loading && (

      <>

      {/* Revenue Chart */}

      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl mb-8">

        <h2 className="text-xl mb-4">
          Monthly Revenue
        </h2>

        {monthlyRevenue.length === 0 ? (

          <p className="text-gray-400 text-sm">
            No revenue data available
          </p>

        ) : (

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={monthlyRevenue}>

            <CartesianGrid stroke="#334155" strokeDasharray="3 3"/>

            <XAxis dataKey="month" stroke="#94a3b8"/>

            <YAxis stroke="#94a3b8"/>

            <Tooltip
              contentStyle={{
                backgroundColor:"#0f172a",
                border:"1px solid #334155"
              }}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

        )}

      </div>


      {/* Top Products */}

      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">

        <h2 className="text-xl mb-4">
          Top Selling Products
        </h2>

        <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700 text-left">

              <th className="py-2">Rank</th>
              <th>Product</th>
              <th>Total Sales</th>

            </tr>

          </thead>

          <tbody>

            {topProducts.length === 0 && (

              <tr>

                <td colSpan="3" className="py-4 text-gray-400">
                  No product data available
                </td>

              </tr>

            )}

            {topProducts.map((product,index)=>(

              <tr
                key={product._id}
                className="border-b border-slate-800 hover:bg-slate-800"
              >

                <td className="py-2">
                  {index+1}
                </td>

                <td>{product._id}</td>

                <td>{product.totalSales}</td>

              </tr>

            ))}

          </tbody>

        </table>

        </div>

      </div>

      </>

      )}

    </DashboardLayout>

  );

};

export default SalesAnalytics;