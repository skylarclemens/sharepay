import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import expenseReducer from '../slices/expenseSlice';
import { supabaseApi } from '../api/supabaseApi';

const combinedReducer = combineReducers({
  auth: authReducer,
  expenses: expenseReducer,
  [supabaseApi.reducerPath]: supabaseApi.reducer
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/userLogout') {
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(supabaseApi.middleware)
});
