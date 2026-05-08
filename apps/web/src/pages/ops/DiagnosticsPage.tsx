import { Alert, Card, Col, Row, Skeleton, Statistic, Tag, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";

import type { DiagnosticCheckItem } from "@lowcode/api-client";

import { opsApi } from "../../services/opsApi";

const { Paragraph, Title } = Typography;

const statusColor: Record<DiagnosticCheckItem["status"], string> = {
  pass: "success",
  warning: "warning",
  failed: "error"
};

export function DiagnosticsPage() {
  const [items, setItems] = useState<DiagnosticCheckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    opsApi
      .listDiagnostics()
      .then((response) => {
        if (response.success && response.data) {
          setItems(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "诊断结果加载失败");
      })
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      pass: items.filter((item) => item.status === "pass").length,
      warning: items.filter((item) => item.status === "warning").length,
      failed: items.filter((item) => item.status === "failed").length
    }),
    [items]
  );

  return (
    <section className="page-stack">
      <div>
        <Title level={2}>诊断与一致性巡检</Title>
        <Paragraph type="secondary">Mock 检查运行指针、快照、附件绑定和业务索引一致性；本阶段不做自动修复。</Paragraph>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card><Statistic title="通过" value={counts.pass} /></Card>
        </Col>
        <Col xs={24} md={8}>
          <Card><Statistic title="警告" value={counts.warning} /></Card>
        </Col>
        <Col xs={24} md={8}>
          <Card><Statistic title="失败" value={counts.failed} /></Card>
        </Col>
      </Row>
      {loading ? <Card><Skeleton active /></Card> : null}
      {!loading ? (
        <Row gutter={[16, 16]}>
          {items.map((item) => (
            <Col xs={24} md={12} key={item.itemKey}>
              <Card title={item.itemName} extra={<Tag color={statusColor[item.status]}>{item.status}</Tag>}>
                <Paragraph>{item.message}</Paragraph>
                <Typography.Text type="secondary">{item.checkedAt}</Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      ) : null}
    </section>
  );
}
