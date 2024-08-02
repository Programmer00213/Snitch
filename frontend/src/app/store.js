import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../feature/api/API";
import userAuthReducer from "../feature/slice/userAuthSlice";
import commentReducer from "../feature/slice/commentSlice"

// Configure the store
export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        userAuth:userAuthReducer,
        comment:commentReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
});