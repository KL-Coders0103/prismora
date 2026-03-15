import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";
import socket from "../../services/socket";

const getColor = (type) => {

  if(type==="critical") return "bg-red-900 border-red-500";
  if(type==="warning") return "bg-yellow-900 border-yellow-500";

  return "bg-blue-900 border-blue-500";

};

const Alerts = () => {

  const [alerts,setAlerts] = useState([]);

  useEffect(()=>{

    const loadAlerts = async ()=>{

      try{

        const res = await API.get("/alerts");

        setAlerts(res.data);

      }catch(error){

        console.error("Alerts error",error);

      }

    };

    loadAlerts();

    // realtime alerts

    socket.on("alert",(alert)=>{

      setAlerts(prev=>[alert,...prev]);

    });

    return ()=> socket.off("alert");

  },[]);

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">

        Alerts

      </h1>

      {alerts.length===0 && (

        <p className="text-gray-400">

          No alerts detected.

        </p>

      )}

      <div className="space-y-4">

        {alerts.map((alert,index)=>(

          <div
            key={index}
            className={`p-4 rounded-lg border ${getColor(alert.type)}`}
          >

            <div className="font-semibold">

              {alert.message}

            </div>

            <div className="text-sm text-gray-300 mt-1">

              Type: {alert.type}

            </div>

            <div className="text-xs text-gray-400">

              {new Date(alert.createdAt).toLocaleString()}

            </div>

          </div>

        ))}

      </div>

    </DashboardLayout>

  )

}

export default Alerts;