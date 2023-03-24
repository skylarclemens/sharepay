import { createSlice } from "@reduxjs/toolkit";

export const friendSlice = createSlice({
  name: 'friends',
  initialState: [],
  reducers: {
    addFriend: (state, action) => {
      return [...state, action.payload];
    }
  }
});

export const { addFriend } = friendSlice.actions;
export default friendSlice.reducer;