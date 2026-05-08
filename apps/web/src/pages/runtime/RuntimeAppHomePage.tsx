import { Alert, Button, Card, Empty, List, Skeleton, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { RuntimeModelStub } from "@lowcode/runtime-contracts";

import { runtimeApi } from "../../services/runtimeApi";

const { Paragraph, Title, Text } = Typography;

export function RuntimeAppHomePage() {
  const { appId } = useParams();
  const [model, setModel] = useState<RuntimeModelStub>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!appId) {
      return;
    }

    runtimeApi
      .getRuntimeModel(appId)
      .then((response) => {
        if (response.success && response.data) {
          setModel(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "运行态模型加载失败");
      })
      .finally(() => setLoading(false));
  }, [appId]);

  return (
    <section className="page-stack">
      <div>
        <Title level={2}>{model?.appName ?? "运行态应用"}</Title>
        <Paragraph type="secondary">运行态只读取已发布 RuntimeModel Mock，不读取设计态草稿。</Paragraph>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      {loading ? <Skeleton active /> : null}
      {!loading && !model ? <Empty description="运行态模型不存在" /> : null}
      <List
        grid={{ gutter: 16, xs: 1, md: 2, xl: 3 }}
        dataSource={model?.entities ?? []}
        renderItem={(entity) => (
          <List.Item>
            <Card title={entity.entityName}>
              <Space direction="vertical">
                <Text type="secondary">对象编码：{entity.entityKey}</Text>
                <Link to={`/runtime/apps/${model?.appId}/entities/${entity.entityKey}/list`}>
                  <Button type="primary">进入列表</Button>
                </Link>
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </section>
  );
}
