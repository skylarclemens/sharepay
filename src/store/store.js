import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from '../slices/userSlice';
import expenseReducer from '../slices/expenseSlice';
import friendReducer from '../slices/friendSlice';
import debtReducer from '../slices/debtSlice';

const preloadedState = localStorage.getItem("localState") ? JSON.parse(localStorage.getItem("localState")) : {};

const combinedReducer = combineReducers({
  user: userReducer,
  expenses: expenseReducer,
  debts: debtReducer,
  friends: friendReducer
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