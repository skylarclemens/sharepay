import { createSlice, createSelector } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';
import { supabaseApi } from '../api/supabaseApi';

export const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getExpenses: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase
          .rpc("get_user_expenses");
        return { data, error };
      },
      providesTags: (result = [], error, arg) => [
        { type: 'Expense', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Expense', id }))
      ]
    }),
    getExpensesOwedJoin: builder.query({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('expense')
          .select(
            `id, description, amount, date, paid, category, group_id, debt(*)`
          )
          .eq('debt.creditor_id', userId);
        return { data, error };
      },
      providesTags: (result = [], error, arg) => [
        { type: 'Expense', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Expense', id }))
      ]
    }),
    getExpensesOweJoin: builder.query({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('expense')
          .select(
            `id, description, amount, date, paid, category, group_id, debt(*)`
          )
          .eq('debt.debtor_id', userId);
        return { data, error };
      },
      providesTags: (result = [], error, arg) => [
        { type: 'Expense', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Expense', id }))
      ]
    }),
    getExpense: builder.query({
      queryFn: async (expenseId) => {
        const { data, error } = await supabase
          .from('expense')
          .select()
          .eq('id', expenseId)
          .single();
        return { data, error };
      },
      providesTags: (result, error, arg) => [{ type: 'Expense', id: arg }]
    }),
    addNewExpense: builder.mutation({
      queryFn: async (newExpense) => {
        const { data, error } = await supabase
          .from('expense')
          .insert(newExpense)
          .select();
        return { data, error };
      },
      invalidatesTags: [{ type: 'Expense', id: 'LIST' }, { type: 'Debt', id: 'LIST' }]
    }),
    updateExpense: builder.mutation({
      queryFn: async (updatedExpense) => {
        const { data, error } = await supabase
          .from('expense')
          .update(updatedExpense)
          .eq('id', updatedExpense.id)
          .select();
        return { data, error };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Expense', id: arg.id }]
    }),
    updateExpenses: builder.mutation({
      queryFn: async (updatedExpenses) => {
        const { data, error } = await supabase
          .from('expense')
          .upsert(updatedExpenses)
          .select();
        return { data, error };
      },
      invalidatesTags: (result, error, arg) => [
        ...result.map(({ id }) => ({ type: 'Expense', id: id }))
      ]
    }),
    removeExpense: builder.mutation({
      queryFn: async (expenseId) => {
        const { error } = await supabase
          .from('expense')
          .delete()
          .eq('id', expenseId)
        return { error };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Expense', id: arg }, { type: 'Debt', id: 'LIST' }]
    }),
  })
})

export const { useGetExpensesQuery,
  useGetExpenseQuery,
  useAddNewExpenseMutation,
  useUpdateExpenseMutation,
  useGetExpensesOwedJoinQuery,
  useGetExpensesOweJoinQuery,
  useUpdateExpensesMutation,
  useRemoveExpenseMutation
} = extendedSupabaseApi;

export const selectExpensesResult = extendedSupabaseApi.endpoints.getExpenses.select();
const emptyExpenses = [];

export const selectAllExpenses = createSelector(
  selectExpensesResult,
  expensesResult => expensesResult?.data ?? emptyExpenses
)

export const selectSharedExpensesByDebt = createSelector(
  res => res.data, (data, sharedDebts) => sharedDebts,
  (data, sharedDebts) => data?.filter(expense =>
    sharedDebts.find(shared => shared.expense_id === expense.id)
  ) ?? []
)

export const selectUnpaidSharedExpensesByDebt = createSelector(
  res => res.data, (data, sharedDebts) => sharedDebts,
  (data, sharedDebts) => data?.filter(expense =>
    sharedDebts.find(shared => shared.expense_id === expense.id && !shared.paid)
  ) ?? []
)

export const selectUnpaidExpenses = createSelector(
  res => res.data,
  (data) => data?.filter(expense => !expense.paid) ?? []
)

export const selectUserExpensesByGroup = createSelector(
  selectAllExpenses, (state, groupId) => groupId,
  (expenses, groupId) => expenses.filter(expense => expense.group_id === groupId) ?? []
)
export const selectAllFriendExpenses = createSelector(
  selectAllExpenses,
  (expenses) => expenses.filter(expense => expense.group_id === null) ?? []
)

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    balances: {
      total: 0,
      owed: 0,
      owe: 0,
    }
  },
  reducers: {
    setBalances: (state, action) => {
      return {
        ...state,
        balances: action.payload,
      };
    },
  },
});

export const { setBalances } = expenseSlice.actions;
export default expenseSlice.reducer;