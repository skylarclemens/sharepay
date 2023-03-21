import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slices/userSlice';
import expenseReducer from '../slices/expenseSlice';

const preloadedState = localStorage.getItem("localState") ? JSON.parse(localStorage.getItem("localState")) : {};

export const store = configureStore({
  reducer: {
    user: userReducer,
    expenses: expenseReducer
  },
  preloadedState
});

store.subscribe(() => {
  localStorage.setItem("localState", JSON.stringify(store.getState()));
});