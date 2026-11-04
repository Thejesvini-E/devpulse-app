import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserOutlined,
  LockOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import authService from '../services/authService';
import { loginSuccess } from '../store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightMode]);

  const onFinish = async (values) => {
    try {
      const data = await authService.login(values.username, values.password);
      dispatch(loginSuccess(data));
      message.success('Authenticated successfully');
      navigate('/repositories');
    } catch (err) {
      message.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-canvas)',
        padding: 24,
        position: 'relative'
      }}
    >
      {/* Top right theme toggle */}
      <div style={{ position: 'absolute', top: 20, right: 24 }}>
        <Button
          onClick={() => setIsLightMode(!isLightMode)}
          shape="round"
          icon={isLightMode ? <MoonOutlined style={{ color: '#4f46e5' }} /> : <SunOutlined style={{ color: '#fbbf24' }} />}
          style={{
            background: 'var(--surface-panel)',
            borderColor: 'var(--surface-border)',
            color: 'var(--text-primary)',
            fontWeight: 700
          }}
        >
          {isLightMode ? 'Dark Mode' : 'Light Mode'}
        </Button>
      </div>

      <div
        className="devpulse-panel"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '40px 32px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              margin: '0 auto 14px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
            }}
          >
            DP
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            Welcome to DevPulse
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Continuous Developer Intelligence & Telemetry
          </p>
        </div>

        <Form onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#6366f1' }} />} placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#6366f1' }} />} placeholder="Enter password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            icon={<ArrowRightOutlined />}
            style={{
              height: 48,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              marginTop: 8
            }}
          >
            Sign In
          </Button>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 700 }}>
              Register here
            </Link>
          </div>

          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid var(--surface-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: 'var(--text-muted)',
              fontSize: 12
            }}
          >
            <SafetyCertificateOutlined style={{ color: '#10b981' }} />
            <span>Encrypted with SHA-512 JWT Authentication</span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;