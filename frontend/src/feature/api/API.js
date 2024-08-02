import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../slice/userAuthSlice";

const baseQuery = fetchBaseQuery({ 
    baseUrl: "http://localhost:3000/snitch",
    credentials:'include',
    prepareHeaders:(headers, {getState}) =>{
        const token = getState().userAuth.accessToken
        if(token){
            headers.set('Authorization',`Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions)=>{
    let result = await baseQuery(args, api, extraOptions)
    //console.log(result)

    if(result?.error?.originalStatus === 403){
        console.log("sending refresh token")
        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        console.log(refreshResult)
        if(refreshResult?.data){
            console.log(refreshResult)
            const userName = api.getState().auth?.userName
            api.dispatch(setCredentials({...refreshResult.data}))
            //retry Original Query With New Access TOken
            result = await baseQuery(args, api, extraOptions)
        }
        else{
            api.dispatch(logout())
        }
    }

    return result
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({}),
});