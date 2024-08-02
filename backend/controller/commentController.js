import { Comment, Reply } from "../model/Comment.js"
import Post from "../model/Post.js"

const Update = async (filter, comment, res, Model) => {

    const options = {
        timestamps: true,
        runValidators: true,
    }

    try {
        const result = await Model.updateOne(filter, { comment: comment }, options)
        if (result.acknowledged == false) res.status(401).json("UnAuthorized")
        res.status(200).json("Reply Added")
    }
    catch (err) {
        res.status(500).json("Failed To Update Comment")
    }
}

const Delete = async (filter, res, isNotReply, parentId) => {
    const { id:_id, ...Many } = filter // destructuring for removing Id, so that we can delete many Reply

    const options = {// to stop timestamp to update when Comment count is incremented
        timestamps: false,
        runValidators: true,
    }

    const Model = isNotReply === 'true' ? Comment : Reply;
    try{
        let result = await Model.deleteOne(filter)
        console.log(result)
      
        if (isNotReply === 'true'){
            await Post.updateOne({ _id: filter.postId }, { $inc: { comment: -1 } }, options)
            result = await Reply.deleteMany(Many)
        }
        else if(isNotReply === 'false'){
            console.log("Working inside")
            console.log(filter.parentId)
            await Comment.updateOne({ _id: parentId }, { $inc: { reply: -1 } }, options)
        }
        console.log("double working", result)
        if (result.acknowledged != true) return res.sendStatus(403)
        console.log("Hey Hey Hey Brother what are you writing")
        res.status(200).json("Deleted SuccessFully");
    
    }
    catch(error){
        console.log("Hey")
        res.status(500).json("Failed To Delete")
    };
}

const commentAPIController = {
    getPostComment: async (req, res) => {
        const postId = req.params.postId;
        const parentId = req.query.parentId;

        let comments;
        if (parentId != undefined) { //if we have parentId then retrieve Reply
            comments = await Reply.find({ postId: postId, parentId: parentId }).sort({ updatedAt: -1 }).exec()
        }
        else comments = await Comment.find({ postId: postId }).sort({ updatedAt: -1 }).exec();

        if (!comments) return res.send(400).json("Comment Not Found :(")
    
        res.send(comments)
    },
    addComment: async (req, res) => {

        const data = {
            userId: req.user.userId,
            postId: req.params.postId,
            comment: req.body.comment,
            author: req.user.userName,
        }
        const options = {
            timestamps: false,
            runValidators: true,
        }

        await Comment.create(data).then(async () => {
            await Post.updateOne({ _id: data.postId }, { $inc: { comment: 1 } }, options)
            res.status(200).json("Ok");
        }).catch((err) => {
            res.status(500).json("Failed To Comment")
        })
    },

    addReplyComment: async (req, res) => {

        const commentId = req.params.id;

        let result = await Reply.findOne({ _id: commentId }).exec() //Check if id sent id of Reply or Main/Parent Comment
        if (!result) result = await Comment.findOne({ _id: commentId }).exec()
        if (!result) return res.status(400).json("The Comment Does Not Exist")

        const data = {
            userId: req.user.userId,
            postId: result.postId,
            comment: req.body.reply,
            author: req.user.userName,
            replyTo: `@${result.author}`,
            parentId: result?.parentId ? result.parentId : result['_id'], // Get the Main/Parent Comment Id
        }
      
        const options = {// to stop timestamp to update when Comment count is incremented
            timestamps: false,
            runValidators: true,
        }
        try {
            await Reply.create(data);
            await Comment.updateOne({ _id: data.parentId }, { $inc: { reply: 1 } }, options)
            res.status(200).json("Reply Added")
        }
        catch (err) {
            res.status(500).json("Failed To Update Comment")
        }
    },
    updateComment: async (req, res) => {
        //console.log("I am getting a request")
        const isNotReply = req.query.isNotReply
        const filter = {
            userId: req.user.userId,
            postId: req.params.postId,
            _id: req.params.id,
        }
        const comment = req.body.comment;
        isNotReply == true ? await Update(filter, comment, res, Comment) : await Update(filter, comment, res, Reply)

    },
    deleteComment: async (req, res) => {
        const isNotReply = req.query.isNotReply
        const parentId = req.body.parentId
        
        const filter = {
            userId: req.user.userId,
            postId: req.params.postId,
            _id: req.params.id,
        }
        console.log("delete Request ",filter, isNotReply, parentId)
        await Delete(filter, res, isNotReply, parentId)
    }
}

export default commentAPIController