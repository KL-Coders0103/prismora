import API from "./api"; // Ensure this path points to your Axios instance

export const sendChatMessage = async (query) => {
  try {
    // ⚠️ CRITICAL: Make sure this matches the route you added in your backend!
    const res = await API.post("/analytics/chat", { query });
    
    // We MUST return the entire res.data object so the frontend gets the chartType and chartData
    return res.data; 
  } catch (error) {
    console.error("Chat Service Error:", error);
    throw error;
  }
};