import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { truncate } from "fs";


interface userState {
    isLoading : boolean;
    error : string | null;
    users: any| null;
    admin:any|null
}

const initialState : userState={
    isLoading : false,
    error:null,
    users:null,
    admin:null

}

 export const validateUsers = createAsyncThunk("user/valiateUser", async({email,password}:{email:string,password:string}, {rejectWithValue})=>{
    try{
        const response = await fetch(`http://localhost:3001/user?email=${email}`)
        if(!response.ok){
            return rejectWithValue("Server Error . please try again later")
        }

        const users= await response.json()
        const user = users.find((u: any) => u.password === password );
        return user? user : rejectWithValue("Invalid email or Password")
    }
    catch (error) {
        rejectWithValue("Server Error . Please try again later")
      }

 })


 export const validateAdminn = createAsyncThunk("admin/validateAdmin",async({email,password}:{email:string, password:string},{rejectWithValue})=>{
    try{
        const response = await fetch(`http://localhost:3001/admin?email=${email}`)
        if(!response.ok){
            return rejectWithValue("Server Error . Please try again later")
        }
        const admin = await response.json()
        const adminData = admin.find((a:any)=>a.password ===password);
        return adminData?adminData : rejectWithValue("Invalid email or password")
    }
    catch(error){
        rejectWithValue("server error . please try again later")
    }
 })



 export const validateUserSlice = createSlice({
    name: 'validateUser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(validateUsers.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(validateUsers.fulfilled, (state, action) => {
          state.isLoading = false;
          state.users = action.payload;
        })
        .addCase(validateUsers.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        })
        .addCase(validateAdminn.pending,(state)=>{
            state.isLoading= true
            state.error = null
        })
        .addCase(validateAdminn.fulfilled,(state,action)=>{
            state.isLoading= false
            state.admin = action.payload
    })
        .addCase(validateAdminn.rejected,(state,action)=>{
            state.isLoading = false
            state.error = action.payload as string        })
    },
  });

  export default validateUserSlice.reducer;


