import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getProfile,
  updateProfileName
} from "../../services/profileService";

const Profile = () => {

  const [user,setUser] = useState({});
  const [name,setName] = useState("");

  const [loading,setLoading] = useState(true);
  const [updating,setUpdating] = useState(false);

  const [success,setSuccess] = useState("");
  const [error,setError] = useState("");

  useEffect(()=>{

    const loadProfile = async ()=>{

      try{

        const data = await getProfile();

        setUser(data);
        setName(data.name);

      }catch(err){

        console.error(err);
        setError("Failed to load profile");

      }finally{

        setLoading(false);

      }

    };

    loadProfile();

  },[]);

  const handleUpdate = async ()=>{

    setSuccess("");
    setError("");

    if(!name.trim()){

      setError("Name cannot be empty");
      return;

    }

    setUpdating(true);

    try{

      const updated = await updateProfileName(name);

      setUser(updated);

      setSuccess("Profile updated successfully");

    }catch(err){

      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Update failed"
      );

    }finally{

      setUpdating(false);

    }

  };

  if(loading){

    return(

      <DashboardLayout>

        <p className="text-gray-400">
          Loading profile...
        </p>

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

            {user.name?.charAt(0)?.toUpperCase() || "?"}

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

          <label className="text-sm text-gray-400 mb-1 block">
            Name
          </label>

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            autoComplete="name"
            className="w-full p-2 bg-slate-800 rounded"
          />

        </div>

        <button
          onClick={handleUpdate}
          disabled={updating}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
        >

          {updating ? "Updating..." : "Update Profile"}

        </button>

        {success && (

          <p className="mt-3 text-green-400 text-sm">
            {success}
          </p>

        )}

        {error && (

          <p className="mt-3 text-red-400 text-sm">
            {error}
          </p>

        )}

      </div>

    </DashboardLayout>

  )

}

export default Profile