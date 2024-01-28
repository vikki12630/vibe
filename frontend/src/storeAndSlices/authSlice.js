import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  currentUser: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true
    },
    currentUser: (state, action) => {
      state.isAuthenticated = true, 
      state.currentUser = action.payload
    },
    logout: (state, action) => {
      state.isAuthenticated = false, 
      state.currentUser = null
    },
  }
})

export const { login, currentUser, logout } = authSlice.actions;

export default authSlice.reducer;