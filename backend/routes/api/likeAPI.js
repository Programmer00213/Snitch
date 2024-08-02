import express from "express"
import likeAPIController from "../../controller/likeController.js"

const router = express.Router();

router.post("/:targetId",likeAPIController.like)
router.get("/:targetId", likeAPIController.isLiked)

export default router
