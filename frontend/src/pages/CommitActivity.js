import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, message } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import api from '../services/api';

const CommitActivity = () => {
  const [commits, setCommits] = useState([]);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.auth);

  const fetchCommits = async (repoId = null) => {
    setLoading(true);
    try {
      const url = repoId ? `/commits/${repoId}` : '/commits';
      const res = await api.get(url);
      setCommits(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to load commits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/repositories')
      .then((res) => setRepos(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRepos([]));
    fetchCommits();
  }, []);

  const handleRepoFilter = (repoId) => {
    setSelectedRepo(repoId);
    fetchCommits(repoId);
  };

  const handleAddCommit = async (values) => {
    // Extract the raw ID safely
    const repoId = values.repositoryId?.id || values.repositoryId;

    if (!repoId) {
      message.error("Please select a target repository");
      return;
    }

    try {
      await api.post('/commits', {
        message: values.message,
        commitHash: values.commitHash || Math.random().toString(36).substring(2, 9),
        author: user?.username || 'developer',
        status: 'VERIFIED',
        repositoryId: repoId,              // for DTOs expecting 'repositoryId'
        repository: { id: Number(repoId) }  // for Entities expecting 'repository: { id }'
      });
      message.success('Commit activity registered');
      setModalVisible(false);
      form.resetFields();
      fetchCommits(selectedRepo);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to record commit');
    }
  };

  const columns = [
    {
      title: 'Commit Hash',
      dataIndex: 'commitHash',
      key: 'commitHash',
      width: 140,
      render: (hash) => <span className="code-pill">{hash || '7f2a1b0'}</span>
    },
    {
      title: 'Commit Message',
      dataIndex: 'message',
      key: 'message',
      render: (msg) => <span style={{ fontWeight: 600, color: 'var(--text-main, #f8fafc)' }}>{msg}</span>
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: (author) => <span style={{ color: 'var(--text-dim, #94a3b8)' }}>@{author}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const isVerified = status === 'VERIFIED';
        return (
          <Tag
            icon={isVerified ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            color={isVerified ? 'success' : 'default'}
            style={{ borderRadius: 6, fontWeight: 700 }}
          >
            {status || 'PENDING'}
          </Tag>
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
            Commit Stream & Activity
          </h2>
          <p style={{ color: 'var(--text-dim, #94a3b8)', fontSize: 13, marginTop: 4 }}>
            Direct VCS event hooks and manual activity records
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Select
            style={{ width: 220 }}
            placeholder="Filter by Repository"
            allowClear
            onChange={handleRepoFilter}
          >
            {repos.map((r) => (
              <Select.Option key={r.id} value={r.id}>{r.repoName}</Select.Option>
            ))}
          </Select>
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
            Add Activity
          </Button>
        </div>
      </div>

      <Table
        dataSource={commits}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

     <Modal
        title="Record Commit Activity"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAddCommit} style={{ marginTop: 16 }}>
          <Form.Item
            name="repositoryId"
            label="Target Repository"
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
            name="message"
            label="Commit Message"
            rules={[{ required: true, message: 'Please enter commit message' }]}
          >
            <Input placeholder="e.g. fix: race condition in socket consumer" />
          </Form.Item>
          <Form.Item name="commitHash" label="Commit SHA">
            <Input placeholder="Optional (e.g. 9b7c84e)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CommitActivity;