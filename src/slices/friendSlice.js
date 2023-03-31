import { createSlice } from "@reduxjs/toolkit";

export const friendSlice = createSlice({
  name: 'friends',
  initialState: [],
  reducers: {
    initFriends: (state, action) => {
      return action.payload;
    },
    addFriend: (state, action) => {
      return [...state, action.payload];
    }
  }
});

export const { initFriends, addFriend } = friendSlice.actions;
export default friendSlice.reducer;