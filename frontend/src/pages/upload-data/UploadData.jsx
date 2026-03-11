import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import FileUpload from "../../components/ui/FileUpload";

const UploadData = () => {
  const [rows, setRows] = useState([]);

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split("\n");
      const data = lines.map((line) => line.split(","));

      setRows(data.slice(0, 5)); // preview first 5 rows
    };

    reader.readAsText(file);
  };

  return (
    <DashboardLayout>
      <h1>Upload Data</h1>

      <FileUpload onFileUpload={handleFileUpload} />

      {rows.length > 0 && (
        <table style={styles.table}>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={styles.cell}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
};

const styles = {
  table: {
    marginTop: "30px",
    borderCollapse: "collapse",
  },
  cell: {
    border: "1px solid #ddd",
    padding: "8px",
  },
};

export default UploadData;
