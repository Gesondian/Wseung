import {
  AppstoreOutlined,
  EditOutlined,
  FolderOutlined,
  InfoCircleOutlined,
  ProfileOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import { Alert, Button, Card, Col, Empty, Input, List, Radio, Row, Select, Skeleton, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { AppSummary } from "@lowcode/api-client";

import { appApi } from "../../services/appApi";

const { Paragraph, Title, Text } = Typography;
type FilterValue = "all";
type StatusFilter = AppSummary["status"] | FilterValue;
type RelationFilter = AppSummary["relation"] | FilterValue;
type SortKey = "updatedAt" | "createdAt" | "appName";
type ViewMode = "card" | "list";

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: "全部状态", value: "all" },
  { label: "已发布", value: "published" },
  { label: "草稿", value: "draft" },
  { label: "已停用", value: "disabled" }
];

const relationOptions: Array<{ label: string; value: RelationFilter }> = [
  { label: "全部应用", value: "all" },
  { label: "我管理的", value: "managed" },
  { label: "我使用的", value: "used" },
  { label: "我创建的", value: "created" }
];

const sortOptions: Array<{ label: string; value: SortKey }> = [
  { label: "最近更新", value: "updatedAt" },
  { label: "创建时间", value: "createdAt" },
  { label: "应用名称", value: "appName" }
];

const statusColor: Record<AppSummary["status"], string> = {
  published: "success",
  draft: "processing",
  disabled: "default"
};

const statusText: Record<AppSummary["status"], string> = {
  published: "已发布",
  draft: "草稿",
  disabled: "已停用"
};

