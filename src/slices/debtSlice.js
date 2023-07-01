import { createSelector } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';
import { supabaseApi } from '../api/supabaseApi';

export const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getDebts: builder.query({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('debt')
          .select()
          .or(`debtor_id.eq.${userId},creditor_id.eq.${userId}`);
        return { data, error };
      },
      providesTags: (result = [], error, arg) => [
        { type: 'Debt', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Debt', id: id }))
      ]
    }),
    getDebt: builder.query({
      queryFn: async debtId => {
        const { data, error } = await supabase
          .from('debt')
          .select()
          .eq('id', debtId)
          .single();
          return { data, error }
      },
      providesTags: (result, error, arg) => [{ type: 'Debt', id: arg }]
    }),
    getExpenseDebts: builder.query({
      queryFn: async expenseId => {
        const { data, error } = await supabase
          .from('debt')
          .select()
          .eq('expense_id', expenseId);
          return { data, error }
      },
      providesTags: (result = [], error, arg) => [
        ...result.map(({ id }) => ({ type: 'Debt', id: id })),
      ]
    }),
    getDebtsWithExpenses: builder.query({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('debt')
          .select('*, expense: expense_id(*)')
          .or(`debtor_id.eq.${userId},creditor_id.eq.${userId}`)
          .order('created_at', { ascending: false });
        return { data, error };
      },
      providesTags: (result = [], error, arg) => [
        { type: 'Debt', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Debt', id: id }))
      ]
    }),
    getSharedDebtsWithExpenses: builder.query({
      queryFn: async ({ userId, friendId }) => {
        const { data, error } = await supabase
          .from('debt')
          .select('*, expense: expense_id(*)')
          .or(`and(debtor_id.eq.${userId},creditor_id.eq.${friendId}),and(creditor_id.eq.${userId},debtor_id.eq.${friendId})`)
          .order('created_at', { ascending: false });
        return { data, error };
      },
      providesTags: (result = [], error, arg) => [
        { type: 'Debt', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Debt', id: id }))
      ]
    }),
    getSharedGroupDebtsWithExpenses: builder.query({
      queryFn: async ({ userId, groupId }) => {
        const { data, error } = await supabase
          .from('debt')
          .select('*, expense: expense_id(*)')
          .or(`and(debtor_id.eq.${userId},group_id.eq.${groupId}),and(creditor_id.eq.${userId},group_id.eq.${groupId})`)
          .order('created_at', { ascending: false });
        return { data, error };
      },
      providesTags: (result = [], error, arg) => [
        { type: 'Debt', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Debt', id: id }))
      ]
    }),
    getDebtsByExpenseIds: builder.query({
      queryFn: async expenseIdList => {
        const { data, error } = await supabase
          .from('debt')
          .select()
          .in('expense_id', expenseIdList);
          return { data, error }
      },
      providesTags: (result = [], error, arg) => [
        ...result.map(({ id }) => ({ type: 'Debt', id: id })),
      ]
    }),
    addNewDebt: builder.mutation({
      queryFn: async (newDebt) => {
        const { data, error } = await supabase
          .from('debt')
          .insert(newDebt)
          .select();
        return { data, error };
      },
      invalidatesTags: [{ type: 'Debt', id: 'LIST' }]
    }),
    updateDebt: builder.mutation({
      queryFn: async (updatedDebt) => {
        const { data, error } = await supabase
          .from('debt')
          .update(updatedDebt)
          .eq('id', updatedDebt.id)
          .select();
        return { data, error };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Debt', id: arg.id }]
    }),
    updateDebts: builder.mutation({
      queryFn: async (updatedDebts) => {
        const { data, error } = await supabase
          .from('debt')
          .upsert(updatedDebts)
          .select();
        return { data, error };
      },
      invalidatesTags: ['Debt']
    }),
  }),
});

export const {
  useGetDebtsQuery,
  useGetDebtQuery,
  useGetExpenseDebtsQuery,
  useGetDebtsWithExpensesQuery,
  useGetSharedDebtsWithExpensesQuery,
  useGetSharedGroupDebtsWithExpensesQuery,
  useGetDebtsByExpenseIdsQuery,
  useAddNewDebtMutation,
  useUpdateDebtMutation,
  useUpdateDebtsMutation
} = extendedSupabaseApi;

export const selectDebtsResult = extendedSupabaseApi.endpoints.getDebts.select();
const emptyDebts = [];
export const selectAllDebts = createSelector(
  selectDebtsResult,
  res => res.data ?? emptyDebts
);

export const selectDebtsByExpenseId = createSelector(
  res => res.data,
  (res, expenseId) => expenseId,
  (data, expenseId) => data?.filter(debt => debt.expense_id === expenseId) ?? []
);

export const selectSharedDebtsByFriendId = createSelector(
  res => res.data, (data, friendId) => friendId,
  (data, friendId) => data?.filter(debt => (debt.creditor_id === friendId || debt.debtor_id === friendId)) ?? []
);

export const selectUnpaidSharedDebtsByFriendId = createSelector(
  res => res.data, (data, friendId) => friendId,
  (data, friendId) => data?.filter(debt => (debt.creditor_id === friendId || debt.debtor_id === friendId) && debt.paid === false) ?? []
);

export const selectPaidSharedDebtsByFriendId = createSelector(
  res => res.data, (data, friendId) => friendId,
  (data, friendId) => data?.filter(debt => (debt.creditor_id === friendId || debt.debtor_id === friendId) && debt.paid === true) ?? []
)

export const selectUserDebtsByGroupId = createSelector(
  res => res.data, (data, groupId) => groupId,
  (data, groupId) => data?.filter(debt =>
    debt.group_id === groupId) ?? []
)

export const selectPaidDebts = createSelector(
  res => res?.data,
  data => data?.filter(debt => debt.paid === true) ?? []
);