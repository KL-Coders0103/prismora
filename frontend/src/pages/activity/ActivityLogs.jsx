import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getActivityLogs } from "../../services/activityService";

const getIcon = (action) => {

  if(action?.includes("login")) return "🔑";
  if(action?.includes("upload")) return "📤";
  if(action?.includes("download")) return "📥";

  return "📌";

};

const ActivityLogs = () => {

  const [logs,setLogs] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(()=>{

    const loadLogs = async ()=>{

      try{

        const data = await getActivityLogs();

        setLogs(data.slice(0,100));

      }catch(err){

        console.error(err);

        setError("Failed to load activity logs");

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

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          <div className="h-16 bg-slate-800 animate-pulse rounded"></div>
          <div className="h-16 bg-slate-800 animate-pulse rounded"></div>
        </div>
      )}

      {!loading && logs.length===0 && (

        <p className="text-gray-400">
          No activity recorded.
        </p>

      )}

      <div className="space-y-4 max-h-[600px] overflow-y-auto">

        {logs.map((log)=>(

          <div
            key={log._id}
            className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex justify-between"
          >

            <div className="flex items-center gap-3">

              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm">

                {log.user?.name?.charAt(0) || "S"}

              </div>

              <div>

                <div className="font-semibold">

                  {getIcon(log.action)} {log.user?.name || "System"}

                </div>

                <div className="text-sm text-gray-400">

                  {log.action}

                </div>

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