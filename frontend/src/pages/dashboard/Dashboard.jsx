import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import KPICard from "../../components/cards/KPICard";
import RevenueChart from "../../components/charts/RevenueChart";
import SalesChart from "../../components/charts/SalesChart";
import CustomerChart from "../../components/charts/CustomerChart";
import HeatMap from "../../components/charts/HeatMap";

import API from "../../services/api";
import socket from "../../services/socket"; 

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await API.get("/analytics/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();

    const handleAlert = (alert) => setAlerts((prev) => [alert, ...prev]);
    socket.on("alert", handleAlert);
    return () => socket.off("alert", handleAlert);

  }, []);

  const dismissAlert = (index) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
          <div className="flex items-center">
            <span className="font-medium">Error:</span>
            <span className="ml-2">{error}</span>
          </div>
        </div>
      )}

      {/* Real-time Alerts */}
      <AnimatePresence>
        {alerts.map((a, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: "12px" }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-800 shadow-sm dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">⚠️</span> {a.message}
            </span>
            <button
              onClick={() => dismissAlert(index)}
              className="rounded-md p-1 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
            >
              <X size={16} />
            </button>
          </Motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <Motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Dashboard Overview
        </Motion.h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <KPICard title="Revenue" value={stats?.revenue || 0} change={stats?.revenueChange} loading={loading} />
        <KPICard title="Sales" value={stats?.sales || 0} change={stats?.salesChange} loading={loading} />
        <KPICard title="Customers" value={stats?.customers || 0} change={stats?.customerChange} loading={loading} />
        <KPICard title="Conversion Rate" value={stats?.conversionRate || 0} change={stats?.conversionChange} loading={loading} />
      </div>

      {/* REVENUE CHART */}
      <div className="w-full">
        {loading ? (
          <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-xl" /> 
        ) : (
          <RevenueChart data={stats?.revenueData || []} />
        )}
      </div>

      {/* MULTI-CHART ROW */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {!loading && <SalesChart data={stats?.salesData || []} />}
        {!loading && <CustomerChart data={stats?.customerData || []} />}
      </div>

      {/* HEATMAP / PRODUCT PERFORMANCE */}
      <div className="w-full">
        <HeatMap data={stats?.heatmapData} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;