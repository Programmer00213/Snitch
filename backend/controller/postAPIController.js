import Post from "../model/Post.js";
import { Comment, Reply } from "../model/Comment.js";
import Like from "../model/Like.js";
import mongoose from "mongoose";

const availableType = ['secret', 'declaration', 'confession', 'post'];


const postAPIController = {
    getPost: async (req, res) => {
        try {
            const post = await Post.find({}).sort({ updatedAt: -1 }).limit(100).exec()
            if (!post) return res.status(404).json("Post Not Found")
            res.json(post);
        }
        catch (err) {
            res.sendStatus(400)
        }

    },
    getUserPost: async (req, res) => {
        const filter = {
            userId: req.user.userId,
        }
        if (req.query.id != "all") filter['_id'] = req.query.id
        try {
            const post = await Post.find(filter).sort({ updatedAt: -1 }).limit(100).exec()
            if (!post) return res.status(404).json("Post Not Found")
            res.json(post);
        }
        catch (err) {
            res.sendStatus(400)
        }

    },
    getPostById: async (req, res) => {
        const id = req.params.id;

        try {
            const post = await Post.findById(id).exec()
            if (!post) return res.status(404).json("Post Not Found")
            res.json(post);
        }
        catch (err) {
            res.sendStatus(400)
        }
    },

    getPostByFilter: async (req, res) => {
        const offset = parseInt(req.params.offset) - 1;
        let query = req.query;

        if (Object.keys(query).length === 0) query = { type: 'secret' };

        try {
            const post = await Post.find(query).sort({ updatedAt: -1 }).skip(offset).limit(100);
            res.status(200).json(post);
        }
        catch (err) {
            res.status(400).json("Error")
        }
    },

    addNewPost: async (req, res) => {
        const data = req.body;
        data.userId = req.user.userId;

        if (!availableType.includes(data.type)) {
            return res.send("This Type Is Not Available");
        }
        try {
            await Post.create(data);
            res.status(200).json("Ok");
        }
        catch (err) {
            res.status(500).json("Post Not Created")
        }
    },

    updatePost: async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        console.log(data)
        if (!availableType.includes(data.type)) {
            return res.status(403).send("This Type Is Not Available");
        }
        const options = {
            timestamps: true,
            runValidators: true,
        }
        try {
            const result = await Post.updateOne({ userId: req.user.userId, _id: id }, data, options);
            if (result.matchedCount == 0) return res.sendStatus(403)
            res.status(200).json("Ok");
        }
        catch (err) {
            res.status(500).json("Failed To Update Post")
        }
    },

    deletePost: async (req, res) => {
        const deleteId = req.params.id;

        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const result = await Post.deleteOne({ userId: req.user.userId, _id: deleteId }, {session});
            if (result.deletedCount == 0){
                await session.abortTransaction()
                session.endSession()
                return res.sendStatus(403)
            }

            await Comment.deleteMany({postId:deleteId}, {session})
            await Reply.deleteMany({postId:deleteId}, {session})
            await Like.deleteMany({postId:deleteId}, {session})

            await session.commitTransaction();
            session.endSession()
            res.status(200).json("Ok");
        }
        catch (err) {
            await session.abortTransaction()
            session.endSession()

            res.status(500).json("Failed To Delete Post")
        }
    },
}

export default postAPIController;
