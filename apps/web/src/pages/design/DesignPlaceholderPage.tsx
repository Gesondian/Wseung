import { Alert, Button, Card, Space, Typography } from "antd";
import { Link, useParams } from "react-router-dom";

const { Paragraph, Title, Text } = Typography;

export function DesignPlaceholderPage() {
  const { appId } = useParams();

  return (
    <section className="page-stack">
      <Title level={2}>应用设计态工作台</Title>
      <Alert
        type="info"
        showIcon
        message="当前仅开放设计态入口占位"
        description="如果你看到这个页面，说明当前路由尚未接入具体设计态页面。Phase 16 已补应用概览、数据模型、表单、流程和权限页面。"
      />
      <Card>
        <Space direction="vertical">
          <Text strong>当前应用</Text>
          <Paragraph>{appId}</Paragraph>
          <Link to={`/runtime/apps/${appId}`}>
            <Button type="primary">进入运行态预览</Button>
          </Link>
        </Space>
      </Card>
    </section>
  );
}
