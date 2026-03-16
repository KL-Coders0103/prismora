import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {

  const navigate = useNavigate();

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:""
  });

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [showPassword,setShowPassword] = useState(false);

  const handleChange = (e)=>{

    setForm({
      ...form,
      [e.target.name]:e.target.value
    });

  };

  const handleSubmit = async(e)=>{

    e.preventDefault();

    setError("");
    setLoading(true);

    try{

      await registerUser(form);

      navigate("/login");

    }catch(err){

      setError(
        err?.response?.data?.message ||
        "Registration failed"
      );

    }finally{

      setLoading(false);

    }

  };

  return(

    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

      <Motion.form
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-700 p-8 rounded-xl w-96 shadow-lg"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <input
          name="name"
          placeholder="Full Name"
          required
          autoComplete="name"
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          onChange={handleChange}
          className="w-full p-3 mb-4 bg-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative">

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            minLength={6}
            autoComplete="new-password"
            onChange={handleChange}
            className="w-full p-3 mb-4 bg-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={()=>setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 transition py-3 rounded font-medium"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm mt-4 text-gray-400 text-center">

          Already have an account?

          <Link to="/login" className="text-blue-400 ml-1">
            Login
          </Link>

        </p>

      </Motion.form>

    </div>

  );

};

export default Register;