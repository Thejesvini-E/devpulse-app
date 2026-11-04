import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, Space, message } from 'antd';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        message.error('Failed to load admin telemetry');
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'ROLE_ADMIN' ? 'red' : role === 'ROLE_MANAGER' ? 'orange' : 'blue'}>
          {role}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small">Edit</Button>
          <Button size="small" danger>Deactivate</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="Total Users" value={stats.totalUsers || 0} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="System Health" value={stats.systemStatus || 'Stable'} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Total Repositories" value={stats.totalRepositories || 0} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Pending Requests" value={stats.pendingPRs || 0} /></Card>
        </Col>
      </Row>

      <Table dataSource={users} columns={columns} rowKey="id" />
    </div>
  );
};

export default AdminDashboard;