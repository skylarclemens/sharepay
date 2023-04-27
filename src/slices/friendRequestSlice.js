import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

const friendRequestAdapter = createEntityAdapter();

const initialState = friendRequestAdapter.getInitialState({
  status: 'idle',
  error: null
})

export const friendRequestSlice = createSlice({
  name: 'friendRequests',
  initialState,
  reducers: {
    setStatus: (state, action) => {
      return {
        ...state,
        status: action.payload
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFriendRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        friendRequestAdapter.upsertMany(state, action.payload);
        state.status = 'succeeded';
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(updateRequestStatus.fulfilled, friendRequestAdapter.upsertOne);
  }
})

export const { setStatus } = friendRequestSlice.actions;
export default friendRequestSlice.reducer;

export const {
  selectAll: selectAllFriendRequests,
} = friendRequestAdapter.getSelectors(state => state.friendRequests);

export const fetchFriendRequests = createAsyncThunk(
  'friendRequests/fetchRequests',
  async (friendId) => {
    const { data } = await supabase
      .from('user_friend')
      .select('id: user_id, from: user_id(*), *')
      .eq('friend_id', friendId)
      .eq('status', 0);
    return data;
  }
)

export const updateRequestStatus = createAsyncThunk(
  'friendRequests/updateStatus',
  async ({ status, userId, friendId }) => {
    const { data } = await supabase
      .from('user_friend')
      .update({
        status: status,
        status_change: new Date().toISOString(),
      }).eq('user_id', userId)
      .eq('friend_id', friendId)
      .select('id: user_id, from: user_id(*), *');
    return data[0];
  }
)