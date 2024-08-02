import mongoose from "mongoose"

const Schema = mongoose.Schema

const replySchema = new Schema({
    postId:{
        type:String,
        required:true,
    },
    parentId:{
        type:String,
        required:true,
    },
    replyTo:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        default:"Anonymous"
    },
    userId:{
        type:String,
        required:true,
    },
    like:{
        type:Number,
        default:0,
    },
},{timestamps:true})

const commentSchema = new Schema({
    postId:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        default:"Anonymous"
    },
    userId:{
        type:String,
        required:true,
    },
    like:{
        type:Number,
        default:0,
    },
    reply:{
        type:Number,
        default:0,
    }
},{timestamps:true})

export const Comment =  mongoose.model("Comment",commentSchema);
export const Reply = mongoose.model("Reply",replySchema);