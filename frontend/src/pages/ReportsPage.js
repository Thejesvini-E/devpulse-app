import React, { useState, useEffect } from 'react';
import { Tabs, Button, Tag, Row, Col, Card } from 'antd';
import { DownloadOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import api from '../services/api';

const ReportsPage = () => {
  const [teamReports, setTeamReports] = useState([]);
  const [repoReports, setRepoReports] = useState([]);
  const [activityReports, setActivityReports] = useState([]);

  useEffect(() => {
    api.get('/reports/team').then((res) => setTeamReports(res.data)).catch(() => {});
    api.get('/reports/repository').then((res) => setRepoReports(res.data)).catch(() => {});
    api.get('/reports/activity').then((res) => setActivityReports(res.data)).catch(() => {});
  }, []);

  const renderReportCards = (reports) => (
    <Row gutter={[16, 16]}>
      {reports.map((item) => (
        <Col span={24} key={item.id}>
          <Card
            className="devpulse-panel"
            style={{ padding: '8px 12px' }}
            actions={[
              <Button key="pdf" type="link" icon={<DownloadOutlined />}>
                Download PDF
              </Button>,
              <Button key="view" type="link" icon={<EyeOutlined />}>
                View Details
              </Button>
            ]}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FileTextOutlined style={{ color: '#818cf8', fontSize: 18 }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                    {item.reportType} Report
                  </h3>
                  <span style={{ color: '#64748b', fontSize: 12 }}>
                    Generated: {item.generatedAt ? new Date(item.generatedAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
              <Tag color="purple">{item.reportType}</Tag>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {item.summary}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const items = [
    { key: 'team', label: 'Team Reports', children: renderReportCards(teamReports) },
    { key: 'repo', label: 'Repository Reports', children: renderReportCards(repoReports) },
    { key: 'activity', label: 'Activity Reports', children: renderReportCards(activityReports) }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
          Executive Analytics & Audit Reports
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>
          Automated performance summaries, platform coverage, and pull request audits
        </p>
      </div>

      <Tabs defaultActiveKey="team" items={items} />
    </div>
  );
};

export default ReportsPage;