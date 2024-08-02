import express from "express";
import userLogin from "../controller/loginController.js";

const router = express.Router();

router.post("/",userLogin);

export default router;