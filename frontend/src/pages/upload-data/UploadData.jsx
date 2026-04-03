import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../services/api";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const UploadData = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const controllerRef = useRef(null);

  const isValidCSV = (file) => {
    return file.name.toLowerCase().endsWith(".csv");
  };

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      toast.error(error.message);
      return;
    }

    const selected = acceptedFiles[0];

    if (!selected) return;

    // ✅ EXTRA VALIDATION
    if (!isValidCSV(selected)) {
      toast.error("Only CSV files are allowed.");
      return;
    }

    if (selected.size > MAX_SIZE) {
      toast.error("File exceeds 5MB limit.");
      return;
    }

    setFile(selected);
    setUploadSuccess(false);
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    maxSize: MAX_SIZE,
    onDrop,
  });

  const handleUpload = async () => {
    if (!file || loading) return; // ✅ prevent double click

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    controllerRef.current = new AbortController();

    try {
      const res = await API.post("/upload/csv", formData, {
        signal: controllerRef.current.signal,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;

          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setProgress(percent);
        },
      });

      toast.success(res.data?.message || "Dataset uploaded successfully!");
      setUploadSuccess(true);
      setFile(null); // ✅ reset file after success
    } catch (err) {
      if (err.name === "CanceledError") {
        toast("Upload cancelled");
      } else if (!err.response) {
        toast.error("Network error. Please check connection.");
      } else {
        toast.error(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Upload failed"
        );
      }
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const resetUploader = () => {
    if (controllerRef.current) {
      controllerRef.current.abort(); // ✅ cancel ongoing request
    }
    setFile(null);
    setUploadSuccess(false);
    setProgress(0);
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* HEADER */}
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold">Upload Dataset</h1>
        <p className="text-sm text-gray-500">
          Upload CSV data to update analytics.
        </p>
      </div>

      <div className="rounded-xl border p-6 bg-white dark:bg-gray-900">

        {/* DROPZONE */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-12 text-center rounded-xl cursor-pointer
          ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}
          ${file || loading ? "pointer-events-none opacity-50" : ""}`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto mb-4" size={32} />
          <p>{isDragActive ? "Drop file here" : "Click or drag CSV file"}</p>
        </div>

        {/* FILE PREVIEW */}
        {file && !uploadSuccess && (
          <div className="mt-4 flex justify-between items-center">
            <span>{file.name}</span>
            {!loading && (
              <button onClick={resetUploader}>
                <X />
              </button>
            )}
          </div>
        )}

        {/* PROGRESS */}
        {loading && (
          <div className="mt-4">
            <div>{progress}%</div>
            <div className="h-2 bg-gray-200">
              <div
                className="h-full bg-indigo-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {uploadSuccess && (
          <div className="mt-4 text-green-600">
            Upload Complete ✅
          </div>
        )}

        {/* ACTION */}
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Process Dataset"}
          </button>
        </div>
      </div>
    </Motion.div>
  );
};

export default UploadData;