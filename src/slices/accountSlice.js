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
    updateAccount: builder.mutation({
      queryFn: async (accountUpdates) => {
        const { data, error } = await supabase
          .from('users')
          .upsert(accountUpdates)
          .select();
        return { data, error }
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Account', id: arg.id}]
    })
  })
})

export const {
  useGetAccountQuery,
  useUpdateAccountMutation
} = extendedSupabaseApi;