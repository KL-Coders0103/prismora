const products = [
  { name: "Laptop", score: 90 },
  { name: "Mobile", score: 70 },
  { name: "Tablet", score: 60 },
  { name: "Camera", score: 80 }
];

const HeatMap = () => {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">

      <h2 className="text-lg font-bold mb-4">
        Product Performance
      </h2>

      <div className="space-y-3">

        {products.map((p, i) => (

          <div key={i} className="flex justify-between items-center">

            <span>{p.name}</span>

            <div className="w-2/3 bg-slate-700 rounded h-3">
              <div
                className="bg-blue-500 h-3 rounded"
                style={{ width: `${p.score}%` }}
              ></div>
            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default HeatMap;