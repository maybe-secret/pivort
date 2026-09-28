import mongoose from "mongoose";
import config from "./index.js";

class DatabaseConfig {
    static async connect() {
        try {
            const options = {
                maxPoolSize: 10, // Maintaine upto 10 socket connections
                serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
                socketTimeoutMs: 45000, // Close sockets after 45 seconds of inactivity
            } 

            await mongoose.connect(config.mongodb.uri, options);
            console.log("MongoDB connected successfully")
        } catch (error) {
            console.error("Failed to connect MongoDB: ", error.message);
            process.exit(1);
        }
    }

    static async disconnect() {
        try {
            await mongoose.disconnect();
            console.log("MongoDB disconnected successfully");
        } catch (error) {
            console.error("Failed to disconnect MongoDB: ", error.message);
        }
    }
}

export default DatabaseConfig;