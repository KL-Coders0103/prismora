import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import { getCustomerByRegion } from "../../services/analyticsService";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4"
];

const CustomerAnalytics = () => {

  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(()=>{

    const load = async ()=>{

      try{

        const result = await getCustomerByRegion();

        const formatted = result.map(item=>({

          name:item._id,
          value:item.customers

        }));

        setData(formatted);

      }catch(err){

        console.error(err);

        setError("Failed to load customer analytics");

      }finally{

        setLoading(false);

      }

    }

    load();

  },[]);

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Customer Analytics
      </h1>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">

        <h2 className="mb-4">
          Customers by Region
        </h2>

        {loading && (
          <div className="animate-pulse h-72 bg-slate-800 rounded"></div>
        )}

        {!loading && data.length === 0 && (
          <p className="text-gray-400 text-sm">
            No customer data available
          </p>
        )}

        {!loading && data.length > 0 && (

        <ResponsiveContainer width="100%" height={320}>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
            >

              {data.map((entry,index)=>(

                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor:"#0f172a",
                border:"1px solid #334155",
                borderRadius:"8px"
              }}
            />

            <Legend/>

          </PieChart>

        </ResponsiveContainer>

        )}

      </div>

    </DashboardLayout>

  )

}

export default CustomerAnalytics