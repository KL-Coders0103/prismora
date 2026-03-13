const { Server } = require("socket.io");

let io;

const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

};

const sendAlert = (message) => {
  if (io) {
    io.emit("alert", message);
  }
};

module.exports = { initSocket, sendAlert };