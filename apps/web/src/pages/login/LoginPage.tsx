import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "../../services/authApi";
import { saveSession } from "../../stores/authStore";

const { Paragraph, Title, Text } = Typography;

interface LoginFormValues {
  loginIdentifier: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleFinish(values: LoginFormValues) {
    setLoading(true);
    setError(undefined);

    const response = await authApi.login(values.loginIdentifier, values.password);
    setLoading(false);

    if (!response.success || !response.data) {
      setError(response.message);
      return;
    }

    saveSession({ accessToken: response.data.accessToken, user: response.data.user });
    navigate("/apps", { replace: true });
  }

  return (
    <Card className="login-card" bordered>
      <Title level={2}>企业级低代码平台 P0</Title>
      <Paragraph type="secondary">使用 Mock 账号登录后进入应用中心。</Paragraph>
      {error ? <Alert className="form-alert" type="error" message={error} showIcon /> : null}
      <Form<LoginFormValues>
        layout="vertical"
        initialValues={{ loginIdentifier: "admin", password: "admin123" }}
        onFinish={handleFinish}
      >
        <Form.Item label="账号" name="loginIdentifier" rules={[{ required: true, message: "请输入账号" }]}>
          <Input prefix={<UserOutlined />} autoComplete="username" />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
          <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          登录
        </Button>
      </Form>
      <Text className="login-hint" type="secondary">
        Mock 账号：admin / admin123
      </Text>
    </Card>
  );
}
