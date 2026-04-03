import { io } from "socket.io-client";

// 🔥 base URL WITHOUT /api
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

const socket = io(BASE_URL, {
  autoConnect: false, // 🔥 VERY IMPORTANT
  transports: ["websocket"], // 🔥 FIX TIMEOUT
  withCredentials: true,
});

export default socket;