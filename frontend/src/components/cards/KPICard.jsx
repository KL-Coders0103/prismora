import { motion as Motion } from "framer-motion";
import CountUp from "react-countup";
import { TrendingUp, TrendingDown } from "lucide-react";

const KPICard = ({ title, value, change }) => {

  const isPositive = change.includes("+");

  return (
    <Motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-900 border border-slate-700 rounded-xl p-5
                 shadow-lg hover:border-blue-500 transition-all duration-300"
    >

      <div className="flex items-center justify-between">

        <h3 className="text-sm text-gray-400">
          {title}
        </h3>

        {isPositive ? (
          <TrendingUp size={18} className="text-green-400" />
        ) : (
          <TrendingDown size={18} className="text-red-400" />
        )}

      </div>

      <h2 className="text-3xl font-bold mt-2">

        <CountUp
          end={parseFloat(value)}
          duration={1.5}
        />

      </h2>

      <p
        className={`text-sm mt-2 ${
          isPositive ? "text-green-400" : "text-red-400"
        }`}
      >
        {change}
      </p>

    </Motion.div>
  );
};

export default KPICard;