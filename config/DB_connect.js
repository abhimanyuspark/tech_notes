const mongoose = require("mongoose");
const uri = process.env.DB_API_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
