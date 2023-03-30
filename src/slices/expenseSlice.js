import { createSlice } from "@reduxjs/toolkit";

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState: [],
  reducers: {
    initExpenses: (state, action) => {
      return action.payload;
    },
    addExpense: (state, action) => {
      return [...state, action.payload];
    }
  }
});

export const { initExpenses, addExpense } = expenseSlice.actions;
export default expenseSlice.reducer;