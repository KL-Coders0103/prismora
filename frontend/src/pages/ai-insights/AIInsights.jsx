import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { BrainCircuit, AlertCircle, RefreshCw } from "lucide-react";
import { getInsights } from "../../services/insightService";

// Utils
const clamp = (value) => {
  if (value === null || value === undefined) return 0;
  return Math.min(Math.max(value, 0), 100);
};

const getConfidenceColor = (score) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
};

const AIInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ start true for first load
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getInsights();

      console.log("RAW RESPONSE:", res);

      const safeInsights = res?.insights || res || [];

      console.log("PARSED:", safeInsights);

      setInsights([...safeInsights]); // 🔥 FORCE UPDATE
      setLastUpdated(new Date());

    } catch (err) {
      console.error("Insights Error:", err);
      setError("Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BrainCircuit />
          AI Insights
        </h1>

        <button
          onClick={() => loadInsights(true)} // 🔥 silent refresh (no flicker)
          className="flex items-center gap-2 px-4 py-2 border rounded-lg"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-500 flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-4 border rounded-xl animate-pulse space-y-3"
            >
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
            </div>
          ))}
        </div>
      ) : insights.length === 0 ? (
        <div className="text-gray-400">No insights available</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((insight, index) => {
            const confidence = clamp(insight?.confidence);

            return (
              <Motion.div
                key={`${insight?.title}-${index}`}
                className="p-4 border rounded-xl bg-white dark:bg-gray-900 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {insight?.title}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {insight?.description}
                </p>

                <div className="mt-3 text-sm">
                  Confidence: {confidence}%
                </div>

                <div className="h-2 bg-gray-200 rounded mt-1">
                  <div
                    className={getConfidenceColor(confidence)}
                    style={{ width: `${confidence}%`, height: "100%" }}
                  />
                </div>
              </Motion.div>
            );
          })}
        </div>
      )}

      {/* FOOTER */}
      {lastUpdated && (
        <div className="text-xs text-gray-400">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default AIInsights;