import { Alert, Card, Empty, Skeleton, Space, Steps, Tag, Timeline, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { WorkflowNode } from "../../services/designApi";
import { designApi } from "../../services/designApi";

const { Paragraph, Title, Text } = Typography;

const nodeTypeText: Record<WorkflowNode["nodeType"], string> = {
  start: "开始",
  approval: "审批",
  condition: "条件",
  end: "结束"
};

export function WorkflowDesignerPage() {
  const { appId } = useParams();
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [loading, setLoading] = useState(Boolean(appId));
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!appId) {
      return;
    }

    designApi
      .listWorkflowNodes(appId)
      .then((response) => {
        if (response.success && response.data) {
          setNodes(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "流程设计加载失败");
      })
      .finally(() => setLoading(false));
  }, [appId]);

  return (
    <section className="page-stack">
      <div>
        <Title level={2}>流程设计</Title>
        <Paragraph type="secondary">当前仅展示 P0 审批流 Mock 节点，不实现完整 BPMN 画布。</Paragraph>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      {loading ? <Skeleton active /> : null}
      {!loading && nodes.length === 0 ? <Empty description="流程配置不存在" /> : null}
      {nodes.length > 0 ? (
        <>
          <Card title="流程主线">
            <Steps
              current={nodes.findIndex((node) => node.status === "pending")}
              items={nodes.map((node) => ({
                title: node.nodeName,
                description: nodeTypeText[node.nodeType],
                status: node.status === "pending" ? "process" : "finish"
              }))}
            />
          </Card>
          <Card title="节点配置">
            <Timeline
              items={nodes.map((node) => ({
                color: node.status === "configured" ? "green" : "blue",
                children: (
                  <Space direction="vertical" size={4}>
                    <Space wrap>
                      <Text strong>{node.nodeName}</Text>
                      <Tag>{nodeTypeText[node.nodeType]}</Tag>
                      <Tag color={node.status === "configured" ? "success" : "processing"}>{node.status}</Tag>
                    </Space>
                    <Text type="secondary">处理人规则：{node.assigneeRule}</Text>
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
