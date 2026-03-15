import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const SalesAnalytics = () => {

  const [monthlyRevenue,setMonthlyRevenue] = useState([]);
  const [topProducts,setTopProducts] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    const loadData = async ()=>{

      try{

        const revenueRes = await API.get("/analytics/monthly-revenue");

        const formattedRevenue = revenueRes.data.map(item=>({

          month: months[item._id-1],
          revenue: item.totalRevenue

        }));

        setMonthlyRevenue(formattedRevenue);

        const productRes = await API.get("/analytics/top-products");

        setTopProducts(productRes.data);

      }catch(error){

        console.error("Sales analytics error",error);

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

      {loading && (
        <p className="text-gray-400">
          Loading analytics...
        </p>
      )}

      {!loading && (

      <>

      {/* Revenue Chart */}

      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl mb-8">

        <h2 className="text-xl mb-4">
          Monthly Revenue
        </h2>

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

      </div>


      {/* Top Products */}

      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">

        <h2 className="text-xl mb-4">
          Top Selling Products
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700 text-left">

              <th className="py-2">Rank</th>
              <th>Product</th>
              <th>Total Sales</th>

            </tr>

          </thead>

          <tbody>

            {topProducts.map((product,index)=>(

              <tr
                key={index}
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

      </>

      )}

    </DashboardLayout>

  );

};

export default SalesAnalytics;