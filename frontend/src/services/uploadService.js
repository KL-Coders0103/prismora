import API from "./api";

export const uploadCSV = async (file, onUploadProgress) => {

  const formData = new FormData();

  formData.append("file",file);

  const res = await API.post("/upload/csv",formData,{
    onUploadProgress
  });

  return res.data;

};