import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

import API from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

const AIInsights = () => {

  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadInsights = async () => {

      try {

        const res = await API.get("/insights");

        setInsights(res.data.insights);

      } catch (error) {

        console.error("AI insights error:", error);

      } finally {

        setLoading(false);

      }

    };

    loadInsights();

  }, []);


  if (loading) {

    return (

      <DashboardLayout>

        <h1 className="text-3xl font-bold mb-6">
          AI Business Insights
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          {[1,2,3,4].map((i) => (

            <div
              key={i}
              className="animate-pulse bg-slate-800 h-40 rounded-xl"
            />

          ))}

        </div>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        AI Business Insights
      </h1>

      {insights.length === 0 && (

        <p className="text-gray-400">
          No AI insights generated yet.
        </p>

      )}

      <div className="grid md:grid-cols-2 gap-6">

        {insights.map((insight, i) => (

          <Motion.div
            key={i}
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:i*0.1 }}
            className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition"
          >

            {/* Title */}

            <h3 className="text-lg font-semibold mb-2">

              {insight.title}

            </h3>

            {/* Description */}

            <p className="text-gray-400 text-sm mb-4">

              {insight.description}

            </p>

            {/* Confidence */}

            <div className="text-sm mb-2">

              Confidence {insight.confidence}%

            </div>

            <div className="w-full bg-slate-700 rounded h-2">

              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width:`${insight.confidence}%` }}
              />

            </div>

          </Motion.div>

        ))}

      </div>

    </DashboardLayout>

  );

};

export default AIInsights;