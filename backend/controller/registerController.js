// Here we write the express code to register new user
import bcrypt from "bcryptjs";
import User from "../model/User.js"

const SALT_ROUNDS = 10;

const registerUser = async (req, res) => {
    const userName = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if(userName == '' || email == '') return res.status(400).json("Username and Email are Required")

    try {
        const userExist = await User.findOne({ email: email }).select({ email: 1 }).exec();
        const userNameExist = await User.findOne({ name: userName }).select({ name: 1 }).exec();
       
        if (userExist || userNameExist) {
            
            return res.status(400).json("The User With The Email And Name You Provided Already Exists");
        }
        console.log("not working from here")
        bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
            if (err) {
                return res.status(409).send("Failed To Add User");
            }
            else {
                const result = await User.create({
                    name: userName,
                    email: email,
                    password: hash,
                })
                res.status(201).json("User Added Successfully");
            }
        })

    }
    catch {
        res.status(500).send("Internal Server Error");
    }
}

export default registerUser;