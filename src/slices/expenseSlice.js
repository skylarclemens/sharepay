import { createSlice } from "@reduxjs/toolkit";

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState: [],
  reducers: {
    addExpense: (state, action) => {
      return [...state, action.payload];
    }
  }
});

export const { addExpense } = expenseSlice.actions;
export default expenseSlice.reducer;