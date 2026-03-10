const express = require("express");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// connect database
connectDB();

app.get("/", (req, res) => {
  res.send("Prismora API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});