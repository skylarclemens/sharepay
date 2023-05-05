import { supabase } from '../supabaseClient';
import { supabaseApi } from '../api/supabaseApi';

const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getFriends: builder.query({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('user_friend')
          .select('friend_id(*)')
          .eq('user_id', userId)
          .eq('status', 1);
        const returnData = data.map(obj => obj.friend_id);
        return { data: returnData, error };
      },
      providesTags: (result = [], error,  arg) => [
        { type: 'Friend', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Friend', id: id }))
      ]
    }),
    getFriend: builder.query({
      queryFn: async (friendId) => {
        const { data, error } = await supabase
          .from('user_friend')
          .select('friend:friend_id(*)')
          .eq('friend_id', friendId)
          .eq('status', 1)
          .limit(1)
          .single();
        return { data: data.friend, error };
      },
      provideTags: (result, error, arg) => [{ type: 'Friend', id: arg }]
    }),
    addNewFriend: builder.mutation({
      queryFn: async ({ user, friend }) => {
        const { error } = await supabase.from('user_friend').insert({
          user_id: user,
          friend_id: friend,
          status: 1,
          status_change: new Date().toISOString()
        })
        return { error };
      },
      invalidatesTags: [{ type: 'Friend', id: 'LIST' }],
    }),
  })
})

export const { useGetFriendsQuery,
  useGetFriendQuery,
  useAddNewFriendMutation
} = extendedSupabaseApi;