import allowedOrigins from "./allowedOrigins.js"

export const corsOption = {
    origin:(origin, callback)=>{
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }
        else{
            callback(new Error("Not Allowed By CORS"))
        }
    },
    optionSucessStatus:200,
}

export default corsOption
