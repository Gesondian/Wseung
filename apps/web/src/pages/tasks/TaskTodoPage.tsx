import { Alert, Button, Card, Empty, Skeleton, Space, Table, Tabs, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { WorkflowTask } from "@lowcode/api-client";

import { workflowApi } from "../../services/workflowApi";

const { Paragraph, Title } = Typography;

export function TaskTodoPage() {
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [doneTasks, setDoneTasks] = useState<WorkflowTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const loadTasks = (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
      setError(undefined);
    }
    Promise.all([workflowApi.listTodoTasks(), workflowApi.listDoneTasks()])
      .then(([todoResponse, doneResponse]) => {
        if (!todoResponse.success || !todoResponse.data) {
          setError(todoResponse.message);
          return;
        }
        if (!doneResponse.success || !doneResponse.data) {
          setError(doneResponse.message);
          return;
        }

        setTasks(todoResponse.data);
        setDoneTasks(doneResponse.data);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "待办加载失败");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([workflowApi.listTodoTasks(), workflowApi.listDoneTasks()])
      .then(([todoResponse, doneResponse]) => {
        if (!todoResponse.success || !todoResponse.data) {
          setError(todoResponse.message);
          return;
        }
        if (!doneResponse.success || !doneResponse.data) {
          setError(doneResponse.message);
          return;
        }

        setTasks(todoResponse.data);
        setDoneTasks(doneResponse.data);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "待办加载失败");
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnsType<WorkflowTask> = [
    {
      title: "任务",
      key: "task",
      render: (_, task) => (
        <Space direction="vertical" size={2}>
          <Link to={`/tasks/${task.taskId}`}>{task.taskName}</Link>
          <Typography.Text type="secondary">{task.summary}</Typography.Text>
        </Space>
      )
    },
    {
      title: "应用",
      dataIndex: "appName",
      key: "appName",
      width: 128
    },
    {
      title: "申请人",
      dataIndex: "applicantName",
      key: "applicantName",
      width: 112
    },
    {
      title: "状态",
      key: "status",
      width: 112,
      render: (_, task) => <Tag color={task.status === "todo" ? "processing" : "success"}>{task.status === "todo" ? "待办" : "已办"}</Tag>
    },
    {
      title: "版本",
      dataIndex: "taskVersion",
      key: "taskVersion",
      width: 88
    },
    {
      title: "到达时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 168
    }
  ];

  const renderTable = (dataSource: WorkflowTask[], emptyText: string) => {
    if (loading) {
      return <Skeleton active />;
    }
    if (dataSource.length === 0) {
      return <Empty description={emptyText} />;
    }
    return <Table rowKey="taskId" columns={columns} dataSource={dataSource} pagination={{ pageSize: 10 }} />;
  };

  return (
    <section className="page-stack">
      <div className="page-heading">
        <div>
          <Title level={2}>任务中心</Title>
          <Paragraph type="secondary">待办、已办与审批详情入口，审批动作统一走 Workflow Mock API。</Paragraph>
        </div>
        <Button onClick={() => loadTasks()}>刷新</Button>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      <Card>
        <Tabs
          items={[
            {
              key: "todo",
              label: `我的待办 ${tasks.length}`,
              children: renderTable(tasks, "暂无待办")
            },
            {
              key: "done",
              label: `我的已办 ${doneTasks.length}`,
              children: renderTable(doneTasks, "暂无已办")
            }
          ]}
        />
      </Card>
    </section>
  );
}
