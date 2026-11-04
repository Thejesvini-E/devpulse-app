import { createSlice } from '@reduxjs/toolkit';

const repositorySlice = createSlice({
  name: 'repository',
  initialState: {
    repositories: [],
    loading: false
  },
  reducers: {
    setRepositories: (state, action) => {
      state.repositories = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setRepositories, setLoading } = repositorySlice.actions;
export default repositorySlice.reducer;