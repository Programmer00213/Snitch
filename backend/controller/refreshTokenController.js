import jwt from "jsonwebtoken"
import User from "../model/User.js"

const handleRefreshToken = async(req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401);
    //console.log(cookies.jwt);
    const refreshToken = cookies.jwt

    const user = await User.findOne({refreshToken:refreshToken}).select({_id:1, name:1}).exec();
    if(!user) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
        if(err || user.id !== decoded.userId || user.name !== decoded.userName) return res.sendStatus(403);
        // everything good create access token
        const payload = {
            userName:user.name,
            userId:user.id,
        }
        const accessToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'5m'}); // 15s
        res.json({accessToken:accessToken, userName:user.name})
    })
}

export default handleRefreshToken