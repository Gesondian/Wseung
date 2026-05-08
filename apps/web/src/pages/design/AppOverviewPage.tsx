import { Alert, Button, Card, Col, Descriptions, Empty, Row, Skeleton, Space, Statistic, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { DesignAppOverview } from "../../services/designApi";
import { designApi } from "../../services/designApi";

const { Paragraph, Title } = Typography;

export function AppOverviewPage() {
  const { appId } = useParams();
  const [overview, setOverview] = useState<DesignAppOverview>();
  const [loading, setLoading] = useState(Boolean(appId));
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!appId) {
      return;
    }

    designApi
      .getOverview(appId)
      .then((response) => {
        if (response.success && response.data) {
          setOverview(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "应用概览加载失败");
      })
      .finally(() => setLoading(false));
  }, [appId]);

  return (
    <section className="page-stack">
      <div className="page-heading">
        <div>
          <Title level={2}>{overview?.appName ?? "应用概览"}</Title>
          <Paragraph type="secondary">设计态读取 Mock 元数据草稿视图，运行态仍以已发布 RuntimeModel 为准。</Paragraph>
        </div>
        {appId ? (
          <Space wrap>
            <Link to={`/runtime/apps/${appId}`}>
              <Button type="primary">运行态预览</Button>
            </Link>
            <Link to={`/apps/${appId}/releases`}>
              <Button>发布管理</Button>
            </Link>
          </Space>
        ) : null}
      </div>

      {error ? <Alert type="error" message={error} showIcon /> : null}
      {loading ? <Skeleton active /> : null}
      {!loading && !overview ? <Empty description="应用概览不存在" /> : null}

      {overview ? (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} xl={6}>
              <Card>
                <Statistic title="实体数量" value={overview.entityCount} />
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card>
                <Statistic title="字段数量" value={overview.fieldCount} />
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card>
                <Statistic title="视图数量" value={overview.viewCount} />
              </Card>
            </Col>
            <Col xs={24} md={12} xl={6}>
              <Card>
                <Statistic title="动作数量" value={overview.actionCount} />
              </Card>
            </Col>
          </Row>

          <Card title="设计态摘要">
            <Descriptions column={{ xs: 1, md: 2 }} bordered size="small">
              <Descriptions.Item label="应用 ID">{overview.appId}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={overview.status === "published" ? "success" : "processing"}>{overview.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="默认对象">{overview.defaultEntityKey}</Descriptions.Item>
              <Descriptions.Item label="当前快照">{overview.snapshotId}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Row gutter={[16, 16]}>
            {[
              { title: "数据模型", path: "models", text: "查看实体、字段和索引字段配置。" },
              { title: "表单设计", path: "forms", text: "查看字段画布、分组和属性面板。" },
              { title: "流程设计", path: "workflows", text: "查看审批节点、条件分支和处理人规则。" },
              { title: "权限设计", path: "permissions", text: "查看角色、字段权限和动作权限矩阵。" }
            ].map((item) => (
              <Col xs={24} md={12} key={item.path}>
                <Card title={item.title} actions={[<Link key="open" to={`/apps/${overview.appId}/${item.path}`}>打开</Link>]}>
                  <Paragraph>{item.text}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : null}
    </section>
  );
}
