import { motion as Motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingCart,
  Users,
  Percent
} from "lucide-react";

const formatINR = (value) => {

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

};

const iconMap = {
  Revenue: IndianRupee,
  Sales: ShoppingCart,
  Customers: Users,
  "Conversion Rate": Percent
};

const colorMap = {
  Revenue: "from-green-500/20 to-green-600/10 border-green-500/30",
  Sales: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  Customers: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  "Conversion Rate": "from-orange-500/20 to-orange-600/10 border-orange-500/30"
};

const KPICard = ({ title, value, change }) => {

  const Icon = iconMap[title];

  const isPositive = change?.includes("+");

  let displayValue = value;

  if (title === "Revenue") displayValue = formatINR(value);
  if (title === "Conversion Rate") displayValue = `${value}%`;

  return (

    <Motion.div
      whileHover={{ scale: 1.04 }}
      className={`bg-gradient-to-br ${colorMap[title]}
      border rounded-xl p-6 shadow-lg backdrop-blur-lg`}
    >

      <div className="flex items-center justify-between mb-3">

        <div className="flex items-center gap-2">

          <Icon size={18} className="text-white opacity-80" />

          <h3 className="text-sm text-gray-300">
            {title}
          </h3>

        </div>

        {isPositive ? (
          <TrendingUp size={18} className="text-green-400" />
        ) : (
          <TrendingDown size={18} className="text-red-400" />
        )}

      </div>

      <h2 className="text-3xl font-bold text-white">

        {displayValue}

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