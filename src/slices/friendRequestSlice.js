import { supabase } from "../supabaseClient";
import { supabaseApi } from "../api/supabaseApi";

const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getFriendRequests: builder.query({
      queryFn: async (friendId) => {
        const { data, error } = await supabase
          .from('user_friend')
          .select('id: user_id, from: user_id(*), *')
          .eq('friend_id', friendId)
          .eq('status', 0);
        return { data, error }
      },
      providesTags: (result = [], error,  arg) => [
        { type: 'FriendRequest', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'FriendRequest', id: id }))
      ]
    }),
    addFriendRequest: builder.mutation({
      queryFn: async ({ userId, friendId }) => {
        const { data, error } = await supabase
          .from('user_friend')
          .insert({
            user_id: userId,
            friend_id: friendId,
            status: 0,
          })
          .select();
        return { data, error };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'FriendRequest', id: arg.userId }]
    }),
    updateFriendRequestStatus: builder.mutation({
      queryFn: async ({ status, userId, friendId }) => {
        const { data, error } = await supabase
          .from('user_friend')
          .update({
            status: status,
            status_change: new Date().toISOString(),
          }).eq('user_id', userId)
          .eq('friend_id', friendId)
          .select();
        return { data, error };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'FriendRequest', id: arg.userId }]
    }),
  })
})

export const {
  useGetFriendRequestsQuery,
  useAddFriendRequestMutation,
  useUpdateFriendRequestStatusMutation
} = extendedSupabaseApi;