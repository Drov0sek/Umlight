import {configureStore} from "@reduxjs/toolkit";
import authControlReducer from '../store/slices/authControlSlice.ts'
import editLessonsReducer from "./slices/editLessonsReducer.ts"

export const store = configureStore({
    reducer : {
        authController : authControlReducer,
        editLessonsReducer: editLessonsReducer
    },
    devTools : true
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch