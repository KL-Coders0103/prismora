import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = ["#3b82f6","#22c55e","#f59e0b","#ef4444"];

const CustomerAnalytics = () => {

  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    const load = async ()=>{

      try{

        const res = await API.get("/analytics/customer-region");

        const formatted = res.data.map(item=>({

          name:item._id,
          value:item.customers

        }));

        setData(formatted);

      }catch(error){

        console.error("Customer analytics error",error);

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

      {loading && (
        <p className="text-gray-400">
          Loading analytics...
        </p>
      )}

      {!loading && (

      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">

        <h2 className="mb-4">
          Customers by Region
        </h2>

        <ResponsiveContainer width="100%" height={320}>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={100}
            >

              {data.map((entry,index)=>(

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor:"#0f172a",
                border:"1px solid #334155"
              }}
            />

            <Legend/>

          </PieChart>

        </ResponsiveContainer>

      </div>

      )}

    </DashboardLayout>

  )

}

export default CustomerAnalytics