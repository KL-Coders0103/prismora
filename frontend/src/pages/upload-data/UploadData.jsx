import { useState } from "react";
import { useDropzone } from "react-dropzone";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

const UploadData = () => {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = (acceptedFiles) => {

    setFile(acceptedFiles[0]);

  };

  const { getRootProps, getInputProps } = useDropzone({

    accept: {
      "text/csv": [".csv"]
    },

    onDrop

  });

  const handleUpload = async () => {

    if (!file) return;

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("file", file);

      const res = await API.post("/upload/csv", formData);

      setMessage(res.data.message);

    } catch{

      setMessage("Upload failed");

    }

    setLoading(false);

  };

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">

        Upload Dataset

      </h1>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-8">

        <div
          {...getRootProps()}
          className="border-2 border-dashed border-slate-600 p-10 text-center rounded-lg cursor-pointer hover:border-blue-500 transition"
        >

          <input {...getInputProps()} />

          <p className="text-gray-400">

            Drag & drop CSV file here or click to upload

          </p>

        </div>

        {file && (

          <div className="mt-4 text-sm text-gray-300">

            Selected File: {file.name}

          </div>

        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg"
        >

          {loading ? "Uploading..." : "Upload Dataset"}

        </button>

        {message && (

          <p className="mt-4 text-green-400">

            {message}

          </p>

        )}

      </div>

    </DashboardLayout>

  );

};

export default UploadData;