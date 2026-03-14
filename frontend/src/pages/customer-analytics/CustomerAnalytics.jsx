import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#3b82f6","#22c55e","#f59e0b","#ef4444"];

const CustomerAnalytics = () => {

  const [data,setData] = useState([]);

  useEffect(()=>{

    const load = async ()=>{

      const res = await API.get("/analytics/customer-region");

      const formatted = res.data.map(item=>({
        name:item._id,
        value:item.customers
      }));

      setData(formatted);

    }

    load();

  },[]);

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Customer Analytics
      </h1>

      <div className="bg-slate-900 p-6 rounded-xl">

        <h2 className="mb-4">
          Customers by Region
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              outerRadius={100}
            >

              {data.map((entry,index)=>(
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

            </Pie>

            <Tooltip/>

          </PieChart>

        </ResponsiveContainer>

      </div>

    </DashboardLayout>

  )

}

export default CustomerAnalytics