import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from '../slices/userSlice';
import accountReducer from "../slices/accountSlice";
import expenseReducer from '../slices/expenseSlice';
import friendReducer from '../slices/friendSlice';
import debtReducer from '../slices/debtSlice';
import groupReducer from '../slices/groupSlice';

const preloadedState = localStorage.getItem("localState") ? JSON.parse(localStorage.getItem("localState")) : {};

const combinedReducer = combineReducers({
  user: userReducer,
  account: accountReducer,
  expenses: expenseReducer,
  debts: debtReducer,
  friends: friendReducer,
  groups: groupReducer
});

const rootReducer = (state, action) => {
  if(action.type === 'user/removeUser') {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  preloadedState
});

store.subscribe(() => {
  localStorage.setItem("localState", JSON.stringify(store.getState()));
});