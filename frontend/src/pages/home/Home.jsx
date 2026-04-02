import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { BrainCircuit, LineChart, MessageSquare, ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
    document.title = "PRISMORA | AI Business Analytics";
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500 overflow-hidden relative">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HERO SECTION */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-6">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Now with Predictive Analytics
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
            Business Intelligence <br />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">Powered by AI</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The modern analytics platform for teams. Analyze revenue trends, detect anomalies, and predict customer behavior in seconds.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-1"
            >
              Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Sign In
            </Link>
          </div>
        </Motion.div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full">
          <Feature 
            icon={<BrainCircuit className="text-indigo-500" />} 
            title="AI Insights" 
            text="Our Prophet-powered engine automatically detects patterns and forecasts future sales." 
          />
          <Feature 
            icon={<LineChart className="text-blue-500" />} 
            title="Smart Dashboard" 
            text="High-performance charts providing a 360-degree view of your global operations." 
          />
          <Feature 
            icon={<MessageSquare className="text-cyan-500" />} 
            title="AI Assistant" 
            text="Natural language processing allows you to chat with your data to find instant answers." 
          />
        </div>
      </main>
    </div>
  );
};

const Feature = ({ icon, title, text }) => (
  <Motion.div
    whileHover={{ y: -8 }}
    className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{text}</p>
  </Motion.div>
);

export default Home;