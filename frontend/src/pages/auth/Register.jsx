import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {

  const navigate = useNavigate();

  const [form,setForm] = useState({
    name:"",
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

      await registerUser(form);

      alert("Account created");

      navigate("/login");

    }catch{

      alert("Registration failed");

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
          Create Account
        </h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 mb-4 bg-slate-800 rounded"
        />

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
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm mt-4 text-gray-400 text-center">

          Already have an account?  

          <Link to="/login" className="text-blue-400 ml-1">
            Login
          </Link>

        </p>

      </form>

    </div>

  );

};

export default Register;