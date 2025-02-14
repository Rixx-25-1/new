import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
interface User {
    fullName: string;
    id?: number; 
    email?: string;
    password?: string;
  }
 interface UserState {
    isLoading: boolean;
    error: string | null;
    successMessage : string | null
  }
  const initialState: UserState = {
    isLoading: false,
    error: null,
    successMessage: null
   
  };


  export const updatePassword = createAsyncThunk(
    "api/updatePassword",
    async ({ email, newPassword }: { email: string; newPassword: string }) => {
      // Fetch all users
      const response = await fetch("http://localhost:3001/user");
      const users = await response.json();
  
      const userIndex = users.findIndex((user: User) => user.email === email);
  
      if (userIndex === -1) {
        throw new Error("User not found"); 
      }
  
      users[userIndex].password = newPassword;
  
      // Update the user on the server
      await fetch(`http://localhost:3001/user/${users[userIndex].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users[userIndex]),
      });
  
      return users[userIndex];
    }
  );

const forgetPasswordSlice = createSlice ({
    name: 'forgetPasswordSlice',
    initialState,
    reducers :{},
    extraReducers:(builder) =>{
        builder
        .addCase(updatePassword.pending,(state)=>{
            state.isLoading = true
            state.error = null;
        state.successMessage = null;
        })
        .addCase(updatePassword.fulfilled,(state,action)=>{
            state.isLoading = false
            state.successMessage = "Password updated successfully"
        })
        .addCase(updatePassword.rejected, (state,action)=>{
            state.isLoading = false
            state.successMessage = action.error.message ||  "Failed to update passwprd"
        })
    }
})


export default forgetPasswordSlice.reducer

