// main file where code from others files are compiled
import dotenv from "dotenv"
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import verifyJWT from "./middleware/verifyJWT.js";
import corsOption from "./config/corsConfig.js";
import cookieParser from "cookie-parser";
import credentials from "./middleware/credentials.js";
import mongoose from "mongoose";
import connectDB from "./config/dbConfig.js";

import postAPIRouter from "./routes/api/postAPI.js";
import registerRouter from "./routes/registerRoute.js";
import loginRouter from "./routes/loginRoute.js";
import refreshRouter from "./routes/refreshRoute.js";
import logoutRouter from "./routes/logoutRouter.js";
import commentRouter from "./routes/api/commentAPI.js"
import likeRouter from "./routes/api/likeAPI.js"

connectDB();

dotenv.config()

const app = express();
const port = 3000;

app.use(credentials);
app.use(cors(corsOption));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/snitch/register",registerRouter);
app.use("/snitch/login",loginRouter);
app.use("/snitch/refresh",refreshRouter);
app.use("/snitch/logout",logoutRouter);

app.use(verifyJWT);
app.use("/snitch/post",postAPIRouter);
app.use("/snitch/comment",commentRouter)
app.use("/snitch/like",likeRouter)

mongoose.connection.once('open',()=>{
    console.log("Connected to MongoDB database");
    app.listen(port, () => {
        console.log("The server is running in port " + port);
    })
})