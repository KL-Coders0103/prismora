import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Activity } from "lucide-react";

import KPICard from "../../components/cards/KPICard";
import RevenueChart from "../../components/charts/RevenueChart";
import SalesChart from "../../components/charts/SalesChart";
import CustomerChart from "../../components/charts/CustomerChart";
import HeatMap from "../../components/charts/HeatMap";
import API from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // AI CEO Mode States
  const [ceoSummary, setCeoSummary] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await API.get("/analytics/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleGenerateSummary = async () => {
    setIsGeneratingAI(true);
    try {
      // Calls the new algorithmic backend route
      const res = await API.get("/analytics/ceo-summary");
      setCeoSummary(res.data.summary);
    } catch {
      console.error("Failed to fetch CEO Summary");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER & AI BUTTON */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Overview</h1>
        </div>

        <button
          onClick={handleGenerateSummary}
          disabled={isGeneratingAI}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium shadow-lg transition-all
            bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
        >
          {isGeneratingAI ? (
            <Activity className="animate-pulse" size={18} />
          ) : (
            <Sparkles size={18} />
          )}
          {isGeneratingAI ? "Analyzing Data..." : "AI CEO Summary"}
        </button>
      </div>

      {/* AI CEO SUMMARY CARD */}
      <AnimatePresence>
        {ceoSummary && (
          <Motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-500/20 shadow-inner">
              <button 
                onClick={() => setCeoSummary(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-purple-500" size={24} />
                <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Executive Briefing
                </h2>
              </div>
              
              <ul className="space-y-3">
                {ceoSummary.map((point, index) => (
                  <Motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex gap-3 text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    <span className="text-indigo-500 mt-1">•</span>
                    {point}
                  </Motion.li>
                ))}
              </ul>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Revenue" value={stats?.revenue || 0} loading={loading} />
        <KPICard title="Sales" value={stats?.sales || 0} loading={loading} />
        <KPICard title="Customers" value={stats?.customers || 0} loading={loading} />
        {/* 🔥 FIX: Changed title to "Conversion Rate" to match KPICard maps */}
        <KPICard title="Conversion Rate" value={stats?.conversionRate || 0} loading={loading} />
      </div>

      {/* CHARTS */}
      <RevenueChart data={stats?.revenueData || []} />
      <SalesChart data={stats?.salesData || []} />
      <CustomerChart data={stats?.customerData || []} />
      <HeatMap data={stats?.heatmapData || []} />
    </div>
  );
};

export default Dashboard;