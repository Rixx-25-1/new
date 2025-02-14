import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { error } from "console";

interface User {
    fullName: string;
    id?: number; 
    email?: string;
    password?: string;
  }
 interface UserState {
    isLoading: boolean;
    error: string | null;
    users: User[];
  }
  const initialState: UserState = {
    isLoading: false,
    error: null,
    users: [],
  };

//fetching and displaying the user
export const fetchUsers = createAsyncThunk("apidata", async () => {
  const response = await fetch("http://localhost:3001/user");
  const responsedata  : User[] = await response.json()
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return responsedata;
});


//Creating user 
export const createUser = createAsyncThunk("api/createUSer",async(newUser:User,{rejectWithValue})=>{
  try{
    const response = await fetch("http://localhost:3001/user",{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify(newUser),
    });
    if(!response.ok){
      throw new Error("Failed to create User");
    }
    return await response.json();
    
  }
  catch(error:any){
    return rejectWithValue(error.message)
  }

});

//update user 

export const updateUser = createAsyncThunk(
  "api/updateUser",
  async (user: User) => {
    const response = await fetch(`http://localhost:3001/user/${user.id}`, {
     
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return await response.json();
  }
);



  
const apiSlice = createSlice({
    name:"api",
    initialState,
    reducers:{
        clearError: (state) => {
            state.error = null;
          },
    },
    extraReducers:(builder) =>{
        builder.addCase(fetchUsers.pending , (state)=>{
            state.isLoading = true
        })
        .addCase(fetchUsers.fulfilled, (state,action)=>{
            state.isLoading = false
            state.users = action.payload
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || "An unknown error occurred";   
        })

        .addCase(createUser.pending, (state)=>{
          state.isLoading = true
        })
        .addCase(createUser.fulfilled, (state,action)=>{
          state.isLoading = false
          state.users.push(action.payload);
        })
        .addCase(createUser.rejected, (state,action)=>{
          state.isLoading = false
          state.error = action.payload as string
        })

        .addCase(updateUser.pending, (state)=>{
          state.isLoading = true
        })
        .addCase(updateUser.fulfilled , (state,action)=>{
          state.isLoading = false
          const updateUser = action.payload
          state.users = state.users.map((user)=>
          user.id ===updateUser.id ? updateUser : user
        )
        })
        .addCase(updateUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || "Failed to update user";
        });
        
    }
})

export default apiSlice.reducer;

export const { clearError } = apiSlice.actions;
//createAsyncThunk is reponsible to handle the api-integration and main used for handle the async related work or handling the promises
