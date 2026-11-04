import api from './api';

const register = async (userData) => {
  const payload = {
    fullName: userData.fullName,
    email: userData.email,
    username: userData.username,
    password: userData.password,
    role: userData.role,
  };

  const response = await api.post('/auth/register', payload);
  return response.data;
};

const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
