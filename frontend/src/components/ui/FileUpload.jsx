import { useState } from "react";

const FileUpload = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    onFileUpload(file);
  };

  return (
    <div style={styles.container}>
      <input type="file" accept=".csv" onChange={handleFile} />
      {fileName && <p>Uploaded: {fileName}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    border: "2px dashed #6366f1",
    borderRadius: "10px",
    width: "400px",
  },
};

export default FileUpload;
