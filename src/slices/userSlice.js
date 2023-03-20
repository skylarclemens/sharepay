import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  name: "",
  balance: 0,
  total_owed: 0,
  total_owe: 0,
  groups: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        email: action.payload.email,
        name: action.payload.name
      }
    }
  }
})

export const { setUser } = userSlice.actions;
export default userSlice.reducer;