import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

const Alerts = () => {

  const [alerts,setAlerts] = useState([]);

  useEffect(()=>{

    const loadAlerts = async ()=>{

      const res = await API.get("/alerts");

      setAlerts(res.data);

    };

    loadAlerts();

  },[]);

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Alerts
      </h1>

      <div className="space-y-4">

        {alerts.map((alert,index)=>(
          <div
          key={index}
          className="bg-red-900 p-4 rounded-lg"
          >
            {alert.message}
          </div>
        ))}

      </div>

    </DashboardLayout>

  )

}

export default Alerts