const mongoose = require('mongoose');
require("dotenv").config();
async function connectDB() {
    try {
      const conn = await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected`);
      return conn
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

module.exports.connectDB = connectDB