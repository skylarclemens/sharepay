import { supabase } from '../supabaseClient';
import { supabaseApi } from '../api/supabaseApi';

export const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getAccount: builder.query({
      queryFn: async userId => {
        const { data, error } = await supabase.from('users')
          .select()
          .eq('id', userId);
        const [returnData] = data;
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
  useUpdateAccountMutation
} = extendedSupabaseApi;