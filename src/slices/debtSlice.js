import { createAsyncThunk, createSelector, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';
import { supabaseApi } from '../api/supabaseApi';

export const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getDebts: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase.from('debt').select();
        return { data, error };
      }
    })
  })
});

export const { useGetDebtsQuery } = extendedSupabaseApi;

export const selectDebtsResult = extendedSupabaseApi.endpoints.getDebts.select();
const selectDebtsData = createSelector(
  selectDebtsResult,
  debtsResult => debtsResult.data
)
export const selectSharedDebtsByFriendId = createSelector(
  res => res.data, (data, friendId) => friendId,
  (data, friendId) => data.filter(debt => (debt.creditor_id === friendId || debt.debtor_id === friendId)) ?? []
)

/*export const selectAllPaidDebts = createSelector(
  [selectAllDebts],
  debts => debts.filter(debt => debt.paid === true)
);
export const selectAllUnpaidDebts = createSelector(
  [selectAllDebts],
  debts => debts.filter(debt => debt.paid === false)
);
export const selectDebtsByExpenseId = createSelector(
  [selectAllDebts, (state, expenseId) => expenseId],
  (debts, expenseId) => debts.filter(debt => debt.expense_id === expenseId)
);
export const selectSharedDebtsByFriendId = createSelector(
  [selectAllUnpaidDebts, (state, friendId) => friendId],
  (debts, friendId) => debts.filter(debt => (debt.creditor_id === friendId || debt.debtor_id === friendId))
);*/

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

export const updateDebt = createAsyncThunk(
  'debts/updateDebt',
  async (updatedDebt) => {
    const { data } = await supabase
      .from('debt')
      .upsert(updatedDebt)
      .select();
    return data;
  }
)