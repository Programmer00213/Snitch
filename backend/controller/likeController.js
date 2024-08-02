import mongoose from "mongoose"
import Like from "../model/Like.js"
import Post from "../model/Post.js"
import { Comment, Reply } from "../model/Comment.js"

const Models = {
    Post: Post,
    Comment: Comment,
    Reply: Reply
}

// Like unLike function for Post, Comment, and Reply
const likeAPIController = {
    isLiked: async (req, res) => {
        const filter = {
            targetId: req.params.targetId,
            userId: req.user.userId,
        }
        console.log("From me ", filter)
        const result = await Like.findOne(filter).exec()
        console.log(result)
        if (result != null) return res.status(200).json(true)
        res.json(false)
    },

    like: async (req, res) => {

        const options = {// to stop timestamp to update when Comment count is incremented
            timestamps: false,
            runValidators: true,
        }

        const filter = {
            targetId: req.params.targetId,
            postId: req.body.postId,
            userId: req.user.userId,
        }

        const type = req.body.type;
        console.log(filter)
        const session = await mongoose.startSession();
        session.startTransaction()

        try {
            const result = await Like.findOne(filter).session(session).exec()
            console.log(result)
            if (result === null) {
                await Like.create(
                    [filter],
                    {session}
                )
                await Models[type].updateOne({ _id: filter.targetId }, { $inc: { like: 1 } }, {...options, session})
                await session.commitTransaction()

                console.log("created")
                return res.json("Updated")
            }
            else {
                await Like.deleteOne(filter).session(session)
                await Models[type].updateOne({ _id: filter.targetId }, { $inc: { like: -1 } }, {...options, session})
                await session.commitTransaction()
                console.log("Deleted")
                return res.json("Deleted")

            }
        }
        catch (error) {
            await session.abortTransaction()
            return res.status(500).json("An error occurred");
        } finally {
            await session.endSession()
        }
    }
}

export default likeAPIController