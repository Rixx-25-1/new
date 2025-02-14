import {
  createSlice,
  createAsyncThunk,
  asyncThunkCreator,
  PayloadAction,
} from "@reduxjs/toolkit";

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
  usersSearchQuery: string;
  searchedUsers: User | null;
}

const initialState: BookStatus = {
  isLoading: false,
  error: null,
  book: [],
  usersSearchQuery: "",
  searchedUsers: null,
};

interface User {
  id: number;
  fullName: string;
}

//book schema for zod validation
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(1, "ISBN must be at least 10 characters"),
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
export const updateBook = createAsyncThunk(
  "admin/updateBook",
  async (
    { bookId, updatedBook }: { bookId: number; updatedBook: Book },
    { rejectWithValue }
  ) => {
    try {
      console.log("Updating book with ID:", bookId, "Data:", updatedBook);

      const response = await fetch(`http://localhost:3001/books/${bookId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });
      console.log("Response Status:", response.status);
      if (!response.ok) {
        throw new Error("Failed to edit book");
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

//for Deleting  book
export const deleteBook = createAsyncThunk(
  "admin/deleteBook",
  async (id: number, { rejectWithValue }) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(`http://localhost:3001/books/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete book");
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Search user for the issue-book
export const searchBook = createAsyncThunk(
  "admin/searchBook",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/user");
      if (!response.ok) {
        throw new Error("failed to fetch user");
      }
      const user: User[] = await response.json();
      const foundUser = user.find((user) =>
        user.fullName.toLowerCase().includes(query.toLowerCase())
      );
      console.log(foundUser);
      return foundUser || null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

//issue-book
export const issueBook = createAsyncThunk(
  "admin/issueBook",
  async (
    issueDetails: {
      bookName: string;
      ISBN: string;
      issueDate: string;
      dueDate: string;
    },
    { rejectWithValue, getState, dispatch }
  ) => {
    const state: any = getState();
    const searchedUsers = state.adminSlice.searchedUsers;
    const books = state.adminSlice.book;
    if (!searchedUsers) {
      return rejectWithValue("You have to create an account first!");
    }
    const bookToIssue = books.find(
      (book: Book) => book.isbn === issueDetails.ISBN
    );

    if (!bookToIssue) {
      return rejectWithValue("Book not find");
    }

    if (bookToIssue.quantity <= 0) {
      return rejectWithValue("Book out of stock");
    }

    const issueData = {
      userId: searchedUsers.id,
      userName: searchedUsers.fullName,
      bookName: issueDetails.bookName,
      ISBN: issueDetails.ISBN,
      issueDate: issueDetails.issueDate,
      dueDate: issueDetails.dueDate,
    };

    try {
      const response = await fetch("http://localhost:3001/issue-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueData),
      });
      if (!response.ok) {
        throw new Error("Failed to issue book");
      }
      const updatedQuantity = bookToIssue.quantity - 1;
      await fetch(`http://localhost:3001/books/${bookToIssue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookToIssue, quantity: updatedQuantity }),
      });
      dispatch(fetchBook());
      return issueData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {
    resetSearchedUser: (state) => {
      state.searchedUsers = null;
    },
  },
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
      .addCase(updateBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.book.findIndex(
          (book) => book.id === action.payload.id
        );
        if (index !== -1) {
          state.book[index] = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message as string;
      })
      .addCase(searchBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchedUsers = action.payload;
      })
      .addCase(searchBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error as string;
      })
      .addCase(issueBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(issueBook.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(issueBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBook.pending,(state)=>{
        state.isLoading = true
      })
      .addCase(deleteBook.fulfilled, (state,action)=>{
        state.isLoading = false
        state.book = state.book.filter(book => book.id !== action.payload);
      })
      .addCase(deleteBook.rejected,(state,action)=>{
        state.isLoading=false
        state.error = action.error as string
      })
  },
});

export default adminSlice.reducer;
