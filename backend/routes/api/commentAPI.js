import express from "express"
import commentAPIController from "../../controller/commentController.js";

const router = express.Router();

router.get("/:postId", commentAPIController.getPostComment);
router.post("/:postId",commentAPIController.addComment)
router.patch("/:postId/:id",commentAPIController.updateComment);
router.delete("/:postId/:id",commentAPIController.deleteComment);
router.post("/reply/:id" , commentAPIController.addReplyComment)

export default router