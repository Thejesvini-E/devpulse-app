import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Tag, Row, Col, Card } from 'antd';
import {
  GithubOutlined,
  GitlabOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined
} from '@ant-design/icons';
import api from '../services/api';

const RepositoryManagement = () => {
  const [repos, setRepos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/repositories');
      setRepos(res.data);
    } catch (err) {
      message.error('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleOpenModal = (record = null) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/repositories/${id}`);
      message.success('Repository deleted successfully.');
      fetchRepos();
    } catch (err) {
      message.error('Failed to delete repository');
    }
  };

  const handleFinish = async (values) => {
    try {
      if (editingId) {
        await api.put(`/repositories/${editingId}`, values);
        message.success('Repository updated successfully.');
      } else {
        await api.post('/repositories', values);
        message.success('Repository created successfully.');
      }
      setModalVisible(false);
      fetchRepos();
    } catch (err) {
      message.error('Unable to save repository details');
    }
  };

  const githubCount = repos.filter((r) => r.platform?.toLowerCase() === 'github').length;
  const gitlabCount = repos.filter((r) => r.platform?.toLowerCase() === 'gitlab').length;

  const columns = [
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      width: 140,
      render: (platform) => {
        const isGitLab = platform?.toLowerCase() === 'gitlab';
        return (
          <Tag
            icon={isGitLab ? <GitlabOutlined /> : <GithubOutlined />}
            color={isGitLab ? '#FC6D26' : '#24292e'}
            style={{ borderRadius: 6, padding: '4px 10px', fontWeight: 700 }}
          >
            {isGitLab ? 'GitLab' : 'GitHub'}
          </Tag>
        );
      }
    },
    {
      title: 'Repository Name',
      dataIndex: 'repoName',
      key: 'repoName',
      render: (name) => <span className="repo-cell-name">{name}</span>
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      render: (owner) => <span className="repo-cell-owner">@{owner}</span>
    },
    {
      title: 'Repository URL',
      dataIndex: 'repoUrl',
      key: 'repoUrl',
      render: (url) => (
        <a href={url} target="_blank" rel="noreferrer" className="repo-cell-url">
          <LinkOutlined /> {url}
        </a>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
            style={{ fontWeight: 600 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            style={{ fontWeight: 600 }}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card className="devpulse-panel" style={{ padding: 8 }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 700 }}>TOTAL REPOSITORIES</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-main)', marginTop: 4 }}>
              {repos.length}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="devpulse-panel" style={{ padding: 8 }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 700 }}>GITHUB REPOSITORIES</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#818cf8', marginTop: 4 }}>
              {githubCount}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="devpulse-panel" style={{ padding: 8 }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 700 }}>GITLAB REPOSITORIES</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fb923c', marginTop: 4 }}>
              {gitlabCount}
            </div>
          </Card>
        </Col>
      </Row>

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
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Connected Repositories
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 4 }}>
              Active source control repositories synced for analytics
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              height: 40,
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            Add Repository
          </Button>
        </div>

        <Table
          dataSource={repos}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />

        <Modal
          title={editingId ? 'Edit Repository' : 'Connect Repository'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => form.submit()}
          okText={editingId ? 'Save Changes' : 'Connect'}
          centered
        >
          <Form form={form} layout="vertical" onFinish={handleFinish} style={{ marginTop: 16 }}>
            <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
              <Select placeholder="Select Platform">
                <Select.Option value="GitHub">GitHub</Select.Option>
                <Select.Option value="GitLab">GitLab</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="repoName" label="Repository Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. devpulse-api" />
            </Form.Item>
            <Form.Item name="owner" label="Owner / Organization" rules={[{ required: true }]}>
              <Input placeholder="e.g. octocat" />
            </Form.Item>
            <Form.Item name="repoUrl" label="Repository URL" rules={[{ required: true }]}>
              <Input placeholder="https://github.com/org/repo" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default RepositoryManagement;