import React, { useState, useCallback } from "react";
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

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // Handle Rejections first
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      if (error.code === "file-too-large") {
        toast.error("File is too large. Maximum size is 5MB.");
      } else if (error.code === "file-invalid-type") {
        toast.error("Invalid file format. Only CSV files are allowed.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      setUploadSuccess(false);
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    maxSize: MAX_SIZE,
    onDrop,
  });

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/upload/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      toast.success(res.data.message || "Dataset uploaded successfully!");
      setUploadSuccess(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error || "Upload failed. Please check the file and try again.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const resetUploader = () => {
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
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Upload Dataset
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ingest raw CSV sales data to update your ML models and analytics dashboards.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300">
        
        {/* DRAG & DROP ZONE */}
        <div
          {...getRootProps()}
          className={`relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200 ease-in-out
          ${
            isDragActive
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
              : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-indigo-500 dark:hover:bg-gray-800/50"
          }
          ${file || loading ? "pointer-events-none opacity-50" : ""}`}
        >
          <input {...getInputProps()} />
          
          <div className={`mb-4 rounded-full p-4 ${isDragActive ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
            <UploadCloud size={32} />
          </div>
          
          <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
            {isDragActive ? "Drop the file to upload" : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            CSV files only (Max size: 5MB)
          </p>
        </div>

        {/* SELECTED FILE PREVIEW */}
        <AnimatePresence>
          {file && !uploadSuccess && (
            <Motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "24px" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <FileSpreadsheet size={20} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {!loading && (
                <button
                  onClick={resetUploader}
                  className="rounded-md p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </Motion.div>
          )}
        </AnimatePresence>

        {/* PROGRESS BAR */}
        <AnimatePresence>
          {loading && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 space-y-2"
            >
              <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                <span>Uploading and parsing data...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 ease-out dark:bg-indigo-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* SUCCESS STATE */}
        <AnimatePresence>
          {uploadSuccess && (
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-500/20 dark:bg-green-500/10"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-400">Upload Complete</h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-500">
                The dataset has been processed and analytics are updated.
              </p>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* ACTIONS */}
        <div className="mt-8 flex justify-end gap-3">
          {uploadSuccess ? (
            <button
              onClick={resetUploader}
              className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Upload Another File
            </button>
          ) : (
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900 transition-all"
            >
              {loading ? "Processing..." : "Process Dataset"}
            </button>
          )}
        </div>
      </div>
    </Motion.div>
  );
};

export default UploadData;