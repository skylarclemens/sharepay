import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import accountReducer from '../slices/accountSlice';
import friendReducer from '../slices/friendSlice';
import friendRequestReducer from '../slices/friendRequestSlice';
import groupReducer from '../slices/groupSlice';
import expenseReducer from '../slices/expenseSlice';
import { supabaseApi } from '../api/supabaseApi';

const combinedReducer = combineReducers({
  auth: authReducer,
  expenses: expenseReducer,
  account: accountReducer,
  friends: friendReducer,
  friendRequests: friendRequestReducer,
  groups: groupReducer,
  [supabaseApi.reducerPath]: supabaseApi.reducer
});

const rootReducer = (state, action) => combinedReducer(state, action);

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(supabaseApi.middleware)
});
