import {configureStore} from "@reduxjs/toolkit";
import authControlReducer from '../store/slices/authControlSlice.ts'

export const store = configureStore({
    reducer : {
        authController : authControlReducer,
    },
    devTools : true
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch