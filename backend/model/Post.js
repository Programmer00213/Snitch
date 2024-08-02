import mongoose from "mongoose"

const Schema = mongoose.Schema

const postSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    like:{
        type:Number,
        default:0,
    },
    comment:{
        type:Number,
        default:0,
    },
    author:{
        type:String,
        default:"Anonymous",
    },
    userId:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        default:"post"
    }
}, {timestamps:true})

export default mongoose.model("Post", postSchema)

