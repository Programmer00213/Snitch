import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
    userName: '',
    activityStatus:"idle",
    statusMessage:'',
}


const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers:{
        setCredentials:(state, action)=>{
            state.accessToken = action.payload.accessToken;
            state.userName = action.payload.userName;
        },
        setActivityStatus:(state, action) => {
            state.activityStatus = action.payload.status
            state.statusMessage = action.payload.message
        },
        logout:(state)=>{
            state.accessToken = null;
            state.userName = '';
        },
    },
})

export const selectAccessToken = (state) => state.userAuth.accessToken;
export const selectUserName = (state) => state.userAuth.userName;
export const selectActivityStatus = (state) => state.userAuth.activityStatus;
export const selectStatusMessage = (state) => state.userAuth.statusMessage;

export const {setCredentials, logout, setActivityStatus} = userAuthSlice.actions
export default userAuthSlice.reducer