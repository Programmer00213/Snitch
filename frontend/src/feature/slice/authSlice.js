import credentials from "../../../../backend/middleware/credentials";
import { authApi } from "../api/API";

const extendedAuthApi = authApi.injectEndpoints({
    endpoints:(builder)=>({
        login:builder.mutation({
            query: credentials => ({
                url:"/login/",
                method:"POST",
                body:{...credentials},
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }),
        register:builder.mutation({
            query:credentials => ({
                url:"/register/",
                method:"POST",
                body:{...credentials},
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        })
    })
})

export const {useLoginMutation, useRegisterMutation} = extendedAuthApi