export function AppListPage() {
  const [apps, setApps] = useState<AppSummary[]>([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [relation, setRelation] = useState<RelationFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("updatedAt");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const fetchApps = useCallback(() => {
    appApi
      .listApps()
      .then((response) => {
        if (response.success && response.data) {
          setApps(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "应用列表加载失败");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const filteredApps = useMemo(() => {
    const normalizedKeyword = keyword.trim();
    const nextApps = apps
      .filter((app) => {
        if (!normalizedKeyword) {
          return true;
        }

        return `${app.appName}${app.appKey}${app.description}${app.ownerName}`.includes(normalizedKeyword);
      })
      .filter((app) => (status === "all" ? true : app.status === status))
      .filter((app) => (category === "all" ? true : app.categoryName === category))
      .filter((app) => (relation === "all" ? true : app.relation === relation));

    return [...nextApps].sort((first, second) => {
      if (sortBy === "appName") {
        return first.appName.localeCompare(second.appName, "zh-Hans-CN");
      }
      const firstValue = sortBy === "createdAt" ? first.createdAt : first.updatedAt;
      const secondValue = sortBy === "createdAt" ? second.createdAt : second.updatedAt;
      return secondValue.localeCompare(firstValue);
    });
  }, [apps, category, keyword, relation, sortBy, status]);

  const categories = useMemo(() => ["all", ...new Set(apps.map((app) => app.categoryName))], [apps]);

  const filterSummary = useMemo(() => {
    const summary = [];
    if (category !== "all") {
      summary.push(`分类：${category}`);
    }
    if (status !== "all") {
      summary.push(`状态：${statusText[status]}`);
    }
    if (relation !== "all") {
      summary.push(`关系：${relationOptions.find((option) => option.value === relation)?.label ?? relation}`);
    }
    if (keyword.trim()) {
      summary.push(`关键词：${keyword.trim()}`);
    }
    return summary.length > 0 ? summary.join(" / ") : "全部可访问应用";
  }, [category, keyword, relation, status]);

  const tableColumns: ColumnsType<AppSummary> = [
    {
      title: "应用",
      dataIndex: "appName",
      key: "appName",
      render: (_, app) => (
        <Space direction="vertical" size={0}>
          <Link to={`/apps/${app.appId}`}>{app.appName}</Link>
          <Text type="secondary">{app.appKey}</Text>
        </Space>
      )
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 96,
      render: (value: AppSummary["status"]) => <AppStatusTag status={value} />
    },
    {
      title: "分类",
      dataIndex: "categoryName",
      key: "categoryName"
    },
    {
      title: "负责人",
      dataIndex: "ownerName",
      key: "ownerName"
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt"
    },
    {
      title: "发布时间",
      dataIndex: "publishedAt",
      key: "publishedAt",
      render: (value?: string) => value ?? "未发布"
    },
    {
      title: "入口",
      key: "actions",
      width: 180,
      render: (_, app) => <AppEntryActions app={app} />
    }
  ];

  function resetFilters() {
    setKeyword("");
    setStatus("all");
    setCategory("all");
    setRelation("all");
    setSortBy("updatedAt");
  }

  function retryLoadApps() {
    setLoading(true);
    setError(undefined);
    fetchApps();
  }

  return (
    <section className="app-center-layout">
      <aside className="app-scope-panel">
        <div className="app-scope-heading">
          <Space>
            <FolderOutlined />
            <Text strong>应用范围</Text>
          </Space>
          <Tag>{apps.length}</Tag>
        </div>
        <List
          dataSource={categories}
          renderItem={(item) => (
            <List.Item
              className={`category-item ${category === item ? "category-item-active" : ""}`}
              onClick={() => setCategory(item)}
            >
              <Text>{item === "all" ? "全部应用" : item}</Text>
              <Tag>{item === "all" ? apps.length : apps.filter((app) => app.categoryName === item).length}</Tag>
            </List.Item>
          )}
        />
      </aside>

      <main className="app-center-main">
        <div className="page-heading">
          <div>
            <Title level={2}>应用中心</Title>
            <Paragraph type="secondary">当前只保留 P0-AC-001 至 P0-AC-004：应用入口、卡片/列表展示、搜索、筛选与排序。</Paragraph>
          </div>
          <Tag color="blue">P0-AC-001 ~ P0-AC-004</Tag>
        </div>

        <Card bordered>
          <Space direction="vertical" size={16} className="full-width">
            <Row gutter={[12, 12]} align="middle">
              <Col xs={24} xl={8}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="搜索名称、编码、描述、负责人"
                  allowClear
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </Col>
              <Col xs={24} md={8} xl={4}>
                <Select<StatusFilter> className="full-width" value={status} options={statusOptions} onChange={setStatus} />
              </Col>
              <Col xs={24} md={8} xl={4}>
                <Select<RelationFilter> className="full-width" value={relation} options={relationOptions} onChange={setRelation} />
              </Col>
              <Col xs={24} md={8} xl={4}>
                <Select<SortKey> className="full-width" value={sortBy} options={sortOptions} onChange={setSortBy} />
              </Col>
              <Col xs={24} xl={4}>
                <Space className="app-toolbar-actions">
                  <Radio.Group value={viewMode} onChange={(event) => setViewMode(event.target.value as ViewMode)}>
                    <Radio.Button value="card">
                      <AppstoreOutlined />
                    </Radio.Button>
                    <Radio.Button value="list">
                      <UnorderedListOutlined />
                    </Radio.Button>
                  </Radio.Group>
                  <Button icon={<ReloadOutlined />} onClick={resetFilters}>
                    重置
                  </Button>
                </Space>
              </Col>
            </Row>

            <div className="app-result-summary">
              <Text strong>共 {filteredApps.length} 个应用</Text>
              <Text type="secondary">{filterSummary}</Text>
            </div>

            {error ? <Alert type="error" message={error} showIcon action={<Button onClick={retryLoadApps}>重试</Button>} /> : null}
            {loading ? <Skeleton active paragraph={{ rows: 6 }} /> : null}
            {!loading && !error && filteredApps.length === 0 ? (
              <Empty description={apps.length === 0 ? "当前用户暂无可访问应用" : "暂无匹配应用"}>
                {apps.length > 0 ? <Button onClick={resetFilters}>清空筛选</Button> : null}
              </Empty>
            ) : null}
            {!loading && !error && filteredApps.length > 0 && viewMode === "card" ? (
              <Row gutter={[16, 16]}>
                {filteredApps.map((app) => (
                  <Col xs={24} md={12} xl={8} key={app.appId}>
                    <AppCard app={app} />
                  </Col>
                ))}
              </Row>
            ) : null}
            {!loading && !error && filteredApps.length > 0 && viewMode === "list" ? (
              <Table<AppSummary> rowKey="appId" columns={tableColumns} dataSource={filteredApps} pagination={false} scroll={{ x: 980 }} />
            ) : null}
          </Space>
        </Card>
      </main>
    </section>
  );
}

function AppCard({ app }: { app: AppSummary }) {
  return (
    <Card className="app-card" title={app.appName} extra={<AppStatusTag status={app.status} />} actions={[<AppEntryActions key="actions" app={app} />]}>
      <Paragraph className="app-description" ellipsis={{ rows: 2 }}>
        {app.description}
      </Paragraph>
      <Space direction="vertical" size={4}>
        <Text type="secondary">编码：{app.appKey}</Text>
        <Text type="secondary">分类：{app.categoryName}</Text>
        <Text type="secondary">负责人：{app.ownerName}</Text>
        <Text type="secondary">创建人：{app.creatorName}</Text>
        <Text type="secondary">创建时间：{app.createdAt}</Text>
        <Text type="secondary">更新时间：{app.updatedAt}</Text>
        <Text type="secondary">发布时间：{app.publishedAt ?? "未发布"}</Text>
      </Space>
    </Card>
  );
}

function AppStatusTag({ status }: { status: AppSummary["status"] }) {
  return <Tag color={statusColor[status]}>{statusText[status]}</Tag>;
}

function AppEntryActions({ app }: { app: AppSummary }) {
  const runtimeDisabledText = app.status === "disabled" ? "已停用" : "未发布";

  return (
    <Space size={12} wrap>
      <Link to={`/apps/${app.appId}`}>
        <InfoCircleOutlined /> 详情
      </Link>
      <Link to={`/apps/${app.appId}/overview`}>
        <EditOutlined /> 设计
      </Link>
      {app.status === "published" ? (
        <Link to={`/runtime/apps/${app.appId}`}>
          <PlayCircleOutlined /> 运行
        </Link>
      ) : (
        <Text type="secondary">
          <ProfileOutlined /> {runtimeDisabledText}
        </Text>
      )}
    </Space>
  );
}
