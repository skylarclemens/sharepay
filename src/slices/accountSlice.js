import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccountData: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
    removeAccount: (state, action) => {
      return null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAccount.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload,
          status: 'succeeded',
        };
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setAccountData, removeAccount } = accountSlice.actions;
export default accountSlice.reducer;

export const fetchAccount = createAsyncThunk(
  'account/fetchAccount',
  async userId => {
    const { data } = await supabase.from('users').select().eq('id', userId);
    return data[0];
  }
);
