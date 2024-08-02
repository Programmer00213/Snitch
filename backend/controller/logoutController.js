import User from "../model/User.js";

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    //console.log(cookies)
    if(!cookies?.jwt)return res.sendStatus(204);
    const refreshToken = cookies.jwt
    const user = await User.findOne({refreshToken:refreshToken}).select({_id:1}).exec()
    if(!user){
        res.clearCookie('jwt',{httpOnly:true, sameSite:'None', secure:true})
        return res.sendStatus(204)
    }

    const options = {
        runValidators:true,
    }
    
    const result = await User.updateOne({_id:user.id},{$unset:{refreshToken:""}}, options)
    
    if(!result.acknowledged) return res.sendStatus(500);
    res.clearCookie('jwt',{httpOnly:true, sameSite:'None', secure:true})
    res.sendStatus(204)
}

export default handleLogout