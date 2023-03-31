import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

const initialState = {
  data: [],
  status: 'idle',
  error: null
}

export const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    initFriends: (state, action) => {
      state.data = [...state.data, action.payload]
    },
    addFriend: (state, action) => {
      return [...state, action.payload];
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchFriends.pending, (state, action) => {
      state.status = 'loading'
    })
    .addCase(fetchFriends.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.data = [...state.data, action.payload]
    })
    .addCase(fetchFriends.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
  }
});

export const { initFriends, addFriend } = friendSlice.actions;
export default friendSlice.reducer;

export const fetchFriends = createAsyncThunk('friends/fetchFriends', async (userId) => {
  const { data } = await supabase
    .from('user_friend')
    .select('user_id_2(*)')
    .eq('user_id_1', userId);
  return data;
});