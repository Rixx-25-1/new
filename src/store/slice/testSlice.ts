import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define the user type
interface User {
  id: number;
  fullName: string;
}

// Define the initial state
interface UserSearchState {
  userSearchQuery: string;
  searchedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserSearchState = {
  userSearchQuery: "",
  searchedUser: null,
  loading: false,
  error: null,
};

// Async thunk to fetch users from API
export const fetchUserByQuery = createAsyncThunk(
  "userSearch/fetchUserByQuery",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/user");
      const users: User[] = await response.json(); 
      
      const foundUser = users.find((user) =>
        user.fullName.toLowerCase().includes(query.toLowerCase())
      );

      return foundUser || null; // Return found user or null if no match
    } catch (error) {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

const userSearchSlice = createSlice({
  name: "userSearch",
  initialState,
  reducers: {
    setUserSearchQuery: (state, action: PayloadAction<string>) => {
      state.userSearchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.userSearchQuery = "";
      state.searchedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserByQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByQuery.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.loading = false;
        state.searchedUser = action.payload;
      })
      .addCase(fetchUserByQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUserSearchQuery, clearSearch } = userSearchSlice.actions;
export default userSearchSlice.reducer;
