import { useEffect, useState } from "react";
import API from "../../services/api";
import { getProductPerformance } from "../../services/analyticsService";


const getColor = (value) => {

  if (value > 80) return "bg-green-500";
  if (value > 60) return "bg-yellow-500";
  if (value > 40) return "bg-orange-500";

  return "bg-red-500";

};

const HeatMap = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadProducts = async () => {

      try {

        const res = await getProductPerformance();

        const formatted = res.map(item => ({
            name: item._id,
            score: item.revenue
          }))
          .sort((a,b) => b.score - a.score);

        setProducts(formatted);

      } catch (error) {

        console.error("Heatmap error:", error);

      } finally {

        setLoading(false);

      }

    };

    loadProducts();

  }, []);

  if (loading) {

    return (

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

        <h2 className="text-lg font-bold mb-4">
          Product Performance
        </h2>

        <div className="animate-pulse h-40 bg-slate-800 rounded"></div>

      </div>

    );

  }

  return (

    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

      <h2 className="text-lg font-bold mb-4">
        Product Performance
      </h2>

      <div className="space-y-4">

        {products.map((p, i) => (

          <div key={i}>

            <div className="flex justify-between text-sm mb-1">

              <span>{p.name}</span>

              <span>{p.score}</span>

            </div>

            <div className="w-full bg-slate-700 rounded h-3">

              <div
                className={`h-3 rounded ${getColor(p.score)}`}
                style={{ width: `${Math.min(p.score/1000*100,100)}%` }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default HeatMap;