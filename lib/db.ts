import mongoose from "mongoose";

// import mongodb_uri form .env file
//" ! " is a not null assertion(tell the compiler the value wont be undefined)
const MONGODB_URI = process.env.MONGODB_URI!;


//run time checking if the mongodb uri is present or not
if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your .env file");
}

//if the database is alredy connected reuse the connectin
// helps to prevent muntiple connections during serverless function cold starts 
let cached = global.mongoose;


// initialize global cash if not present
if (!cached) {
    //conn store the actual database connection
    //to avoide muntiple simultaneus connection attemps
    cached = global.mongoose = { conn: null, promise: null };
}


//function to connect databse
export async function connectToDatabase() {
    //if a connection is alredy existing reusing that connecton to avoide reconnection
    if (cached.conn) {
        return cached.conn;
    }

    //create a new connection(promise) if database connection doesn't exists 
    if (!cached.promise) {
        const opts = {
            // bufferCommand : - queue operations untill the connecton is made
            bufferCommands: true,
            //: - maximum number of connection in the pool 
            maxPoolSize: 10,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
    }

    try {
        //waiting for connection to complete 
        cached.conn = await cached.promise;
    } catch (error) {
        //error handeling
        cached.promise = null;
        throw new Error("Check your database connection settings");
    }

    // retrun database connection or retrun the succesfully connected database instance
    return cached.conn;
}
