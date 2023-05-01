import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import accountReducer from '../slices/accountSlice';
import expenseReducer from '../slices/expenseSlice';
import friendReducer from '../slices/friendSlice';
import friendRequestReducer from '../slices/friendRequestSlice';
import debtReducer from '../slices/debtSlice';
import groupReducer from '../slices/groupSlice';
import { apiSlice } from '../api/apiSlice';

const combinedReducer = combineReducers({
  auth: authReducer,
  account: accountReducer,
  expenses: expenseReducer,
  debts: debtReducer,
  friends: friendReducer,
  friendRequests: friendRequestReducer,
  groups: groupReducer,
  [apiSlice.reducerPath]: apiSlice.reducer
});

const rootReducer = (state, action) => combinedReducer(state, action);

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
});
