import { useEffect, useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";

const AIInsights = () => {

  const [insights, setInsights] = useState([]);

  useEffect(() => {

    const loadInsights = async () => {

      const res = await API.get("/insights");

      setInsights(res.data.insights);

    };

    loadInsights();

  }, []);

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        AI Insights
      </h1>

      <div className="space-y-4">

        {insights.map((insight, i) => (

          <div
            key={i}
            className="bg-slate-900 border border-slate-700 rounded-xl p-5"
          >
            {insight}
          </div>

        ))}

      </div>

    </DashboardLayout>

  );

};

export default AIInsights;