import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI not found in .env");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "meme-board", // nombre de la BD dentro del cluster
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
