import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion as Motion } from "framer-motion";

const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }

    document.title = "PRISMORA | AI Analytics Platform";

  }, []);

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex flex-col items-center justify-center px-6">

      {/* HERO */}

      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >

        <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
          PRISMORA
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          AI Powered Business Intelligence Platform for Modern Companies.
          Analyze sales, customers, and trends with powerful AI insights.
        </p>

        <div className="flex justify-center gap-4">

          <Link
            to="/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 transition rounded-lg shadow-lg"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 transition rounded-lg"
          >
            Register
          </Link>

        </div>

      </Motion.div>

      {/* FEATURES */}

      <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-6xl">

        <Feature
          title="AI Insights"
          text="Automatic AI analysis of business data."
        />

        <Feature
          title="Analytics Dashboard"
          text="Powerful visual dashboards for sales and customers."
        />

        <Feature
          title="AI Assistant"
          text="Chat with your data and get intelligent answers."
        />

      </div>

    </main>
  );
};

const Feature = ({ title, text }) => {

  return (

    <Motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg"
    >

      <h3 className="text-lg font-semibold mb-2 text-blue-400">
        {title}
      </h3>

      <p className="text-sm text-gray-400">
        {text}
      </p>

    </Motion.div>

  );
};

export default Home;