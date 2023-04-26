import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';

const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

export const debtSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    removeDebtById: (state, action) => {
      const id = action.payload;
      const newData = state.data.filter(debt => debt.id !== id);
      return {
        ...state,
        data: newData,
      };
    },
    removeDebtByExpense: (state, action) => {
      const id = action.payload;
      const newData = state.data.filter(debt => debt.expense_id !== id);
      return {
        ...state,
        data: newData,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchDebts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchDebts.fulfilled, (state, action) => {
        return {
          ...state,
          data: action.payload,
          status: 'succeeded',
        };
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
    builder
      .addCase(addDebt.fulfilled, (state, action) => {
        const newData = [...state.data, ...action.payload];
        return {
          ...state,
          data: newData
        }
      })
  },
});

export const { removeDebtById, removeDebtByExpense } = debtSlice.actions;
export default debtSlice.reducer;

export const selectAllDebts = state => state.friends.data;

export const selectFriendById = (state, friendId) => state.friends.data.find(friend => friend.id === friendId);

export const fetchDebts = createAsyncThunk('debts/fetchDebts', async () => {
  const { data } = await supabase.from('debt').select();
  return data;
});

export const addDebt = createAsyncThunk(
  'debts/addDebt',
  async (newDebt) => {
    const { data } = await supabase
      .from('debt')
      .insert(newDebt)
      .select();
    return data;
  }
);
