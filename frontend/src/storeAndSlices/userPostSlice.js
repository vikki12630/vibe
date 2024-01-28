import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import conf from "../conf/conf";

export const getUserPosts = createAsyncThunk("getUserPosts", async () => {
  try {
    const config = {
      withCredentials: true,
    };
    const response = await axios.get(
      `${conf.backendUrl}/api/v1/posts/userPosts`,
      config
    );
    const posts = response?.data?.data;
    return posts;
  } catch (error) {
    console.log(error);
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
    });
    builder.addCase(getUserPosts.rejected, (state, action) => {
      console.log("Error", action.payload);
    });
  },
  reducers: {
    newPosts: (state, action) => {
      state.userPosts = action.payload;
    },
  },
});

export const { newPosts } = userPostSlice.actions;

export default userPostSlice.reducer;
