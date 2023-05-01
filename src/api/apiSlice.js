import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../supabaseClient';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    getExpenses: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase
          .rpc("get_user_expenses");
        return { data, error };
      }
    }),
    getExpense: builder.query({
      queryFn: async (expenseId) => {
        const { data, error } = await supabase
          .from('expense')
          .select()
          .eq('id', expenseId);
        return { data, error };
      }
    }),
    getDebts: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase.from('debt').select();
        return { data, error };
      }
    })
  })
})

export const { useGetExpensesQuery, useGetExpenseQuery, useGetDebtsQuery } = apiSlice;