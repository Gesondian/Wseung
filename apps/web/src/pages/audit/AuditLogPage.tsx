import { Alert, Card, Skeleton, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

import type { AuditLogSummary } from "@lowcode/api-client";

import { opsApi } from "../../services/opsApi";

const { Paragraph, Title } = Typography;

export function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    opsApi
      .listAuditLogs()
      .then((response) => {
        if (response.success && response.data) {
          setLogs(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "审计日志加载失败");
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnsType<AuditLogSummary> = [
    { title: "操作", dataIndex: "action", key: "action" },
    { title: "资源类型", dataIndex: "resourceType", key: "resourceType" },
    { title: "资源", dataIndex: "resourceName", key: "resourceName" },
    { title: "操作人", dataIndex: "operatorName", key: "operatorName" },
    {
      title: "结果",
      key: "result",
      render: (_, log) => <Tag color={log.result === "success" ? "success" : "error"}>{log.result}</Tag>
    },
    { title: "时间", dataIndex: "occurredAt", key: "occurredAt" },
    { title: "请求 ID", dataIndex: "requestId", key: "requestId" }
  ];

  return (
    <section className="page-stack">
      <div>
        <Title level={2}>审计日志</Title>
        <Paragraph type="secondary">展示关键发布、审批、文件访问等 Mock 审计事件；敏感字段不在列表中展示。</Paragraph>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      <Card>{loading ? <Skeleton active /> : <Table rowKey="logId" columns={columns} dataSource={logs} pagination={{ pageSize: 10 }} />}</Card>
    </section>
  );
}
