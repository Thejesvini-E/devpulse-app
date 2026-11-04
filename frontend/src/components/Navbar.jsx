import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import authService from '../services/authService';

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
  };

  return (
    <nav>
      {auth && auth.user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button>Login</button>
      )}
    </nav>
  );
};

export default Navbar;