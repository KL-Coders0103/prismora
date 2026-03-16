import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { useEffect, useState } from "react";
import { getMonthlyRevenue } from "../../services/analyticsService";

const RevenueChart = () => {

  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    const load = async ()=>{

      try{

        const res = await getMonthlyRevenue();

        const formatted = res.map(item=>({
          month:item._id,
          revenue:item.revenue
        }));

        setData(formatted);

      }catch(err){

        console.error(err);

      }finally{

        setLoading(false);

      }

    }

    load();

  },[]);

  if(loading){

    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Revenue Trend</h2>
        <div className="animate-pulse h-72 bg-slate-800 rounded"></div>
      </div>
    );

  }

  if(data.length === 0){

    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Revenue Trend</h2>
        <p className="text-gray-400 text-sm">No revenue data available</p>
      </div>
    );

  }

  return (

    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

      <h2 className="text-lg font-bold mb-4">
        Revenue Trend
      </h2>

      <ResponsiveContainer width="100%" height={320}>

        <AreaChart data={data}>

        <CartesianGrid stroke="#1e293b"/>

        <XAxis dataKey="month"/>

        <YAxis/>

        <Tooltip
          formatter={(value)=>
            new Intl.NumberFormat("en-IN",{
              style:"currency",
              currency:"INR"
            }).format(value)
          }
          />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.25}
        />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  );

};

export default RevenueChart;