import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

const expenseAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.created_at.localeCompare(a.created_at)
});

const initialState = expenseAdapter.getInitialState({
  balances: {
    total: 0,
    owed: 0,
    owe: 0,
  },
  status: 'idle',
  error: null,
});

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
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
        expenseAdapter.upsertMany(state, action.payload);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(addExpense.fulfilled, (state, action) => {
        console.log(action.payload);
        expenseAdapter.addOne(state, ...action.payload);
      })
    builder
      .addCase(removeExpense.fulfilled, (state, action) => {
        const existingExpense = state.entities[action.payload];
        if(existingExpense) {
          expenseAdapter.removeOne(existingExpense);
        }
      })
  },
});

export const { setBalances } = expenseSlice.actions;
export default expenseSlice.reducer;

export const {
  selectAll: selectAllExpenses,
  selectById: selectExpenseById,
  selectIds: selectExpenseIds
} = expenseAdapter.getSelectors(state => state.expenses);

export const getExpenseStatus = state => state.expenses.status;

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

export const removeExpense = createAsyncThunk(
  'expenses/removeExpense',
  async (expenseId) => {
    await supabase
      .from('expense')
      .delete()
      .eq('id', expenseId);
    return expenseId;
  }
)