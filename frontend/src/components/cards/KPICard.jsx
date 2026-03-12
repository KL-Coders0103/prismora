const KPICard = ({ title, value, change }) => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">

      <h3 className="text-sm text-gray-400">
        {title}
      </h3>

      <h2 className="text-2xl font-bold mt-2">
        {value}
      </h2>

      <p className="text-green-400 text-sm mt-2">
        {change}
      </p>

    </div>
  );
};

export default KPICard;