import { ArrowLeftOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Layout, Space, Typography } from "antd";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";

import { clearSession, getStoredSession } from "../stores/authStore";

const { Header, Content } = Layout;
const { Text } = Typography;

export function RuntimeShell() {
  const navigate = useNavigate();
  const session = getStoredSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout className="shell">
      <Header className="shell-header">
        <Space className="runtime-header">
          <Link to="/apps">
            <Button icon={<ArrowLeftOutlined />}>应用中心</Button>
          </Link>
          <Text strong>运行态</Text>
        </Space>
        <Button
          icon={<LogoutOutlined />}
          onClick={() => {
            clearSession();
            navigate("/login", { replace: true });
          }}
        >
          退出
        </Button>
      </Header>
      <Content className="shell-content">
        <Outlet />
      </Content>
    </Layout>
  );
}
