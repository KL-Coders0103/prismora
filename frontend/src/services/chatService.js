import API from "./api";

// AI Chat
export const sendChatMessage = async (message) => {
  const res = await API.post("/chat", { message });
  return res.data; // Now returns the whole object so we can handle metadata
};