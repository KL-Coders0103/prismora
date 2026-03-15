import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

const getIcon = (action) => {

  if(action.includes("login")) return "🔑";
  if(action.includes("upload")) return "📤";
  if(action.includes("download")) return "📥";

  return "📌";

};

const ActivityLogs = () => {

  const [logs,setLogs] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    const loadLogs = async ()=>{

      try{

        const res = await API.get("/activity");

        setLogs(res.data);

      }catch(error){

        console.error("Activity logs error",error);

      }finally{

        setLoading(false);

      }

    };

    loadLogs();

  },[]);

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Activity Logs
      </h1>

      {loading && (

        <p className="text-gray-400">
          Loading activity logs...
        </p>

      )}

      {!loading && logs.length===0 && (

        <p className="text-gray-400">
          No activity recorded.
        </p>

      )}

      <div className="space-y-4">

        {logs.map((log,index)=>(

          <div
            key={index}
            className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex justify-between"
          >

            <div>

              <div className="font-semibold">

                {getIcon(log.action)} {log.user}

              </div>

              <div className="text-sm text-gray-400">

                {log.action}

              </div>

            </div>

            <div className="text-xs text-gray-400">

              {new Date(log.createdAt).toLocaleString()}

            </div>

          </div>

        ))}

      </div>

    </DashboardLayout>

  )

}

export default ActivityLogs;