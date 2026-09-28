import app from "./app.js";
import DatabaseConfig from "./config/database.js"
import config from "./config/index.js";

let server;

const startServer = async () => {
    try {
        await DatabaseConfig.connect();
        
        server = app.listen(config.port, () => {
            console.log(`Server is runnting on port: http://localhost:${config.port}`);
        });
    } catch (error) {
        console.log("Server failed to start: ", error.message);
        process.exit(1); 
    }
}

// created this to follow the server shutdown format closeServer -> disconnectDb -> exit
const closeServer = () => {
    return new Promise((resolve, reject) => {
        server.close(error => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        })
    })
}

const shutdownServer = async (signal) => {
    console.log(`\n${signal} received. Shutting down server...`);

    try {
        // Stop accepting HTTP requests
        if (server) {
            await closeServer(); 
            console.log("HTTP server closed.");
        } 

        await DatabaseConfig.disconnect();

        console.log("Database connection closed.");
        console.log("Server shutdown complete.");

        process.exit(0);
    } catch (error) {
        console.error("Error during shutdown: ", error.message);
        process.exit(1); 
    }
}

// Handle "ctrl + c"
process.on("SIGINT", () => {
    shutdownServer("SIGINT");
});

// Handle process termination [for container]
process.on("SIGTERM", () => {
    shutdownServer("SIGTERM");
})

startServer();