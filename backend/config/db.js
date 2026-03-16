const mongoose = require("mongoose");

const connectDB = async () => {

  try {

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {

    console.error("MongoDB connection error:", error.message);

    process.exit(1);

  }

};


// CONNECTION EVENTS

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});


module.exports = connectDB;