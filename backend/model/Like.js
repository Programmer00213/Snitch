import mongoose from "mongoose";

const Schema = mongoose.Schema;

const likeSchema = new Schema({
    targetId:{
        type:String,
        required:true,
    },
    postId:{
        type:String, 
        required:true,
    }
    ,
    userId:{
        type:String,
        required:true,
    }
})

export default mongoose.model("Like", likeSchema)