import {
  AppstoreOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  SecurityScanOutlined,
  ToolOutlined,
  BranchesOutlined,
  DatabaseOutlined,
  FormOutlined,
  KeyOutlined
} from "@ant-design/icons";
import { Button, Layout, Menu, Space, Typography } from "antd";
import { useMemo } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

import { clearSession, getStoredSession } from "../stores/authStore";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export function MainShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getStoredSession();
  const designAppId = location.pathname.match(/^\/apps\/([^/]+)/)?.[1];
  const selectedKeys = useMemo(() => {
    if (location.pathname.includes("/models")) {
      return ["design-models"];
    }
    if (location.pathname.includes("/forms")) {
      return ["design-forms"];
    }
    if (location.pathname.includes("/workflows")) {
      return ["design-workflows"];
    }
    if (location.pathname.includes("/permissions")) {
      return ["design-permissions"];
    }
    if (location.pathname.startsWith("/apps")) {
      return ["apps"];
    }
    if (location.pathname.startsWith("/tasks")) {
      return ["tasks"];
    }
    if (location.pathname.startsWith("/files")) {
      return ["files"];
    }
    if (location.pathname.startsWith("/audit")) {
      return ["audit"];
    }
    if (location.pathname.startsWith("/security")) {
      return ["security"];
    }
    if (location.pathname.startsWith("/ops")) {
      return ["ops"];
    }
    return ["dashboard"];
  }, [location.pathname]);

  const menuItems = [
    { key: "dashboard", icon: <HomeOutlined />, label: <Link to="/">工作台</Link> },
    { key: "apps", icon: <AppstoreOutlined />, label: <Link to="/apps">应用中心</Link> },
    ...(designAppId
      ? [
          {
            key: "design-models",
            icon: <DatabaseOutlined />,
            label: <Link to={`/apps/${designAppId}/models`}>数据模型</Link>
          },
          {
            key: "design-forms",
            icon: <FormOutlined />,
            label: <Link to={`/apps/${designAppId}/forms`}>表单设计</Link>
          },
          {
            key: "design-workflows",
            icon: <BranchesOutlined />,
            label: <Link to={`/apps/${designAppId}/workflows`}>流程设计</Link>
          },
          {
            key: "design-permissions",
            icon: <KeyOutlined />,
            label: <Link to={`/apps/${designAppId}/permissions`}>权限设计</Link>
          }
        ]
      : []),
    { key: "tasks", icon: <CheckSquareOutlined />, label: <Link to="/tasks/todo">任务中心</Link> },
    { key: "files", icon: <FileTextOutlined />, label: <Link to="/files">文件附件</Link> },
    { key: "audit", icon: <SafetyCertificateOutlined />, label: <Link to="/audit/logs">审计日志</Link> },
    { key: "security", icon: <SecurityScanOutlined />, label: <Link to="/security/events">安全事件</Link> },
    { key: "ops", icon: <ToolOutlined />, label: <Link to="/ops/diagnostics">诊断巡检</Link> }
  ];

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout className="shell">
      <Sider width={224} className="shell-sider">
        <div className="brand">低代码平台 P0</div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="shell-header">
          <Space>
            <Text strong>{session.user.displayName}</Text>
            <Button
              icon={<LogoutOutlined />}
              onClick={() => {
                clearSession();
                navigate("/login", { replace: true });
              }}
            >
              退出
            </Button>
          </Space>
        </Header>
        <Content className="shell-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
