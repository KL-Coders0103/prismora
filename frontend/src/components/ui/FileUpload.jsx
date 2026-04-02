import React, { useRef, useState } from "react";
import { UploadCloud, File } from "lucide-react";

// This is a lightweight component alternative to the full Dropzone page
const FileUpload = ({ onFileUpload, accept = ".csv" }) => {
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  const onChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
        isDragging 
          ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/10" 
          : "border-gray-300 bg-gray-50 hover:border-indigo-400 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-indigo-500"
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        accept={accept} 
        onChange={onChange} 
        ref={inputRef} 
        className="hidden" 
      />
      
      {fileName ? (
        <div className="flex flex-col items-center text-indigo-600 dark:text-indigo-400">
          <File size={32} className="mb-2" />
          <p className="text-sm font-medium">{fileName}</p>
          <p className="mt-1 text-xs text-gray-500">Click to replace file</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
          <UploadCloud size={32} className="mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">Click to upload or drag & drop</p>
          <p className="mt-1 text-xs">CSV, Excel files supported</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;