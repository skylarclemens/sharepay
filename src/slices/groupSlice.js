import { supabase } from '../supabaseClient';
import { supabaseApi } from '../api/supabaseApi';
import { createSelector } from '@reduxjs/toolkit';

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
      providesTags: (result = []) => result ? [
        { type: 'Group', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Group', id: id }))
      ] : [{ type: 'Group', id: 'LIST' }]
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
    getGroupMembers: builder.query({
      queryFn: async groupId => {
        const { data, error } = await supabase
          .from('user_group')
          .select('id, user: users!inner(*)')
          .eq('group_id', groupId);
        return { data, error }
      },
      providesTags: (result = []) => result ? [
        { type: 'GroupMembers', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'GroupMember', id: id }))
      ] : [{ type: 'GroupMembers', id: 'LIST' }]
    }),
    getGroupExpenses: builder.query({
      queryFn: async groupId => {
        const { data, error } = await supabase
          .from('expense')
          .select()
          .eq('group_id', groupId);
      return { data, error }
      },
      providesTags: (result) => [
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
      invalidatesTags: [{ type: 'GroupMember', id: 'LIST' }],
    }),
    updateGroupUsers: builder.mutation({
      queryFn: async (updatedMembers) => {
        const { data, error } = await supabase
          .from('user_group')
          .upsert(updatedMembers, { onConflict: 'user_id, group_id' })
          .select();
        return { data, error };
      },
      invalidatesTags: (result, error, arg) => [
        ...arg.map(({ id }) => [{ type: 'GroupMember', id: id }])
      ],
    }),
    deleteGroupUsers: builder.mutation({
      queryFn: async (deletedMembers) => {
        const { data, error } = await supabase
          .from('user_group')
          .delete()
          .in('id', deletedMembers);
        return { data, error };
      },
      invalidatesTags: [{ type: 'GroupMember', id: 'LIST' }],
    }),
    updateGroup: builder.mutation({
      queryFn: async (updatedGroup) => {
        const { data, error } = await supabase
          .from('group')
          .update(updatedGroup)
          .eq('id', updatedGroup.id)
          .select();
        return { data, error };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Group', id: arg.id }],
    }),
  })
})

export const {
  useGetGroupsQuery,
  useGetGroupQuery,
  useGetGroupMembersQuery,
  useGetGroupExpensesQuery,
  useAddNewGroupMutation,
  useAddNewUserGroupsMutation,
  useUpdateGroupUsersMutation,
  useDeleteGroupUsersMutation,
  useUpdateGroupMutation,
} = extendedSupabaseApi;

export const selectGroupsBySearchQuery = createSelector(
  res => res.data, (data, searchQuery) => searchQuery,
  (data, searchQuery) => data?.filter(group => 
    group.group_name.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? []
)