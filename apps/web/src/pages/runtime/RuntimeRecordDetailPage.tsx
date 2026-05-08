import { Alert, Button, Card, Descriptions, Skeleton, Space, Tag, Typography, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { RuntimeRecord } from "@lowcode/api-client";
import type { RuntimeField, RuntimeModelStub } from "@lowcode/runtime-contracts";

import { runtimeApi } from "../../services/runtimeApi";

const { Paragraph, Title } = Typography;

const displayValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "-";
  }
  if (value === undefined || value === null || value === "") {
    return "-";
  }
  return String(value);
};

export function RuntimeRecordDetailPage() {
  const { appId, entityKey, recordId } = useParams();
  const [model, setModel] = useState<RuntimeModelStub>();
  const [record, setRecord] = useState<RuntimeRecord>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!appId || !entityKey || !recordId) {
      return;
    }

    Promise.all([runtimeApi.getRuntimeModel(appId), runtimeApi.getRuntimeRecord(appId, entityKey, recordId)])
      .then(([modelResponse, recordResponse]) => {
        if (!modelResponse.success || !modelResponse.data) {
          setError(modelResponse.message);
          return;
        }
        if (!recordResponse.success || !recordResponse.data) {
          setError(recordResponse.message);
          return;
        }
        setModel(modelResponse.data);
        setRecord(recordResponse.data);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "记录详情加载失败");
      })
      .finally(() => setLoading(false));
  }, [appId, entityKey, recordId]);

  const entity = useMemo(() => model?.entities?.find((item) => item.entityKey === entityKey), [entityKey, model?.entities]);

  const handleSubmit = async () => {
    if (!appId || !entityKey || !recordId || !record) {
      return;
    }

    setSubmitting(true);
    setError(undefined);
    try {
      const response = await runtimeApi.submitRuntimeRecord(appId, entityKey, recordId, {
        recordVersion: record.recordVersion,
        idempotencyKey: `submit_${record.recordId}_${record.recordVersion}`
      });
      if (response.success) {
        message.success("已提交审批，可在任务中心查看待办");
        const latest = await runtimeApi.getRuntimeRecord(appId, entityKey, recordId);
        if (latest.success && latest.data) {
          setRecord(latest.data);
        }
        return;
      }
      setError(response.message);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "提交审批失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-stack">
      <div className="page-heading">
        <div>
          <Title level={2}>{entity?.entityName ?? "记录详情"}</Title>
          <Paragraph type="secondary">详情由 RuntimeModel 字段定义驱动，提交审批携带 recordVersion 和幂等键。</Paragraph>
        </div>
        <Space wrap>
          {appId && entityKey ? <Link to={`/runtime/apps/${appId}/entities/${entityKey}/list`}><Button>返回列表</Button></Link> : null}
          {appId && entityKey && recordId ? <Link to={`/runtime/apps/${appId}/entities/${entityKey}/${recordId}/edit`}><Button>编辑</Button></Link> : null}
          <Button type="primary" loading={submitting} disabled={!record || record.workflowStatus === "in_approval"} onClick={() => void handleSubmit()}>
            提交审批
          </Button>
        </Space>
      </div>

      {error ? <Alert type="error" message={error} showIcon /> : null}
      <Card>
        {loading ? <Skeleton active /> : null}
        {!loading && record && entity ? (
          <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
            {entity.fields.map((field: RuntimeField) => (
              <Descriptions.Item key={field.fieldKey} label={field.fieldName}>
                {displayValue(record.data[field.fieldKey])}
              </Descriptions.Item>
            ))}
            <Descriptions.Item label="记录版本">{record.recordVersion}</Descriptions.Item>
            <Descriptions.Item label="业务状态"><Tag>{record.businessStatus}</Tag></Descriptions.Item>
            <Descriptions.Item label="流程状态"><Tag>{record.workflowStatus}</Tag></Descriptions.Item>
            <Descriptions.Item label="快照">{record.snapshotId}</Descriptions.Item>
          </Descriptions>
        ) : null}
      </Card>
    </section>
  );
}
