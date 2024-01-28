import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

export const getUserPosts = createAsyncThunk("getUserPosts", async () => {
  try {
    const response = await axios.get("/api/v1/posts/userPosts");
    const posts = response?.data?.data;
    return posts;
  } catch (error) {
    console.log(error)
  }
});

const initialState = {
  userPosts: [],
};
const userPostSlice = createSlice({
  name: "posts",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getUserPosts.fulfilled, (state, action) => {
      state.userPosts = action.payload;
    })
    builder.addCase(getUserPosts.rejected, (state, action) => {
      console.log("Error", action.payload);
    })
  },
  reducers:{
    newPosts:(state, action) => {
      state.userPosts = action.payload
    }
  }
});

export const { newPosts } = userPostSlice.actions;

export default userPostSlice.reducer;
