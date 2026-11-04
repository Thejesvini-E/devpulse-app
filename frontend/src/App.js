import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MainLayout from './layout/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RepositoryManagement from './pages/RepositoryManagement';
import CommitActivity from './pages/CommitActivity';
import IssueTracker from './pages/IssueTracker';
import PullRequestDashboard from './pages/PullRequestDashboard';
import ProductivityScore from './pages/ProductivityScore';
import ReportsPage from './pages/ReportsPage';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn && user?.role === 'ROLE_ADMIN' ? children : <Navigate to="/repositories" replace />;
};

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/repositories" replace />} />
          <Route path="repositories" element={<RepositoryManagement />} />
          <Route path="commits" element={<CommitActivity />} />
          <Route path="issues" element={<IssueTracker />} />
          <Route path="pullrequests" element={<PullRequestDashboard />} />
          <Route path="productivity" element={<ProductivityScore />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;