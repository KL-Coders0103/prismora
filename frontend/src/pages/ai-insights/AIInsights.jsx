import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { getInsights } from "../../services/insightService";

const clamp = (value) => {

  if(!value) return 0;

  return Math.min(Math.max(value,0),100);

};

const AIInsights = () => {

  const [insights,setInsights] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(()=>{

    const loadInsights = async ()=>{

      try{

        const data = await getInsights();

        setInsights(data.insights || []);

      }catch(err){

        console.error(err);
        setError("Failed to load AI insights");

      }finally{

        setLoading(false);

      }

    };

    loadInsights();

  },[]);

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        AI Business Insights
      </h1>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (

        <div className="grid md:grid-cols-2 gap-6">

          {[1,2,3,4].map((i)=>(

            <div
              key={i}
              className="animate-pulse bg-slate-800 h-40 rounded-xl"
            />

          ))}

        </div>

      )}

      {!loading && insights.length === 0 && (

        <div className="text-center text-gray-400">

          <p>No AI insights generated yet.</p>

        </div>

      )}

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {insights.map((insight,i)=>(

          <Motion.div
            key={insight._id || insight.title}
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:Math.min(i*0.05,0.3) }}
            className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition"
          >

            <h3 className="text-lg font-semibold mb-2">
              {insight.title}
            </h3>

            <p className="text-gray-400 text-sm mb-4">
              {insight.description}
            </p>

            <div className="text-sm mb-2">

              Confidence {clamp(insight.confidence)}%

            </div>

            <div className="w-full bg-slate-700 rounded h-2">

              <div
                className="bg-blue-500 h-2 rounded"
                style={{
                  width:`${clamp(insight.confidence)}%`
                }}
              />

            </div>

          </Motion.div>

        ))}

      </div>

    </DashboardLayout>

  )

}

export default AIInsights