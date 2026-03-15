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
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const res = await API.get("/analytics/dashboard");

        setStats(res.data);

      } catch (err) {

        console.error("Dashboard error:", err);

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

    socket.on("alert", (alert) => {

      setAlert(alert.message);

    });

    return () => socket.off("alert");

  }, []);

  return (

    <DashboardLayout>

      {/* Alert Banner */}

      {alert && (

        <div className="bg-red-500 text-white p-3 rounded mb-4">

          ⚠ {alert}

        </div>

      )}

      {/* Title */}

      <Motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >

        Dashboard Overview

      </Motion.h1>


      {/* KPI Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <KPICard
          title="Revenue"
          value={loading ? "..." : stats?.revenue}
          change="+12%"
        />

        <KPICard
          title="Sales"
          value={loading ? "..." : stats?.sales}
          change="+8%"
        />

        <KPICard
          title="Customers"
          value={loading ? "..." : stats?.customers}
          change="+5%"
        />

        <KPICard
          title="Conversion Rate"
          value={loading ? "..." : stats?.conversionRate}
          change="+1.2%"
        />

      </div>


      {/* Revenue Chart */}

      <RevenueChart />


      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        <SalesChart />

        <CustomerChart />

      </div>


      {/* Heatmap */}

      <div className="mt-6">

        <HeatMap />

      </div>

    </DashboardLayout>

  );

};

export default Dashboard;