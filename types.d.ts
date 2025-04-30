// Import the 'Connection' type from Mongoose.
// This will help us specify the type of the MongoDB connection we are caching.
import { Connection } from "mongoose";


// 'declare global' is a special TypeScript block that allows us to add or extend global variables.
// In this case, we are telling TypeScript that we want to add a custom global variable named 'mongoose'.
declare global {
    
    // Declare a global variable named 'mongoose'.
    // It will hold an object with two properties:
    var mongoose: {
        // 'conn' will store the actual database connection when it's established.
        // It can either be a Mongoose 'Connection' object or 'null' (if not yet connected).
        conn: Connection | null;

        // 'promise' will store the promise returned by the 'mongoose.connect()' function.
        // This is useful for avoiding multiple simultaneous connection attempts.
        // Like 'conn', it can be either a 'Promise<Connection>' or 'null'.
        promise: Promise<Connection> | null;
    }
}


// This 'export {}' statement is needed to make this file a module.
// Without it, TypeScript would treat this file as a global script,
// which could cause issues with scope and type declarations.
export {}
