import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

const initialState = {
  data: [],
  status: 'idle',
  error: null
}

export const debtSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    addDebt: (state, action) => {
      state.data = [...state.data, action.payload]
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchDebts.pending, (state, action) => {
      state.status = 'loading'
    })
    .addCase(fetchDebts.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.data = [...state.data, action.payload]
    })
    .addCase(fetchDebts.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
  }
});

export const { addDebt } = debtSlice.actions;
export default debtSlice.reducer;

export const fetchDebts = createAsyncThunk('debts/fetchDebts', async (userId) => {
  const { data } = await supabase
    .from('debt')
    .select()
    .or(`creditor_id.eq.${userId},debtor_id.eq.${userId}`);
  return data;
});