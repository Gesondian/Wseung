import { Card, Col, Row, Statistic, Typography } from "antd";

const { Paragraph, Title } = Typography;

export function DashboardPage() {
  return (
    <section className="page-stack">
      <div>
        <Title level={2}>工作台</Title>
        <Paragraph type="secondary">当前是前端 Mock 演示阶段，用于验证路由、会话和样板应用入口。</Paragraph>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="样板应用" value={3} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Mock 待办" value={1} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="当前阶段" value="P7 Mock" />
          </Card>
        </Col>
      </Row>
    </section>
  );
}
