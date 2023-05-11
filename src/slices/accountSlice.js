import { supabase } from '../supabaseClient';
import { supabaseApi } from '../api/supabaseApi';

export const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getAccount: builder.query({
      queryFn: async userId => {
        const { data, error } = await supabase.from('users')
          .select()
          .eq('id', userId);
        const [returnData] = data ?? [];
        return { data: returnData, error };
      },
      providesTags: (result, error, arg) => [{ type: 'Account', id: arg }]
    }),
    getAccounts: builder.query({
      queryFn: async (accountIds) => {
        const { data, error } = await supabase
          .from('users')
          .select()
          .in('id', accountIds);
        return { data, error }
      },
      providesTags: (result = [], error, arg) => [
        ...result.map(({ id }) => ({ type: 'Account', id: id }))
      ]
    }),
    getAllAccounts: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase
          .from('users')
          .select();
        return { data, error }
      },
      providesTags: (result = [], error, arg) => [
        { type: 'Account', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Account', id: id }))
      ]
    }),
    searchAccounts: builder.query({
      queryFn: async ({ userId, value }) => {
        const { data, error } = await supabase
          .from('users')
          .select()
          .neq('id', userId)
          .or(`email.ilike.%${value}%,name.ilike.%${value}%`);
        return { data, error }
      },
      providesTags: (result = [], error, arg) => [
        ...result.map(({ id }) => ({ type: 'Account', id: id }))
      ]
    }),
    updateAccount: builder.mutation({
      queryFn: async (accountUpdates) => {
        const { data, error } = await supabase
          .from('users')
          .upsert(accountUpdates)
          .select();
        return { data, error }
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Account', id: arg.id }]
    })
  })
})

export const {
  useGetAccountQuery,
  useGetAccountsQuery,
  useGetAllAccountsQuery,
  useSearchAccountsQuery,
  useUpdateAccountMutation
} = extendedSupabaseApi;