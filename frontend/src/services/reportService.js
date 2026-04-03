import API from "./api";

export const downloadReportFile = async (type) => {
  try {
    const res = await API.get(`/reports/${type}`, {
      responseType: "blob", 
    });

    // ✅ CHECK FOR JSON ERRORS HIDDEN IN BLOB
    if (res.data.type === "application/json") {
      const textData = await res.data.text();
      const errorObj = JSON.parse(textData);
      throw new Error(errorObj.message || "Server failed to generate report.");
    }

    // Create Download Link
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    
    const date = new Date().toISOString().split('T')[0];
    const extension = type === "excel" ? "xlsx" : "pdf";
    const filename = `PRISMORA_${type.toUpperCase()}_Report_${date}.${extension}`;

    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
    window.URL.revokeObjectURL(url);

    // ✅ CRITICAL FIX: Return true so the component knows it was successful
    return true;

  } catch (error) {
    console.error("Download Service Error:", error);
    throw error; 
  }
};