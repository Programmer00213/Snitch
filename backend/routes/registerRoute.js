// Here we define our register route
import express from "express"
import registerUser from "../controller/registerController.js"

const router = express.Router()

router.post("/",registerUser)

export default router

