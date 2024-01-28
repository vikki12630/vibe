import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  userFeed: [],
};
const userFeedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    userFeedPosts: (state, action) => {
      state.userFeed = action.payload
    },
  },
});

export const { userFeedPosts } = userFeedSlice.actions;

export default userFeedSlice.reducer;
