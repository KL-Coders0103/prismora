import API from "./api";

export const uploadCSV = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/upload/csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    // Allows the frontend to show a real-time % progress bar
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percentCompleted);
      }
    },
  });

  return res.data;
};