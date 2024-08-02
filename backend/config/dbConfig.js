import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URI);
    }
    catch(error){
        console.log(error)
    }
}

export default connectDB;

//413 Payload Too Large