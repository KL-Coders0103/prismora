import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { BrainCircuit, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { getInsights } from "../../services/insightService";

const clamp = (value) => {
  if (!value) return 0;
  return Math.min(Math.max(value, 0), 100);
};

const getConfidenceColor = (score) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
};

// Framer Motion Variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const AIInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInsights();
      setInsights(data.insights || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Failed to load AI insights. The ML service might be unreachable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="text-indigo-600 dark:text-indigo-400" />
            AI Business Insights
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Machine Learning predictions, anomaly detection, and automated recommendations.
          </p>
        </div>
        
        <button
          onClick={loadInsights}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Models
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col h-48 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800 mb-4"></div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800 mb-2"></div>
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-800 mb-auto"></div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-2 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </div>
          ))}
        </div>
      ) : insights.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-900/50">
          <BrainCircuit size={48} className="mb-4 text-gray-400 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Insights Available</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The ML models need more data to generate insights.</p>
        </div>
      ) : (
        /* Insights Grid */
        <Motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {insights.map((insight, i) => {
            const confidence = clamp(insight.confidence);
            const isHighConfidence = confidence >= 80;

            return (
              <Motion.div
                key={insight._id || insight.title || i}
                variants={itemVariants}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                    {insight.title}
                  </h3>
                  {isHighConfidence && (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400" title="High Confidence">
                      <TrendingUp size={14} />
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-1">
                  {insight.description || "Analysis generated but no description provided by the model."}
                </p>

                <div className="mt-auto">
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span className="text-gray-500 dark:text-gray-400">Confidence Score</span>
                    <span className="text-gray-900 dark:text-white">{confidence}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${getConfidenceColor(confidence)}`}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>
              </Motion.div>
            );
          })}
        </Motion.div>
      )}
      
      {lastUpdated && (
        <div className="text-right text-xs text-gray-400 dark:text-gray-500 mt-4">
          Models last synced: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default AIInsights;