import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  session: null,
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload: { session, user }}) => {
      return {
        session,
        user,
      }
    },
    resetAuth: () => {
      return initialState;
    },
  },
});

export const { setCredentials, resetAuth } = authSlice.actions;
export default authSlice.reducer;