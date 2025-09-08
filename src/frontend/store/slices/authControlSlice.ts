import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export type AuthState = {
    isOnline : boolean,
    userLogin : string
}
const initialState : AuthState = {
    isOnline : false,
    userLogin : ''
}
export type UserDataType = {
    userLogin : string
}
export const AuthControlSlice = createSlice({
    name : 'authController',
    initialState,
    reducers : {
        signIn : (state,{payload} : PayloadAction<UserDataType>) => {
            state.isOnline = true
            state.userLogin = payload.userLogin
            console.log('fd')

        },
        exit : (state) => {
            state.isOnline = false
            state.userLogin = ''
        }
    }
})

export const {signIn, exit} = AuthControlSlice.actions

export default AuthControlSlice.reducer