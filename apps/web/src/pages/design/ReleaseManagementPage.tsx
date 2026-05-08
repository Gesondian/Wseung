import { Alert, Card, Empty, Skeleton, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { ReleaseRecord } from "@lowcode/api-client";

import { opsApi } from "../../services/opsApi";

const { Paragraph, Title } = Typography;

export function ReleaseManagementPage() {
  const { appId } = useParams();
  const [releases, setReleases] = useState<ReleaseRecord[]>([]);
  const [loading, setLoading] = useState(Boolean(appId));
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!appId) {
      return;
    }

    opsApi
      .listReleases(appId)
      .then((response) => {
        if (response.success && response.data) {
          setReleases(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "发布记录加载失败");
      })
      .finally(() => setLoading(false));
  }, [appId]);

  const columns: ColumnsType<ReleaseRecord> = [
    { title: "版本", dataIndex: "versionName", key: "versionName" },
    { title: "快照", dataIndex: "snapshotId", key: "snapshotId" },
    {
      title: "状态",
      key: "status",
      render: (_, record) => <Tag color={record.status === "published" ? "success" : "default"}>{record.status}</Tag>
    },
    { title: "发布人", dataIndex: "publisherName", key: "publisherName" },
    { title: "发布时间", dataIndex: "publishedAt", key: "publishedAt" },
    { title: "变更摘要", dataIndex: "changeSummary", key: "changeSummary" }
  ];

  return (
    <section className="page-stack">
      <div>
        <Title level={2}>发布管理</Title>
        <Paragraph type="secondary">当前为发布记录 Mock 展示，真实发布、校验、回滚后续接后端服务。</Paragraph>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      <Card>
        {loading ? <Skeleton active /> : null}
        {!loading && releases.length === 0 ? <Empty description="暂无发布记录" /> : null}
        {!loading && releases.length > 0 ? <Table rowKey="releaseId" columns={columns} dataSource={releases} pagination={false} /> : null}
      </Card>
    </section>
  );
}
