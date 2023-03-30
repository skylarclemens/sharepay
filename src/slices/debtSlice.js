import { createSlice } from "@reduxjs/toolkit";

export const debtSlice = createSlice({
  name: 'debt',
  initialState: [],
  reducers: {
    initDebt: (state, action) => {
      return action.payload;
    },
    addDebt: (state, action) => {
      return [...state, action.payload];
    }
  }
});

export const { initDebt, addDebt } = debtSlice.actions;
export default debtSlice.reducer;