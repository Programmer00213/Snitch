import express from "express";
import postAPIController from "../../controller/postAPIController.js";

const router = express.Router();

router.get("/", postAPIController.getPost);

router.get("/user/:name", postAPIController.getUserPost)

router.get("/post/:id", postAPIController.getPostById);

router.get("/:offset/filter", postAPIController.getPostByFilter);

router.post("/new", postAPIController.addNewPost);

router.patch("/:id", postAPIController.updatePost);

router.delete("/:id", postAPIController.deletePost);

export default router;