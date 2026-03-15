import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [form,setForm] = useState({
    email:"",
    password:""
  });

  const [loading,setLoading] = useState(false);

  const handleChange = (e)=>{

    setForm({
      ...form,
      [e.target.name]:e.target.value
    });

  };

  const handleSubmit = async(e)=>{

    e.preventDefault();

    setLoading(true);

    try{

      const data = await loginUser(form);

      localStorage.setItem("token",data.token);

      navigate("/");

    }catch{

      alert("Invalid email or password");

    }

    setLoading(false);

  };

  return(

    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-700 p-8 rounded-xl w-80"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          PRISMORA Login
        </h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-4 bg-slate-800 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-4 bg-slate-800 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-4 text-gray-400 text-center">

          Don't have an account?  

          <Link to="/register" className="text-blue-400 ml-1">
            Register
          </Link>

        </p>

      </form>

    </div>

  );

};

export default Login;