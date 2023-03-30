import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slices/userSlice';
import expenseReducer from '../slices/expenseSlice';
import friendReducer from '../slices/friendSlice';
import debtReducer from '../slices/debtSlice';

const preloadedState = localStorage.getItem("localState") ? JSON.parse(localStorage.getItem("localState")) : {};

export const store = configureStore({
  reducer: {
    user: userReducer,
    expenses: expenseReducer,
    debt: debtReducer,
    friends: friendReducer
  },
  preloadedState
});

store.subscribe(() => {
  localStorage.setItem("localState", JSON.stringify(store.getState()));
});