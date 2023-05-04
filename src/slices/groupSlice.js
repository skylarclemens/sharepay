import { supabase } from '../supabaseClient';
import { supabaseApi } from '../api/supabaseApi';

export const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getGroups: builder.query({
      queryFn: async userId => {
        const { data, error } = await supabase
          .from('user_group')
          .select('group!inner(*)')
          .eq('user_id', userId);
        const returnData = data.map(obj => obj.group);
        return { data: returnData, error }
      },
      providesTags: (result = [], error,  arg) => [
        { type: 'Group', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Group', id: id }))
      ]
    })
  })
})

export const {
  useGetGroupsQuery
} = extendedSupabaseApi;