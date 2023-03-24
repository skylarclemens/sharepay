import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slices/userSlice';
import expenseReducer from '../slices/expenseSlice';
import friendReducer from '../slices/friendSlice';

const preloadedState = localStorage.getItem("localState") ? JSON.parse(localStorage.getItem("localState")) : {};

export const store = configureStore({
  reducer: {
    user: userReducer,
    expenses: expenseReducer,
    friends: friendReducer
  },
  preloadedState
});

store.subscribe(() => {
  localStorage.setItem("localState", JSON.stringify(store.getState()));
});