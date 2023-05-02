import { createSelector } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';
import { supabaseApi } from '../api/supabaseApi';

export const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getDebts: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase.from('debt').select();
        return { data, error };
      }
    }),
    addNewDebt: builder.mutation({
      queryFn: async (newDebt) => {
        const { data, error } = await supabase
          .from('debt')
          .insert(newDebt)
          .select();
        return { data, error };
      }
    }),
    updateDebt: builder.mutation({
      queryFn: async (updatedDebt) => {
        const { data, error } = await supabase
          .from('debt')
          .upsert(updatedDebt)
          .select();
        return { data, error };
      }
    })
  })
});

export const {
  useGetDebtsQuery,
  useAddNewDebtMutation,
  useUpdateDebtMutation
} = extendedSupabaseApi;

export const selectDebtsResult = extendedSupabaseApi.endpoints.getDebts.select();

export const selectSharedDebtsByFriendId = createSelector(
  res => res.data, (data, friendId) => friendId,
  (data, friendId) => data.filter(debt => (debt.creditor_id === friendId || debt.debtor_id === friendId)) ?? []
);