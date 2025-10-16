import { createSlice } from '@reduxjs/toolkit';

const loadAuthFromStorage = () => {
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      return JSON.parse(authData);
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error);
  }
  return { isAuthenticated: false, user: null };
};

const saveAuthToStorage = (authState) => {
  try {
    localStorage.setItem('auth', JSON.stringify(authState));
  } catch (error) {
    console.error('Failed to save auth to storage:', error);
  }
};

const initialState = loadAuthFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      saveAuthToStorage({ isAuthenticated: true, user: action.payload });
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      saveAuthToStorage({ isAuthenticated: false, user: null });
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;