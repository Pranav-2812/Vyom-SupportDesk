// src/store/features/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  agent: null,
  agentId: null,
  isLoading: false,
  error: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.agent = action.payload.agent;
      state.agentId = action.payload.agentId;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.agent = null;
      state.agentId = null;
    },
    checkLoginStatus: (state) => {
      const agentId = localStorage.getItem('agentId');
      const agent = localStorage.getItem('agent');
      
      if (agentId && agent) {
        state.isLoggedIn = true;
        state.agentId = agentId;
        state.agent = JSON.parse(agent);
      }
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, checkLoginStatus } = authSlice.actions;

export default authSlice.reducer;