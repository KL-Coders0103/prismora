import { useState } from "react";
import { useDropzone } from "react-dropzone";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const UploadData = () => {

  const [file,setFile] = useState(null);
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);
  const [progress,setProgress] = useState(0);

  const onDrop = (acceptedFiles) => {

    const selected = acceptedFiles[0];

    if(!selected) return;

    if(selected.size > MAX_SIZE){

      setError("File must be under 5MB");
      return;

    }

    if(!selected.name.endsWith(".csv")){

      setError("Only CSV files allowed");
      return;

    }

    setError("");
    setMessage("");
    setFile(selected);

  };

  const { getRootProps,getInputProps,isDragActive } = useDropzone({

    accept:{
      "text/csv":[".csv"]
    },

    maxFiles:1,

    onDrop

  });

  const handleUpload = async () => {

    if(!file) return;

    setLoading(true);
    setError("");
    setMessage("");

    try{

      const formData = new FormData();

      formData.append("file",file);

      const res = await API.post("/upload/csv",formData,{

        headers:{
          "Content-Type":"multipart/form-data"
        },

        onUploadProgress:(progressEvent)=>{

          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setProgress(percent);

        }

      });

      setMessage(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    }catch(err){

      setError(
        err?.response?.data?.message || "Upload failed"
      );

    }finally{

      setLoading(false);
      setProgress(0);

    }

  };

  return(

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Upload Dataset
      </h1>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-8">

        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-10 text-center rounded-lg cursor-pointer transition
          ${isDragActive ? "border-blue-500 bg-slate-800" : "border-slate-600 hover:border-blue-500"}`}
        >

          <input {...getInputProps()} />

          {isDragActive ? (
            <p className="text-blue-400">
              Drop the CSV file here...
            </p>
          ) : (
            <p className="text-gray-400">
              Drag & drop CSV file here or click to upload
            </p>
          )}

        </div>

        {file && (

          <div className="mt-4 text-sm text-gray-300">

            Selected File: {file.name}

          </div>

        )}

        {loading && (

          <div className="mt-4">

            <div className="w-full bg-slate-700 h-2 rounded">

              <div
                className="bg-blue-500 h-2 rounded"
                style={{width:`${progress}%`}}
              />

            </div>

            <p className="text-sm mt-1 text-gray-400">
              Uploading {progress}%
            </p>

          </div>

        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-6 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg disabled:opacity-50"
        >

          {loading ? "Uploading..." : "Upload Dataset"}

        </button>

        {message && (

          <p className="mt-4 text-green-400">
            {message}
          </p>

        )}

        {error && (

          <p className="mt-4 text-red-400">
            {error}
          </p>

        )}

      </div>

    </DashboardLayout>

  );

};

export default UploadData;