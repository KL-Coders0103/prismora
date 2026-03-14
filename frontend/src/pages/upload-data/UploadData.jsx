import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

const UploadData = () => {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    const res = await API.post("/upload/csv", formData);

    setMessage(res.data.message);

  };

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Upload Dataset
      </h1>

      <div className="bg-slate-900 p-6 rounded-xl">

        <input
          type="file"
          accept=".csv"
          onChange={(e)=>setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Upload
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