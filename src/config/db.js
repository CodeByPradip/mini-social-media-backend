const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGODB_URL);
    console.log("mongodb connected successfully");
  } catch (error) {
    console.log("mongodb connect failed");
  }
};

module.exports = connectDB