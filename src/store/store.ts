
import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "./slice/userSlice";
import forgetPasswordReducer from "./slice/forgetPasswordSlice"
import issueBookReducer from "./slice/issuebookSlice"
import signupReducer from "./slice/signupSlice"
import validateUserReducer from "./slice/validateSlice"
import adminSliceReducer from "./slice/adminSlice"


export const store = configureStore({
    reducer:{
        api:apiReducer,
        forgetPasswordSlice:forgetPasswordReducer,
        issueBook :issueBookReducer,
        signupSlice:signupReducer,
        validateUserSlice:validateUserReducer,
        adminSlice:adminSliceReducer

    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;