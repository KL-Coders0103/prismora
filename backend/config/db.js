const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // If it's a DNS/SRV issue, suggest checking the URI format
    if (error.message.includes("ECONNREFUSED")) {
      console.log("👉 Tip: Check your IP Whitelist in MongoDB Atlas and ensure the URI format is correct.");
    }
    
    process.exit(1); // Stop the process so nodemon can restart it
  }
};

module.exports = connectDB;