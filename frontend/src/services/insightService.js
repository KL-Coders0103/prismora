import API from "./api";

export const getInsights = async () => {

  const res = await API.get("/insights");

  return res.data;

};