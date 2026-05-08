import { Alert, Card, Empty, Skeleton, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { PermissionRoleMatrix } from "../../services/designApi";
import { designApi } from "../../services/designApi";

const { Paragraph, Title, Text } = Typography;

export function PermissionDesignerPage() {
  const { appId } = useParams();
  const [matrix, setMatrix] = useState<PermissionRoleMatrix[]>([]);
  const [loading, setLoading] = useState(Boolean(appId));
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!appId) {
      return;
    }

    designApi
      .listPermissionMatrix(appId)
      .then((response) => {
        if (response.success && response.data) {
          setMatrix(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "权限设计加载失败");
      })
      .finally(() => setLoading(false));
  }, [appId]);

  const columns: ColumnsType<PermissionRoleMatrix> = [
    { title: "角色", dataIndex: "roleName", key: "roleName" },
    {
      title: "字段可见",
      key: "fieldVisible",
      render: (_, record) => <Text>{record.fieldVisible.length} 个字段</Text>
    },
    {
      title: "字段可编辑",
      key: "fieldEditable",
      render: (_, record) => <Text>{record.fieldEditable.length} 个字段</Text>
    },
    {
      title: "动作权限",
      key: "actions",
      render: (_, record) => (
        <Space size={4} wrap>
          {record.actions.map((action) => (
            <Tag key={action}>{action}</Tag>
          ))}
        </Space>
      )
    }
  ];

  return (
    <section className="page-stack">
      <div>
        <Title level={2}>权限设计</Title>
        <Paragraph type="secondary">当前展示角色、字段和动作权限 Mock 矩阵；真实后端仍是最终鉴权权威。</Paragraph>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      {loading ? <Skeleton active /> : null}
      {!loading && matrix.length === 0 ? <Empty description="权限配置不存在" /> : null}
      {matrix.length > 0 ? (
        <Card title="角色权限矩阵">
          <Table rowKey="roleKey" columns={columns} dataSource={matrix} pagination={false} />
        </Card>
      ) : null}
    </section>
  );
}
