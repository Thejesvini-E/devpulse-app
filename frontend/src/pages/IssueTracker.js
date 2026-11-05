import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, message } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../services/api';

const IssueTracker = () => {
  const [issues, setIssues] = useState([]);
  const [repos, setRepos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [issuesRes, reposRes] = await Promise.all([
        api.get('/issues'),
        api.get('/repositories')
      ]);
      setIssues(issuesRes.data);
      setRepos(reposRes.data);
    } catch (err) {
      message.error('Failed to load issues and repositories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (record) => {
    const nextStatus = record.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await api.put(`/issues/${record.id}`, { ...record, status: nextStatus });
      message.success(`Issue marked as ${nextStatus}`);
      loadData();
    } catch (err) {
      message.error('Failed to update issue status');
    }
  };

  const handleCreateIssue = async (values) => {
    try {
      await api.post('/issues', {
        title: values.title,
        priority: values.priority,
        status: 'OPEN',
        repository: { id: values.repositoryId }
      });
      message.success('Issue reported successfully');
      setModalVisible(false);
      form.resetFields();
      loadData();
    } catch (err) {
      message.error('Failed to create issue');
    }
  };

  const columns = [
    {
      title: 'Issue Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <span style={{ fontWeight: 700, color: '#f8fafc' }}>{title}</span>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      render: (priority) => {
        const colors = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#3b82f6' };
        return (
          <Tag color={colors[priority] || 'default'} style={{ borderRadius: 6, fontWeight: 700 }}>
            {priority}
          </Tag>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'OPEN' ? 'processing' : 'success'} style={{ borderRadius: 6, fontWeight: 600 }}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Button
          size="small"
          onClick={() => handleToggleStatus(record)}
          icon={record.status === 'OPEN' ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
          style={{
            borderColor: record.status === 'OPEN' ? '#10b981' : 'rgba(255,255,255,0.2)',
            color: record.status === 'OPEN' ? '#34d399' : '#94a3b8'
          }}
        >
          Mark as {record.status === 'OPEN' ? 'CLOSED' : 'OPEN'}
        </Button>
      )
    }
  ];

  return (
    <div className="devpulse-panel" style={{ padding: 28 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Issue Tracker
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
            Monitor and resolve software bugs across connected repositories
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600
          }}
        >
          Report Issue
        </Button>
      </div>

      <Table
        dataSource={issues}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title="Report New Issue"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleCreateIssue} style={{ marginTop: 16 }}>
          <Form.Item name="repositoryId" label="Target Repository" rules={[{ required: true }]}>
            <Select placeholder="Select Repository">
              {repos.map((r) => (
                <Select.Option key={r.id} value={r.id}>{r.repoName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="title" label="Issue Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Memory leak during large file uploads" />
          </Form.Item>
          <Form.Item name="priority" label="Priority Level" rules={[{ required: true }]}>
            <Select placeholder="Select Priority">
              <Select.Option value="HIGH">HIGH</Select.Option>
              <Select.Option value="MEDIUM">MEDIUM</Select.Option>
              <Select.Option value="LOW">LOW</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IssueTracker;
