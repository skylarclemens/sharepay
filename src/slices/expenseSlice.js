import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

const initialState = {
  data: [],
  balances: {
    total: 0,
    owed: 0,
    owe: 0,
  },
  status: 'idle',
  error: null,
};

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    removeExpense: (state, action) => {
      const id = action.payload;
      const newData = state.data.filter(expense => expense.id !== id);
      return {
        ...state,
        data: newData,
      };
    },
    setBalances: (state, action) => {
      return {
        ...state,
        balances: action.payload,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchExpenses.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload,
          status: 'succeeded',
          error: null
        };
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(addExpense.fulfilled, (state, action) => {
        const newData = [...state.data, ...action.payload];
        return {
          ...state,
          data: newData
        }
      })
  },
});

export const { removeExpense, setBalances } = expenseSlice.actions;
export default expenseSlice.reducer;

export const selectAllExpenses = state => state.expenses.data;
export const selectExpenseById = (state, expenseId) => state.expenses.data.find(expense => expense.id === expenseId);

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async () => {
    const { data } = await supabase
      .rpc("get_user_expenses");
    return data;
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (newExpense) => {
    const { data } = await supabase
      .from('expense')
      .insert(newExpense)
      .select();
    return data;
  }
)