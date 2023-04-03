import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

const initialState = {
  data: [],
  status: 'idle',
  error: null
}

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      return {
        ...state,
        data: action.payload
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchExpenses.pending, (state, action) => {
      state.status = 'loading'
    })
    .addCase(fetchExpenses.fulfilled, (state, action) => {
      return {
        ...state,
        data: action.payload,
        status: 'succeeded'
      }
    })
    .addCase(fetchExpenses.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
  }
});

export const { initExpenses, addExpense } = expenseSlice.actions;
export default expenseSlice.reducer;

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (userId) => {
  const { data } = await supabase
    .from('debt')
    .select('expense_id(*)')
    .or(`creditor_id.eq.${userId},debtor_id.eq.${userId}`);
  return data.map(obj => obj.expense_id);
});