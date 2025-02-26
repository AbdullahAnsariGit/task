const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {}).then(() => {
      console.log("Db Connected!");
    });
  } catch (err) {
    console.log("Getting error when connecting DB - File config > db.js", err);
  }
};

module.exports = connectDB;
