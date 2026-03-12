const dns = require("dns");
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 5000;

// connect database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});