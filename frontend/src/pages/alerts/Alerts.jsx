import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";
import socket from "../../services/socket";

const getColor = (type) => {

  if(type === "critical")
    return "bg-red-900 border-red-500";

  if(type === "warning")
    return "bg-yellow-900 border-yellow-500";

  if(type === "info")
    return "bg-blue-900 border-blue-500";

  return "bg-slate-900 border-slate-700";

};

const getIcon = (type)=>{

  if(type==="critical") return "🔴";
  if(type==="warning") return "🟡";
  return "🔵";

};

const Alerts = () => {

  const [alerts,setAlerts] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(()=>{

    const loadAlerts = async ()=>{

      try{

        const res = await API.get("/alerts");

        setAlerts(res.data);

      }catch(err){

        console.error(err);
        setError("Failed to load alerts");

      }finally{

        setLoading(false);

      }

    };

    loadAlerts();

    const handler = (alert)=>{

      setAlerts(prev => [alert, ...prev].slice(0,50));

    };

    socket.on("alert", handler);

    return ()=> socket.off("alert", handler);

  },[]);

  const dismissAlert = (index)=>{

    setAlerts(prev => prev.filter((_,i)=> i!==index));

  };

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Alerts
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

      {!loading && alerts.length === 0 && (

        <p className="text-gray-400">
          No alerts detected.
        </p>

      )}

      <div className="space-y-4 max-h-[600px] overflow-y-auto">

        {alerts.map((alert,index)=>(

          <div
            key={alert._id || index}
            className={`p-4 rounded-lg border ${getColor(alert.type)} flex justify-between`}
          >

            <div>

              <div className="font-semibold">

                {getIcon(alert.type)} {alert.message}

              </div>

              <div className="text-sm text-gray-300 mt-1">

                Type: {alert.type}

              </div>

              <div className="text-xs text-gray-400">

                {new Date(alert.createdAt).toLocaleString()}

              </div>

            </div>

            <button
              onClick={()=>dismissAlert(index)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>

          </div>

        ))}

      </div>

    </DashboardLayout>

  )

}

export default Alerts;