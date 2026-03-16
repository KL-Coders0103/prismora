import DashboardLayout from "../../components/layout/DashboardLayout";

import KPICard from "../../components/cards/KPICard";
import RevenueChart from "../../components/charts/RevenueChart";
import SalesChart from "../../components/charts/SalesChart";
import CustomerChart from "../../components/charts/CustomerChart";
import HeatMap from "../../components/charts/HeatMap";

import { motion as Motion } from "framer-motion";
import { useEffect, useState } from "react";

import API from "../../services/api";
import socket from "../../services/socket";

const Dashboard = () => {

  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const res = await API.get("/analytics/dashboard");

        setStats(res.data);

      } catch (err) {

        console.error(err);

        setError("Failed to load dashboard");

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

    socket.on("alert", (alert) => {

      setAlerts(prev => [alert, ...prev]);

    });

    return () => socket.off("alert");

  }, []);

  const dismissAlert = (index)=>{

    setAlerts(prev => prev.filter((_,i)=> i !== index));

  };

  return (

    <DashboardLayout>

      {/* Error */}

      {error && (

        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">

          {error}

        </div>

      )}

      {/* Alerts */}

      {alerts.map((a,index)=>(

        <div
          key={index}
          className="flex justify-between items-center bg-red-500 text-white p-3 rounded mb-3"
        >

          <span>⚠ {a.message}</span>

          <button
            onClick={()=>dismissAlert(index)}
            className="text-sm"
          >
            ✕
          </button>

        </div>

      ))}

      {/* Title */}

      <Motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >

        Dashboard Overview

      </Motion.h1>


      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <KPICard
          title="Revenue"
          value={loading ? "..." : `${stats?.revenue || 0}`}
          change={stats?.revenueChange}
          loading={loading}
        />

        <KPICard
          title="Sales"
          value={loading ? "..." : `${stats?.sales || 0}`}
          change={stats?.salesChange}
          loading={loading}
        />

        <KPICard
          title="Customers"
          value={loading ? "..." : `${stats?.customers || 0}`}
          change={stats?.customerChange}
          loading={loading}
        />

        <KPICard
          title="Conversion Rate"
          value={loading ? "..." : `${stats?.conversionRate || 0}`}
          change={stats?.conversionChange}
          loading={loading}
        />

      </div>


      {/* Revenue Chart */}

      <RevenueChart data={stats?.revenueData} loading={loading} />


      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        <SalesChart data={stats?.salesData} loading={loading} />

        <CustomerChart data={stats?.customerData} loading={loading} />

      </div>


      {/* Heatmap */}

      <div className="mt-6">

        <HeatMap data={stats?.heatmapData} loading={loading} />

      </div>

    </DashboardLayout>

  );

};

export default Dashboard;