import { createAsyncThunk, createSelector, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

const debtAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.created_at.localeCompare(a.created_at)
});

const initialState = debtAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const debtSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    removeDebtById: (state, action) => {
      const existingDebt = state.entities[action.payload];
      if (existingDebt) {
        debtAdapter.removeOne(existingDebt);
      }
    },
    removeDebtByExpense: (state, action) => {
      const existingDebt = selectDebtByExpenseId(action.payload);
      if(existingDebt) {
        debtAdapter.removeMany(existingDebt);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDebts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchDebts.fulfilled, (state, action) => {
        debtAdapter.upsertMany(state, action.payload);
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(addDebt.fulfilled, debtAdapter.addMany)
  },
});

export const { removeDebtById, removeDebtByExpense } = debtSlice.actions;
export default debtSlice.reducer;

export const {
  selectAll: selectAllDebts,
  selectById: selectDebtById,
} = debtAdapter.getSelectors(state => state.debts);

export const selectAllPaidDebts = createSelector(
  [selectAllDebts],
  debts => debts.filter(debt => debt.paid === true)
);
export const selectAllUnpaidDebts = createSelector(
  [selectAllDebts],
  debts => debts.filter(debt => debt.paid === false)
);
export const selectDebtByExpenseId = createSelector(
  [selectAllDebts, (state, expenseId) => expenseId],
  (debts, expenseId) => debts.filter(debt => debt.expense_id === expenseId)
);
export const getDebtStatus = state => state.debts.status;

export const fetchDebts = createAsyncThunk('debts/fetchDebts', async () => {
  const { data } = await supabase.from('debt').select();
  return data;
});

export const addDebt = createAsyncThunk(
  'debts/addDebt',
  async (newDebt) => {
    const { data } = await supabase
      .from('debt')
      .insert(newDebt)
      .select();
    return data;
  }
);
