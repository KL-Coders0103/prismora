import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

const Profile = () => {

  const [user,setUser] = useState({});
  const [name,setName] = useState("");
  const [loading,setLoading] = useState(true);
  const [message,setMessage] = useState("");

  useEffect(()=>{

    const loadProfile = async ()=>{

      try{

        const res = await API.get("/profile");

        setUser(res.data);
        setName(res.data.name);

      }catch(error){

        console.error("Profile error",error);

      }finally{

        setLoading(false);

      }

    };

    loadProfile();

  },[]);

  const updateProfile = async ()=>{

    try{

      const res = await API.put("/profile",{ name });

      setUser(res.data);

      setMessage("Profile updated successfully");

    }catch{

      setMessage("Update failed");

    }

  };

  if(loading){

    return(

      <DashboardLayout>

        <p className="text-gray-400">Loading profile...</p>

      </DashboardLayout>

    )

  }

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Profile
      </h1>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md">

        {/* Avatar */}

        <div className="flex items-center gap-4 mb-6">

          <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">

            {user.name?.charAt(0)}

          </div>

          <div>

            <p className="font-semibold">
              {user.name}
            </p>

            <p className="text-sm text-gray-400">
              {user.role}
            </p>

          </div>

        </div>

        {/* Email */}

        <div className="mb-4">

          <p className="text-sm text-gray-400">
            Email
          </p>

          <p>
            {user.email}
          </p>

        </div>

        {/* Edit Name */}

        <div className="mb-4">

          <p className="text-sm text-gray-400 mb-1">
            Name
          </p>

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full p-2 bg-slate-800 rounded"
          />

        </div>

        <button
          onClick={updateProfile}
          className="bg-blue-500 px-4 py-2 rounded"
        >

          Update Profile

        </button>

        {message && (

          <p className="mt-3 text-green-400 text-sm">

            {message}

          </p>

        )}

      </div>

    </DashboardLayout>

  )

}

export default Profile