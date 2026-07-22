const mongoose = require("mongoose");

async function connectMongo() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) return false;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed; using file storage instead.");
    console.warn(error.message);
    return false;
  }
}

module.exports = { connectMongo };
