import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

const initialState = {
  data: [],
  balances: {
    total: 0,
    owed: 0,
    owe: 0
  },
  status: 'idle',
  error: null
}

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      const newData = [...state.data, action.payload];
      return {
        ...state,
        data: newData
      }
    },
    removeExpense: (state, action) => {
      const id = action.payload;
      const newData = state.data.filter(expense => expense.id !== id)
      return {
        ...state,
        data: newData
      }
    },
    setBalances: (state, action) => {
      return {
        ...state,
        balances: action.payload
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

export const { addExpense, removeExpense, setBalances } = expenseSlice.actions;
export default expenseSlice.reducer;

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (userId) => {
  const { data } = await supabase
    .from('debt')
    .select('expense_id(*)');
  return data.map(obj => obj.expense_id);
});