import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      return {
        isLoggedIn: true,
        user: JSON.parse(storedUser)
      };
    } catch (e) {
      return { isLoggedIn: false, user: null };
    }
  }
  return { isLoggedIn: false, user: null };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;