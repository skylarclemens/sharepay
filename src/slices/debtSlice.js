import { createSelector } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';
import { supabaseApi } from '../api/supabaseApi';

export const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getDebts: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase.from('debt').select();
        return { data, error };
      },
      /*transformResponse: (data) => {
        return data.map(debt => {
          return {
            ...debt,
            debtType: 'OWE',
            
          }
        })
      },*/
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
          .eq('id', debtId);
          return { data, error }
      },
      providesTags: (result, error, arg) => [{ type: 'Debt', id: arg }]
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
  })
});

export const {
  useGetDebtsQuery,
  useGetDebtQuery,
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

export const selectPaidDebts = createSelector(
  res => res?.data,
  data => data?.filter(debt => debt.paid === true) ?? []
);