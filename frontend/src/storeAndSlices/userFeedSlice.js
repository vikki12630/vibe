import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userFeed: [],
  isLoading: true,
};
const userFeedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    userFeedPosts: (state, action) => {
      state.userFeed = action.payload,
      state.isLoading = false
    },
  },
});

export const { userFeedPosts } = userFeedSlice.actions;

export default userFeedSlice.reducer;
