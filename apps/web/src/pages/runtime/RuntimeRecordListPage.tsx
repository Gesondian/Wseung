import { Alert, Button, Card, Empty, Skeleton, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { RuntimeRecord } from "@lowcode/api-client";
import type { RuntimeField, RuntimeModelStub } from "@lowcode/runtime-contracts";

import { runtimeApi } from "../../services/runtimeApi";

const { Paragraph, Title } = Typography;

export function RuntimeRecordListPage() {
  const { appId, entityKey } = useParams();
  const [model, setModel] = useState<RuntimeModelStub>();
  const [records, setRecords] = useState<RuntimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!appId || !entityKey) {
      return;
    }

    Promise.all([runtimeApi.getRuntimeModel(appId), runtimeApi.listRuntimeRecords(appId, entityKey)])
      .then(([modelResponse, recordsResponse]) => {
        if (!modelResponse.success || !modelResponse.data) {
          setError(modelResponse.message);
          return;
        }
        if (!recordsResponse.success || !recordsResponse.data) {
          setError(recordsResponse.message);
          return;
        }

        setModel(modelResponse.data);
        setRecords(recordsResponse.data.items);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "运行态列表加载失败");
      })
      .finally(() => setLoading(false));
  }, [appId, entityKey]);

  const entity = model?.entities?.find((item) => item.entityKey === entityKey);
  const view = model?.views?.find((item) => item.entityKey === entityKey);

  const columns = useMemo<ColumnsType<RuntimeRecord>>(() => {
    const fields = entity?.fields ?? [];
    const columnKeys = view?.columns ?? fields.map((field) => field.fieldKey);
    const visibleColumns = columnKeys
      .map((fieldKey: string) => fields.find((field: RuntimeField) => field.fieldKey === fieldKey))
      .filter((field): field is RuntimeField => Boolean(field));

    return [
      ...visibleColumns.map((field: RuntimeField) => ({
        title: field.fieldName,
        key: field.fieldKey,
        render: (_: unknown, record: RuntimeRecord) => String(record.data[field.fieldKey] ?? "-")
      })),
      {
        title: "流程状态",
        key: "workflowStatus",
        render: (_: unknown, record) => <Tag>{record.workflowStatus}</Tag>
      },
      {
        title: "版本",
        dataIndex: "recordVersion",
        key: "recordVersion",
        width: 88
      }
    ];
  }, [entity?.fields, view?.columns]);

  return (
    <section className="page-stack">
      <div>
        <div className="page-heading">
          <div>
            <Title level={2}>{view?.viewName ?? entity?.entityName ?? "运行态列表"}</Title>
            <Paragraph type="secondary">当前列表由 RuntimeModel 字段与视图配置驱动，非样板应用专属页面。</Paragraph>
          </div>
          {appId && entityKey ? (
            <Link to={`/runtime/apps/${appId}/entities/${entityKey}/new`}>
              <Button type="primary">新建记录</Button>
            </Link>
          ) : null}
        </div>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      <Card>
        {loading ? <Skeleton active /> : null}
        {!loading && records.length === 0 ? <Empty description="暂无记录" /> : null}
        {!loading && records.length > 0 ? <Table rowKey="recordId" columns={[...columns, {
          title: "操作",
          key: "actions",
          width: 160,
          render: (_, record) => (
            <Space>
              <Link to={`/runtime/apps/${record.appId}/entities/${record.entityKey}/${record.recordId}`}>详情</Link>
              <Link to={`/runtime/apps/${record.appId}/entities/${record.entityKey}/${record.recordId}/edit`}>编辑</Link>
            </Space>
          )
        }]} dataSource={records} pagination={{ pageSize: 10 }} /> : null}
      </Card>
    </section>
  );
}
