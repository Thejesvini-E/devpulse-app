import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Badge, Tag } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  CodeOutlined,
  BranchesOutlined,
  IssuesCloseOutlined,
  PullRequestOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
  FireOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { logout } from '../store/slices/authSlice';
import { useTheme } from '../context/ThemeContext';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { key: '/repositories', icon: <CodeOutlined />, label: 'Repositories' },
    { key: '/commits', icon: <BranchesOutlined />, label: 'Commit Activity' },
    { key: '/issues', icon: <IssuesCloseOutlined />, label: 'Issue Tracker' },
    { key: '/pullrequests', icon: <PullRequestOutlined />, label: 'Pull Requests' },
    { key: '/productivity', icon: <ThunderboltOutlined />, label: 'Productivity' },
    { key: '/reports', icon: <FileTextOutlined />, label: 'Reports' }
  ];

  if (user && user.role === 'ROLE_ADMIN') {
    menuItems.push({ key: '/admin', icon: <DashboardOutlined />, label: 'Admin Panel' });
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        style={{
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)'
        }}
      >
        <div
          style={{
            height: 68,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 12,
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.5)'
            }}
          >
            <FireOutlined style={{ color: '#ffffff', fontSize: 20 }} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-main)', letterSpacing: -0.5 }}>
                Dev<span style={{ color: '#6366f1' }}>Pulse</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', fontWeight: 700, letterSpacing: 0.5 }}>
                DEVELOPER OPS
              </div>
            </div>
          )}
        </div>

        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', marginTop: 12, borderRight: 0 }}
        />
      </Sider>

      <Layout style={{ background: 'var(--bg-canvas)' }}>
        <Header
          style={{
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Badge status="processing" color="#10b981" />
            <span style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>
              Cluster: <strong style={{ color: '#10b981' }}>Operational</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              onClick={toggleTheme}
              shape="round"
              icon={isDarkMode ? <SunOutlined style={{ color: '#fbbf24' }} /> : <MoonOutlined style={{ color: '#4f46e5' }} />}
              style={{
                background: 'var(--input-bg)',
                borderColor: 'var(--input-border)',
                color: 'var(--text-main)',
                fontWeight: 700
              }}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>

            <Tag color={user?.role === 'ROLE_ADMIN' ? 'red' : user?.role === 'ROLE_MANAGER' ? 'orange' : 'blue'}>
              {user?.role?.replace('ROLE_', '') || 'DEVELOPER'}
            </Tag>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '5px 12px',
                borderRadius: 20,
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' }}
              />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>
                {user?.fullName || user?.username}
              </span>
            </div>

            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ color: 'var(--text-dim)', fontWeight: 600 }}
            >
              Logout
            </Button>
          </div>
        </Header>

        <Content style={{ margin: '24px 28px', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;