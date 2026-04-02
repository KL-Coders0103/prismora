import API from "./api";

export const downloadReportFile = async (type) => {
  try {
    const res = await API.get(`/reports/${type}`, {
      responseType: "blob", // Important: requests the file as a Blob
    });

    // CRITICAL FIX: If backend returns a JSON error, it's still wrapped in a Blob.
    // We must check the content type to see if it's actually an error.
    if (res.data.type === "application/json") {
      const textData = await res.data.text();
      const errorObj = JSON.parse(textData);
      throw new Error(errorObj.message || "Failed to generate report from server.");
    }

    // Create secure object URL
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    
    // Generate dynamic filename with date
    const date = new Date().toISOString().split('T')[0];
    const extension = type === "excel" ? "xlsx" : "pdf";
    const filename = `PRISMORA_${type.toUpperCase()}_Report_${date}.${extension}`;

    link.href = url;
    link.setAttribute("download", filename);
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Download Service Error:", error);
    throw error; // Re-throw to be caught by the component and shown in toast
  }
};