import React from "react";

const HeatMap = ({ data = [], loading }) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Product Performance</h2>
        <div className="h-40 w-full animate-pulse flex flex-col gap-4">
          <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800"></div>
          <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-800"></div>
          <div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800"></div>
        </div>
      </div>
    );
  }

  const products = data[0]?.name ? data : data.map(item => ({ name: item._id || "Unknown", score: item.revenue || 0 }));
  
  if (!products || products.length === 0) return null;

  // Dynamically calculate the max value so the progress bars scale correctly
  const maxScore = Math.max(...products.map(p => p.score));

  const getBarColor = (percentage) => {
    if (percentage >= 80) return "bg-indigo-500";
    if (percentage >= 50) return "bg-blue-400";
    if (percentage >= 25) return "bg-cyan-400";
    return "bg-gray-400 dark:bg-gray-600";
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Product Performance</h2>
      
      <div className="space-y-5">
        {products.map((p, i) => {
          const percentage = maxScore > 0 ? (p.score / maxScore) * 100 : 0;
          
          return (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1.5 font-medium">
                <span className="text-gray-700 dark:text-gray-300">{p.name}</span>
                <span className="text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p.score)}
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${getBarColor(percentage)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeatMap;