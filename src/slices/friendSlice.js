import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
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
        ...result.map(({ id }) => ({ type: 'Friend', id }))
      ]
    }),
    getFriend: builder.query({
      queryFn: async (friendId) => {
        const { data, error } = await supabase
          .from('user_friend')
          .select('friend_id(*)')
          .eq('friend_id', friendId)
          .eq('status', 1)
          .limit(1)
          .single();
        const returnData = Object.values(data)[0];
        return { data: returnData, error };
      },
      provideTags: (result, error, arg) => [{ type: 'Friend', id: arg }]
    })
  })
})

export const { useGetFriendsQuery,
  useGetFriendQuery
} = extendedSupabaseApi;

const friendsAdapter = createEntityAdapter();

const initialState = friendsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFriends.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        friendsAdapter.upsertMany(state, action.payload);
        state.status = 'succeeded';
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(addFriend.fulfilled, (state, action) => {
        friendsAdapter.addOne(state, ...action.payload);
      });
  },
});

export default friendSlice.reducer;

export const {
  selectAll: selectAllFriends,
  selectById: selectFriendById
} = friendsAdapter.getSelectors(state => state.friends);

export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async (userId) => {
    const { data } = await supabase.from('user_friend')
    .select('friend_id(*)')
    .eq('user_id', userId)
    .eq('status', 1);
    return data.map(obj => obj.friend_id);
  }
);

export const addFriend = createAsyncThunk(
  'friends/addFriend',
  async ({ user, friend }) => {
    const { data } = await supabase.from('user_friend').insert({
      user_id: user,
      friend_id: friend,
      status: 1,
      status_change: new Date().toISOString()
    }).select('friend_id(*)');
    return data.map(obj => obj.friend_id);
  }
)