import { Alert, Card, Skeleton, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

import type { SecurityEventSummary } from "@lowcode/api-client";

import { opsApi } from "../../services/opsApi";

const { Paragraph, Title } = Typography;

const severityColor: Record<SecurityEventSummary["severity"], string> = {
  low: "blue",
  medium: "orange",
  high: "red"
};

export function SecurityEventPage() {
  const [events, setEvents] = useState<SecurityEventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    opsApi
      .listSecurityEvents()
      .then((response) => {
        if (response.success && response.data) {
          setEvents(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "安全事件加载失败");
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnsType<SecurityEventSummary> = [
    { title: "事件类型", dataIndex: "eventType", key: "eventType" },
    {
      title: "级别",
      key: "severity",
      render: (_, event) => <Tag color={severityColor[event.severity]}>{event.severity}</Tag>
    },
    { title: "主体", dataIndex: "principalName", key: "principalName" },
    { title: "资源", dataIndex: "resourceName", key: "resourceName" },
    {
      title: "状态",
      key: "status",
      render: (_, event) => <Tag color={event.status === "open" ? "warning" : "success"}>{event.status === "open" ? "待处理" : "已处理"}</Tag>
    },
    { title: "时间", dataIndex: "occurredAt", key: "occurredAt" },
    { title: "说明", dataIndex: "description", key: "description" }
  ];

  return (
    <section className="page-stack">
      <div>
        <Title level={2}>安全事件</Title>
        <Paragraph type="secondary">展示文件拒绝、任务版本冲突等 Mock 安全事件，真实落库与处理流后续接后端。</Paragraph>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      <Card>{loading ? <Skeleton active /> : <Table rowKey="eventId" columns={columns} dataSource={events} pagination={{ pageSize: 10 }} />}</Card>
    </section>
  );
}
