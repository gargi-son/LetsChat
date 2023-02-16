const mongoose = require("mongoose");

//accessing the .env variables by using process.env
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected : ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
