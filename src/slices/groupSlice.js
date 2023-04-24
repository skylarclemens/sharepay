import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    addGroup: (state, action) => {
      const newData = [...state.data, action.payload];
      return {
        ...state,
        data: newData,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGroups.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload,
          status: 'succeeded',
        };
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addExpense } = groupSlice.actions;
export default groupSlice.reducer;

export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async userId => {
    const { data } = await supabase
      .from('user_group')
      .select('group!inner(*)')
      .eq('user_id', userId);
    return data.map(obj => obj.group);
  }
);
