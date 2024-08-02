import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../model/User.js";

const userLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password)
    try {
        const user = await User.findOne({email:email}).select({_id:1, name:1, password:1}).exec();
        //console.log("login 123sdfsadfsa", user)
        if(user == null) return res.status(404).json("User Not Found")

        bcrypt.compare(password, user.password, async (err, valid) => {
            if (err) {
                res.status(401).json("Authentication Failed")
            }
            else if (valid) {
                const payload = {
                    userName:user.name,
                    userId:user.id,
                }
                const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'5m'});
                const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'1d'});

                const options = {
                    runValidators:true,
                }

                const result = await User.updateOne({_id:user.id},{refreshToken:refreshToken},options)

                if(!result.acknowledged) return res.status(500).json("Request Failed")

                res.cookie('jwt', refreshToken, {httpOnly:true, sameSite:'None', secure:true ,maxAge:24*60*60*1000});
                res.json({accessToken:accessToken, userName:user.name});
            }
            else{
                res.status(401).json("You are not Authorized");
            }
        })
    }
    catch{
        res.status(500).status("Internal Server Error")
    }
}

export default userLogin
