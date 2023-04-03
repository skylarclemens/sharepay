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
    addFriend: (state, action) => {
      return {
        ...state,
        data: action.payload
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchFriends.pending, (state, action) => {
      state.status = 'loading'
    })
    .addCase(fetchFriends.fulfilled, (state, action) => {
      return {
        ...state,
        data: action.payload,
        status: 'succeeded'
      }
    })
    .addCase(fetchFriends.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
  }
});

export const { initFriends, addFriend } = friendSlice.actions;
export default friendSlice.reducer;

export const fetchFriends = createAsyncThunk('friends/fetchFriends', async () => {
  const { data } = await supabase
    .from('user_friend')
    .select('user_id_2(*)');
  return data.map(obj => obj.user_id_2);
});