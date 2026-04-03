import React from "react";
import { motion as Motion } from "framer-motion";

const FeatureCard = React.memo(({ icon, title, text }) => {
  return (
    <Motion.div
      whileHover={{ y: -8 }}
      className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>

      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
        {text}
      </p>
    </Motion.div>
  );
});

export default FeatureCard;