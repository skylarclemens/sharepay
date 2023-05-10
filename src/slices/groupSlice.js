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
    }),
    getGroup: builder.query({
      queryFn: async groupId => {
        const { data, error } = await supabase
          .from('group')
          .select()
          .eq('id', groupId)
          const [returnData] = data;
        return { data: returnData, error }
      },
      providesTags: (result, error, arg) => [{ type: 'Group', id: arg }]
    }),
    getGroupExpenses: builder.query({
      queryFn: async groupId => {
        const { data, error } = await supabase
          .from('expense')
          .select()
          .eq('group_id', groupId);
      return { data, error }
      },
      providesTags: (result, error, arg) => [
        ...result.map(({ id }) => ({ type: 'Expense', id: id }))
      ]
    }),
    addNewGroup: builder.mutation({
      queryFn: async (newGroup) => {
        const { data, error } = await supabase
          .from('group')
          .insert(newGroup)
          .select();
        return { data, error };
      },
      invalidatesTags: [{ type: 'Group', id: 'LIST' }],
    }),
    addNewUserGroups: builder.mutation({
      queryFn: async (newMembers) => {
        const { data, error } = await supabase
          .from('user_group')
          .insert(newMembers)
          .select();
        return { data, error };
      },
      invalidatesTags: [{ type: 'Group', id: 'LIST' }],
    }),
  })
})

export const {
  useGetGroupsQuery,
  useGetGroupQuery,
  useGetGroupExpensesQuery,
  useAddNewGroupMutation,
  useAddNewUserGroupsMutation,
} = extendedSupabaseApi;