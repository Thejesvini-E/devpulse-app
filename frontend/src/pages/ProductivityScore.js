import React, { useState, useEffect } from 'react';
import { Table, Card, Row, Col, Statistic, Tag, Alert, message } from 'antd';
import { useSelector } from 'react-redux';
import {
  TrophyOutlined,
  BranchesOutlined,
  PullRequestOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import api from '../services/api';

const ProductivityScore = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const isPrivileged = user && (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_MANAGER');

  useEffect(() => {
    const fetchProductivity = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const endpoint = isPrivileged ? '/productivity/all' : '/productivity/me';
        const res = await api.get(endpoint);
        setData(res.data);
      } catch (err) {
        const status = err.response?.status;
        const errorMessage = status === 401
          ? 'Your session has expired. Sign in again to load productivity metrics.'
          : status === 403
            ? 'Your account does not have permission to view these productivity metrics.'
            : err.response?.data?.message ||
              (err.response
                ? 'The server could not load productivity metrics. Please try again.'
                : 'Cannot reach the server. Check that the backend is running and try again.');
        setData(null);
        setLoadError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProductivity();
  }, [isPrivileged]);

  if (isPrivileged) {
    const columns = [
      {
        title: 'Rank',
        key: 'rank',
        width: 70,
        render: (_, __, idx) => (
          <Tag color={idx === 0 ? 'gold' : idx === 1 ? 'cyan' : 'default'}>
            #{idx + 1}
          </Tag>
        )
      },
      {
        title: 'Developer',
        dataIndex: 'fullName',
        key: 'fullName',
        render: (name, rec) => (
          <div>
            <div style={{ fontWeight: 700, color: '#f8fafc' }}>{name}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>@{rec.username}</div>
          </div>
        )
      },
      {
        title: 'Commits (40%)',
        dataIndex: 'commits',
        key: 'commits',
        sorter: (a, b) => a.commits - b.commits
      },
      {
        title: 'Merged PRs (40%)',
        dataIndex: 'mergedPrs',
        key: 'mergedPrs',
        sorter: (a, b) => a.mergedPrs - b.mergedPrs
      },
      {
        title: 'Resolved Issues (20%)',
        dataIndex: 'resolvedIssues',
        key: 'resolvedIssues',
        sorter: (a, b) => a.resolvedIssues - b.resolvedIssues
      },
      {
        title: 'Total Score',
        dataIndex: 'totalScore',
        key: 'totalScore',
        sorter: (a, b) => a.totalScore - b.totalScore,
        render: (score) => (
          <Tag
            color="purple"
            style={{ fontWeight: 800, fontSize: 13, padding: '4px 10px', borderRadius: 8 }}
          >
            {Number(score).toFixed(1)} pts
          </Tag>
        )
      }
    ];

    return (
      <div className="devpulse-glass-card" style={{ padding: 28 }}>
        {loadError && <Alert type="error" showIcon message={loadError} style={{ marginBottom: 16 }} />}
        {!loadError && Array.isArray(data) && data.length === 0 && (
          <Alert
            type="info"
            showIcon
            message="No developer activity has been recorded yet. Scores use recorded commits, merged pull requests, and closed assigned issues."
            style={{ marginBottom: 16 }}
          />
        )}
        {!loadError && Array.isArray(data) && data.length > 0 && data.every((entry) =>
          !Number(entry.commits) && !Number(entry.mergedPrs) && !Number(entry.resolvedIssues)
        ) && (
          <Alert
            type="info"
            showIcon
            message="All developer scores are zero because no matching activity has been recorded yet."
            style={{ marginBottom: 16 }}
          />
        )}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc' }}>
            Engineering Leaderboard
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 13 }}>
            Cumulative productivity score: 40% Commits + 40% Merged PRs + 20% Resolved Issues
          </p>
        </div>
        <Table
          dataSource={Array.isArray(data) ? data : []}
          columns={columns}
          rowKey="username"
          loading={loading}
        />
      </div>
    );
  }

  // Developer view
  return (
    <div>
      {loadError && <Alert type="error" showIcon message={loadError} style={{ marginBottom: 16 }} />}
      {!loadError && data && !Number(data.commits) && !Number(data.mergedPrs) && !Number(data.resolvedIssues) && (
        <Alert
          type="info"
          showIcon
          message="No tracked activity yet. Metrics count commits, merged pull requests, and closed issues assigned to you."
          style={{ marginBottom: 16 }}
        />
      )}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>
          Personal Performance Index
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>
          Live breakdown of your engineering velocity and contribution impact
        </p>
      </div>

      <Row gutter={[20, 20]}>
        <Col span={6}>
          <Card
            className="devpulse-glass-card"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(17, 24, 39, 0.8) 100%)',
              borderColor: 'rgba(99, 102, 241, 0.4)'
            }}
          >
            <Statistic
              title={<span style={{ color: '#cbd5e1' }}>Overall Score</span>}
              value={data?.totalScore || 0}
              precision={1}
              prefix={<TrophyOutlined style={{ color: '#a855f7' }} />}
              valueStyle={{ color: '#f8fafc', fontWeight: 800, fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="devpulse-glass-card">
            <Statistic
              title={<span style={{ color: '#cbd5e1' }}>Commits</span>}
              value={data?.commits || 0}
              prefix={<BranchesOutlined style={{ color: '#38bdf8' }} />}
              valueStyle={{ color: '#f8fafc', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="devpulse-glass-card">
            <Statistic
              title={<span style={{ color: '#cbd5e1' }}>Merged PRs</span>}
              value={data?.mergedPrs || 0}
              prefix={<PullRequestOutlined style={{ color: '#34d399' }} />}
              valueStyle={{ color: '#f8fafc', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="devpulse-glass-card">
            <Statistic
              title={<span style={{ color: '#cbd5e1' }}>Resolved Issues</span>}
              value={data?.resolvedIssues || 0}
              prefix={<CheckCircleOutlined style={{ color: '#fbbf24' }} />}
              valueStyle={{ color: '#f8fafc', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductivityScore;
