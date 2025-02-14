import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


interface SignUpFormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }

  interface Signup {
    isLoading : boolean;
    error : string | null;
    users : SignUpFormData[]
    emailStatus : string | null
  }

  const initialState : Signup = {
    isLoading :  false,
    error: null, 
    users :[],
    emailStatus : null
  }


export const createUser = createAsyncThunk("api/signUp", async(payload:SignUpFormData , {rejectWithValue})=>{
  try{
    const response = await fetch('http://localhost:3001/user',{
        method:"POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify(payload),
    })
    if(!response.ok){
        throw new Error ('Failed to sign up!')
    }
    return await response.json()
  }
  catch{
    return rejectWithValue( "Unexpected error");
  }

})


export const checkUniqueEmail = createAsyncThunk("signUp/checkUniqueEmail",async(email:string, {rejectWithValue})=>{
    try{
        const response = await fetch ("http://localhost:3001/user")
        if(!response.ok){
            throw new Error('failed to fetch users !')
        }

        const users = await response.json()
        const isEamilTaken = users.some((user: SignUpFormData) => user.email === email)
        if(isEamilTaken){
           return rejectWithValue ("Email is already registered, Try again with different one")
        }
        return " Email is available"

    }
    catch(error:any){
        return rejectWithValue(error.message)

    }

})

const signupSlice = createSlice({
    name:"signupSlice",
    initialState,
    reducers: {

    },
    extraReducers:(builder)=>{
        builder.addCase(createUser.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(createUser.fulfilled, (state,action)=>{
            state.isLoading = false
            state.users.push(action.payload)
            state.emailStatus = null;
          
        })
        .addCase(createUser.rejected,(state,action)=>{
            state.isLoading = false
            state.error = action.error.message || "An unknown error occurred";   
        })
        .addCase(checkUniqueEmail.pending,(state,action)=>{
            state.isLoading = true
        })
        .addCase(checkUniqueEmail.fulfilled,(state,action)=>{
            state.isLoading = false
            state.emailStatus = action.payload
        })
        .addCase(checkUniqueEmail.rejected,(state,action)=>{
            state.isLoading = false
            state.emailStatus = null
            state.error = action.payload as string || "Unknown error occurred";
        })
    }

})

export default signupSlice.reducer