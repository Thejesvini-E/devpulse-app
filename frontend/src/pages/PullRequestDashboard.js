import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, message, Space } from 'antd';
import { PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import api from '../services/api';

const PullRequestDashboard = () => {
  const [prs, setPrs] = useState([]);
  const [repos, setRepos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);

  const isManagerOrAdmin = user && (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_MANAGER');

  const fetchPRs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pullrequests');
      setPrs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to load pull requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/repositories')
      .then((res) => setRepos(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRepos([]));
    fetchPRs();
  }, []);

  const handleCreatePR = async (values) => {
    try {
      const parsedRepoId = Number(values.repositoryId);

      const payload = {
        title: values.title,
        description: values.description,
        status: 'OPEN',
        repositoryId: parsedRepoId,          // Flat property for DTOs
        repository: { id: parsedRepoId }     // Nested object for JPA entity mapping
      };

      await api.post('/pullrequests', payload);
      message.success('Pull request created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchPRs();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response?.data : null) ||
        err.message ||
        'Failed to create PR';
      message.error(errorMsg);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const endpoint = status === 'MERGED' ? `/pullrequests/${id}/merge` : `/pullrequests/${id}/reject`;
      await api.put(endpoint);
      message.success(`Pull request ${status.toLowerCase()}`);
      fetchPRs();
    } catch (err) {
      message.error(err.response?.data?.message || `Failed to update PR to ${status}`);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <span style={{ fontWeight: 700, color: 'var(--text-main, #f8fafc)' }}>{title}</span>
    },
    {
      title: 'Repository',
      dataIndex: 'repository',
      key: 'repository',
      render: (repo) => <span className="repo-cell-name">{repo?.repoName || 'N/A'}</span>
    },
    {
      title: 'Author',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (author) => <span style={{ color: 'var(--text-dim, #94a3b8)' }}>@{author?.username || 'user'}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const colors = { OPEN: 'processing', MERGED: 'success', REJECTED: 'error' };
        return (
          <Tag color={colors[status] || 'default'} style={{ borderRadius: 6, fontWeight: 700 }}>
            {status}
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, record) => {
        if (!isManagerOrAdmin || record.status !== 'OPEN') {
          return <span style={{ color: 'var(--text-dim, #64748b)', fontSize: 12 }}>No actions</span>;
        }
        return (
          <Space>
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleStatusUpdate(record.id, 'MERGED')}
              style={{ background: '#10b981', borderColor: '#10b981', fontWeight: 600 }}
            >
              Merge
            </Button>
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleStatusUpdate(record.id, 'REJECTED')}
              style={{ fontWeight: 600 }}
            >
              Reject
            </Button>
          </Space>
        );
      }
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
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main, #f8fafc)', margin: 0 }}>
            Pull Requests Pipeline
          </h2>
          <p style={{ color: 'var(--text-dim, #94a3b8)', fontSize: 13, marginTop: 4 }}>
            Review, approve, and track merge cycles across branches
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
            fontWeight: 700
          }}
        >
          Create PR
        </Button>
      </div>

      <Table
        dataSource={prs}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title="Create Pull Request"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleCreatePR} style={{ marginTop: 16 }}>
          <Form.Item
            name="repositoryId"
            label="Repository"
            rules={[{ required: true, message: 'Please select a repository' }]}
          >
            <Select placeholder="Select Repository">
              {repos.map((r) => (
                <Select.Option key={r.id} value={r.id}>
                  {r.repoName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="e.g. feat: add oauth2 provider support" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} placeholder="Describe the changes made..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PullRequestDashboard;