import { createSlice, createAsyncThunk, asyncThunkCreator } from "@reduxjs/toolkit";
import { buildCreateApi } from "@reduxjs/toolkit/query";


interface IssuedBook { 
    id: number;
    bookName: string;
    ISBN: string;
    userName: string;
    email: string;
    issueDate: string;
    dueDate: string;
  }

  interface IssueBookState {
    isLoading: boolean;
    error: string | null;
    books: IssuedBook[];
  }

  const initialState : IssueBookState={
    isLoading : false,
    error : null,
    books:[]

  }


//fetching the issue-book data 
export const fetchBooks = createAsyncThunk("api/issue-book" , async()=>{
    const response = await fetch("http://localhost:3001/issue-book")
    const responseData : IssuedBook[] = await response.json()
    if(!response.ok){
        throw new Error("Failed to fetch issued-books")
    }
    return responseData
})


const issueBookSlice = createSlice({
    name:"issueBook",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchBooks.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(fetchBooks.fulfilled, (state,action)=>{
            state.isLoading = false
            state.books = action.payload
            console.log(action.payload);
            
        })
        .addCase(fetchBooks.rejected , (state, action)=>{
            state.isLoading = false
            state.error = action.error.message || "an unknown error occured"
        })
    }
})

export default issueBookSlice.reducer



