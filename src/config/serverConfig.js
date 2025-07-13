import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT || 3900,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/collabboard",
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d"
}