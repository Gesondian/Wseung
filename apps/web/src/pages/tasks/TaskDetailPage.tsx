import { Alert, Button, Card, Descriptions, Form, Input, Skeleton, Space, Tag, Timeline, Typography, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { WorkflowTaskDetail } from "@lowcode/api-client";
import type { RuntimeField } from "@lowcode/runtime-contracts";

import { workflowApi } from "../../services/workflowApi";

const { Paragraph, Title } = Typography;

type ActionType = "approve" | "reject";

export function TaskDetailPage() {
  const { taskId } = useParams();
  const [form] = Form.useForm<{ opinion: string }>();
  const [detail, setDetail] = useState<WorkflowTaskDetail>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<ActionType>();
  const [error, setError] = useState<string>();

  const loadDetail = () => {
    if (!taskId) {
      return;
    }

    setLoading(true);
    setError(undefined);
    workflowApi
      .getWorkflowTask(taskId)
      .then((response) => {
        if (response.success && response.data) {
          setDetail(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "审批详情加载失败");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!taskId) {
      return;
    }

    workflowApi
      .getWorkflowTask(taskId)
      .then((response) => {
        if (response.success && response.data) {
          setDetail(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "审批详情加载失败");
      })
      .finally(() => setLoading(false));
  }, [taskId]);

  const entity = useMemo(() => {
    if (!detail) {
      return undefined;
    }
    return detail.runtimeModel.entities?.find((item) => item.entityKey === detail.record.entityKey);
  }, [detail]);

  const handleAction = async (actionType: ActionType) => {
    if (!taskId || !detail) {
      return;
    }

    try {
      const { opinion } = await form.validateFields();
      setSubmitting(actionType);

      const request = {
        taskVersion: detail.task.taskVersion,
        workflowInstanceId: detail.task.workflowInstanceId,
        recordId: detail.record.recordId,
        recordVersion: detail.record.recordVersion,
        snapshotId: detail.record.snapshotId,
        opinion,
        idempotencyKey: `${actionType}_${detail.task.taskId}_${detail.task.taskVersion}`
      };
      const response =
        actionType === "approve" ? await workflowApi.approveTask(taskId, request) : await workflowApi.rejectTask(taskId, request);

      if (response.success && response.data) {
        setDetail(response.data);
        form.resetFields();
        message.success(actionType === "approve" ? "已审批通过" : "已驳回");
        return;
      }

      setError(response.message);
      if (response.code === "VERSION_CONFLICT_TASK" || response.code === "TASK_ALREADY_COMPLETED") {
        loadDetail();
      }
    } catch (reason: unknown) {
      if (reason instanceof Error) {
        setError(reason.message);
      }
    } finally {
      setSubmitting(undefined);
    }
  };

  const renderRecordDetails = () => {
    if (!detail || !entity) {
      return null;
    }

    return (
      <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
        {entity.fields.map((field: RuntimeField) => (
          <Descriptions.Item key={field.fieldKey} label={field.fieldName}>
            {String(detail.record.data[field.fieldKey] ?? "-")}
          </Descriptions.Item>
        ))}
        <Descriptions.Item label="记录版本">{detail.record.recordVersion}</Descriptions.Item>
        <Descriptions.Item label="流程状态">
          <Tag>{detail.record.workflowStatus}</Tag>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const canSubmit = detail?.task.status === "todo";

  return (
    <section className="page-stack">
      <div className="page-heading">
        <div>
          <Title level={2}>审批详情</Title>
          <Paragraph type="secondary">审批动作携带 taskVersion、recordVersion、snapshotId 和幂等键。</Paragraph>
        </div>
        <Button>
          <Link to="/tasks/todo">返回任务中心</Link>
        </Button>
      </div>

      {error ? <Alert type="error" message={error} showIcon /> : null}
      {loading ? <Card><Skeleton active /></Card> : null}

      {!loading && detail ? (
        <>
          <Card title={detail.task.taskName}>
            <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
              <Descriptions.Item label="应用">{detail.task.appName}</Descriptions.Item>
              <Descriptions.Item label="申请人">{detail.task.applicantName}</Descriptions.Item>
              <Descriptions.Item label="当前处理人">{detail.task.assigneeName}</Descriptions.Item>
              <Descriptions.Item label="任务版本">{detail.task.taskVersion}</Descriptions.Item>
              <Descriptions.Item label="任务状态">
                <Tag color={detail.task.status === "todo" ? "processing" : "success"}>{detail.task.status === "todo" ? "待办" : "已完成"}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="快照">{detail.task.snapshotId}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="业务记录详情">{renderRecordDetails()}</Card>

          <Card title="审批意见">
            <Form form={form} layout="vertical" initialValues={{ opinion: "同意" }}>
              <Form.Item name="opinion" label="处理意见" rules={[{ required: true, message: "请输入处理意见" }]}>
                <Input.TextArea rows={4} disabled={!canSubmit} />
              </Form.Item>
              <Space wrap>
                <Button type="primary" loading={submitting === "approve"} disabled={!canSubmit} onClick={() => void handleAction("approve")}>
                  同意
                </Button>
                <Button danger loading={submitting === "reject"} disabled={!canSubmit} onClick={() => void handleAction("reject")}>
                  驳回
                </Button>
                {!canSubmit ? <Tag color="success">任务已处理</Tag> : null}
              </Space>
            </Form>
          </Card>

          <Card title="流程轨迹">
            <Timeline
              items={detail.traces.map((trace) => ({
                color: trace.actionType === "reject" ? "red" : trace.actionType === "approve" ? "green" : "blue",
                children: (
                  <Space direction="vertical" size={2}>
                    <Typography.Text strong>{trace.nodeName}</Typography.Text>
                    <Typography.Text>{trace.operatorName}：{trace.opinion}</Typography.Text>
                    <Typography.Text type="secondary">{trace.createdAt}</Typography.Text>
                  </Space>
                )
              }))}
            />
          </Card>
        </>
      ) : null}
    </section>
  );
}
