import API from "./api";

export const sendChatMessage = async (message) => {

  const res = await API.post("/chat",{ message });

  return res.data.reply;

};