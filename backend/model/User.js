import mongoose from "mongoose"

const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    roles:{
        User:{
            type:Number,
            default:1000,
        },
        Editor:Number,
        Admin:Number,
    },
    refreshToken:{
        type:String,
        unique:true,
        sparse:true,
    }
}, {timestamps:true})

export default mongoose.model("User", userSchema)