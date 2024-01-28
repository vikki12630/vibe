import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userPostReducer from "./userPostSlice";
import userFeedReducer from "./userFeedSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: userPostReducer,
    feed: userFeedReducer,
  },
});
