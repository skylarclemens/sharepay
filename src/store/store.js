import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slices/userSlice';

const preloadedState = localStorage.getItem("localState") ? JSON.parse(localStorage.getItem("localState")) : {};

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  preloadedState
});

store.subscribe(() => {
  localStorage.setItem("localState", JSON.stringify(store.getState()));
});