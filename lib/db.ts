// Complex way to connect MongoDB using Mongoose and caching (for serverless environments)

import mongoose from "mongoose";

// Import MongoDB URI from .env file
// "!" is a non-null assertion (tells the compiler the value won't be undefined)
const MONGODB_URI = process.env.MONGODB_URI!;

// Runtime check: Ensure the MongoDB URI is provided
if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your .env file");
}

// If a database connection already exists, reuse it
// This helps prevent multiple connections during serverless function cold starts
let cached = global.mongoose;

// Initialize global cache if not already present
if (!cached) {
    // `conn` stores the actual database connection
    // This avoids multiple simultaneous connection attempts
    cached = global.mongoose = { conn: null, promise: null };
}

// Function to connect to the database
export async function connectToDatabase() {
    // If a connection already exists, reuse it to avoid reconnection
    if (cached.conn) {
        return cached.conn;
    }

    // Create a new connection (Promise) if one doesn't exist
    if (!cached.promise) {
        const opts = {
            // bufferCommands: queue operations until the connection is established
            bufferCommands: true,
            // maxPoolSize: maximum number of connections in the pool
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
    }

    try {
        // Wait for the connection to complete
        cached.conn = await cached.promise;

        // Log success message once connected
        console.log("✅ Database connected successfully.");
    } catch (error) {
        // Error handling
        cached.promise = null;
        console.error("❌ Failed to connect to the database:", error);
        throw new Error("Check your database connection settings");
    }

    // Return the connected database instance
    return cached.conn;
}


//easiser way to conntect database
// import mongoose from "mongoose";

// interface ConnectionObject {
//     isConnected?: number;
// }

// const connection: ConnectionObject = {};

// export async function dbConnect(): Promise<void> {
//     if (connection.isConnected) {
//         return;
//     }

//     if (!process.env.MONGODB_URI) {
//         throw new Error("Missing MONGODB_URI environment variable");
//     }

//     try {
//         const db = await mongoose.connect(process.env.MONGODB_URI);
//         connection.isConnected = db.connections[0].readyState;
//         console.log("db connected!");
//     } catch (error) {
//         console.error("db connection failed!", error);
//         throw error;
//     }
// }
