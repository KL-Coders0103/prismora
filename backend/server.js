require("dotenv").config();
const dns = require("dns");
const http = require("http");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./sockets/realtimeSocket");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 PRISMORA API running on port ${PORT}`);
});