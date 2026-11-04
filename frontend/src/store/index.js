import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import repositoryReducer from './slices/repositorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    repository: repositoryReducer
  }
});

export default store;