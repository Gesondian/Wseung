import { Alert, Card, Empty, Skeleton, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import type { RuntimeEntity, RuntimeField, RuntimeModelStub } from "@lowcode/runtime-contracts";

import { designApi } from "../../services/designApi";

const { Paragraph, Title, Text } = Typography;

export function ModelDesignerPage() {
  const { appId } = useParams();
  const [model, setModel] = useState<RuntimeModelStub>();
  const [loading, setLoading] = useState(Boolean(appId));
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!appId) {
      return;
    }

    designApi
      .getModel(appId)
      .then((response) => {
        if (response.success && response.data) {
          setModel(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "数据模型加载失败");
      })
      .finally(() => setLoading(false));
  }, [appId]);

  const fields = useMemo(
    () =>
      (model?.entities ?? []).flatMap((entity) =>
        entity.fields.map((field) => ({
          ...field,
          entityKey: entity.entityKey,
          entityName: entity.entityName,
          rowKey: `${entity.entityKey}:${field.fieldKey}`
        }))
      ),
    [model]
  );

  const columns: ColumnsType<RuntimeField & { entityKey: string; entityName: string; rowKey: string }> = [
    { title: "实体", dataIndex: "entityName", key: "entityName" },
    { title: "字段名称", dataIndex: "fieldName", key: "fieldName" },
    { title: "字段编码", dataIndex: "fieldKey", key: "fieldKey" },
    {
      title: "类型",
      key: "fieldType",
      render: (_, record) => <Tag>{record.fieldType}</Tag>
    },
    {
      title: "约束",
      key: "constraints",
      render: (_, record) => (
        <Space size={4} wrap>
          {record.required ? <Tag color="red">必填</Tag> : null}
          {record.readonly ? <Tag color="blue">只读</Tag> : null}
          {!record.required && !record.readonly ? <Text type="secondary">-</Text> : null}
        </Space>
      )
    }
  ];

  return (
    <section className="page-stack">
      <div>
        <Title level={2}>数据模型设计</Title>
        <Paragraph type="secondary">当前为 RuntimeModel Mock 的设计态视图，不生成业务对象独立物理表。</Paragraph>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      {loading ? <Skeleton active /> : null}
      {!loading && !model ? <Empty description="数据模型不存在" /> : null}
      {model ? (
        <>
          <Card title="实体清单">
            <Table<RuntimeEntity>
              rowKey="entityKey"
              pagination={false}
              dataSource={model.entities ?? []}
              columns={[
                { title: "实体名称", dataIndex: "entityName", key: "entityName" },
                { title: "实体编码", dataIndex: "entityKey", key: "entityKey" },
                { title: "主展示字段", dataIndex: "primaryFieldKey", key: "primaryFieldKey" },
                { title: "字段数", key: "fieldCount", render: (_, record) => record.fields.length }
              ]}
            />
          </Card>
          <Card title="字段配置">
            <Table rowKey="rowKey" columns={columns} dataSource={fields} pagination={false} />
          </Card>
        </>
      ) : null}
    </section>
  );
}
