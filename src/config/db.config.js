import mongoose from "mongoose";
import serverConfig from "./serverConfig.js";

export const connectDB= async () => {
    try {
        const conn = await mongoose.connect(serverConfig.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}