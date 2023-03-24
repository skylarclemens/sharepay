import { createSlice } from "@reduxjs/toolkit";

export const friendSlice = createSlice({
  name: 'friends',
  initialState: [],
  reducers: {
    initializeFriends: (state, action) => {
      return action.payload;
    },
    addFriend: (state, action) => {
      return [...state, action.payload];
    }
  }
});

export const { initializeFriends, addFriend } = friendSlice.actions;
export default friendSlice.reducer;