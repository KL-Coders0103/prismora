import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {

  autoConnect: true,

  reconnection: true,

  reconnectionAttempts: 5,

});

export default socket;