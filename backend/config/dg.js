import mongoose from "mongoose";

//create database connection
const connectDB = async ()=>{
    if(!process.env.MONGO_URL){
        console.error("MONGO_URL is not defined in .env file");
        process.exit(1);
    }
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;