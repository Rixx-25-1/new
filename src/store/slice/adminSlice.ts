import { createSlice, createAsyncThunk, asyncThunkCreator } from "@reduxjs/toolkit";

import { z } from "zod";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  status: string;
}

interface BookStatus {
  isLoading: boolean;
  error: string | null;
  book: Book[];
  userSearchQuery: string;
  searchedUser: User | null;
  userError: string | null;
}

const initialState: BookStatus = {
  isLoading: false,
  error: null,
  book: [],
  userSearchQuery: "",
  searchedUser: null,
  userError: null,
};

interface User {
  id: number,
  fullName:string
}



//book schema for zod validation
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(3, "ISBN must be at least 10 characters"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  status: z.string(),
});




//fetching the books from the db.json/books
export const fetchBook = createAsyncThunk("admin/fetchBooks", async () => {
  const response = await fetch("http://localhost:3001/books");
  const responseData: Book[] = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  return responseData;
});

//for adding new book
export const addBook = createAsyncThunk(
  "admin/createBook",
  async (newBook: Book, { rejectWithValue }) => {

    const result = bookSchema.safeParse(newBook); //zod validation
    if (!result.success) {
      return rejectWithValue(
        result.error.errors.map((err) => err.message).join(", ")
      );
    }

    const bookData = { ...newBook, id: undefined };
    try {
      const response = await fetch("http://localhost:3001/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) {
        throw new Error("Failed to add book");
      }
      const data: Book = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

//Edit/Update book
export const updateBook = createAsyncThunk ("admin/updateBook",async({bookId, updatedBook}:{bookId:number; updatedBook:Book},{rejectWithValue})=>{
    try{
      console.log("Updating book with ID:", bookId, "Data:", updatedBook);

        const response = await fetch(`http://localhost:3001/books/${bookId}`,
            { 
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBook), 
              }
        )
        console.log("Response Status:", response.status);
        if(!response.ok){
            throw new Error("Failed to edit book");
        }
        return await response.json()
        
    }
    catch(error:any){
      return rejectWithValue(error.message)
    }

})

//for Deleting  book 
export const deleteBook = createAsyncThunk("admin/deleteBook",async(id:number ,{rejectWithValue})=>{
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this book?"
  );
  if (!confirmDelete) return;
  try{
    const response = await fetch(`http://localhost:3001/books/${id}`, {
      method: "DELETE",
    });
    if(!response.ok){
      throw new Error("Failed to delete book")
    }
    return id;
  }
  catch(error:any){
    return rejectWithValue(error.message)

  }
})



// export const searchBook = createAsyncThunk("admin/searchBook",async(query:string,{rejectWithValue})=>{
//   try{
//     const response = await fetch ("http://localhost:3001/user")

//   }
//   catch{

//   }

// })

//for searching book



const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.book = action.payload;
      })
      .addCase(fetchBook.rejected, (state, action) => {
        state.error = action.error.message || "an unknown error occured";
      })
      .addCase(addBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.book.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message as string;
      })
      .addCase(updateBook.pending,(state)=>{
        state.isLoading = true
      })
      .addCase(updateBook.fulfilled,(state,action)=>{
        state.isLoading = false
        const index = state.book.findIndex((book) => book.id === action.payload.id);
        if (index !== -1) {
          state.book[index] = action.payload;
        }
      })
      .addCase(updateBook.rejected,(state,action)=>{
        state.isLoading = false
        state.error = action.error.message as string;
      })
  },
});

export default adminSlice.reducer;
