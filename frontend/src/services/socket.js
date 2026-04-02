import { io } from "socket.io-client";

// Use environment variable for the backend URL
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true, // Required for cross-origin cookie/session support
});

export default socket;