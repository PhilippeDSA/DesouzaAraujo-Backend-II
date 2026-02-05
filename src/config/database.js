import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL;

    console.log("MONGO_URL:", MONGO_URL);

    await mongoose.connect(MONGO_URL);
    console.log("Mongo conectado");
  } catch (error) {
    console.error("Error conectando a Mongo:", error.message);
    process.exit(1);
  }
};
