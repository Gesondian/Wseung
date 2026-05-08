import {
  ApiOutlined,
  AuditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExportOutlined,
  FileSearchOutlined,
  ImportOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  UploadOutlined
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  List,
  message,
  Modal,
  Row,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tag,
  Timeline,
  Typography
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { AppDetail, AppMemberSummary, AppOperationLog, AppResourceEntry, AppSummary } from "@lowcode/api-client";

import { appApi } from "../../services/appApi";

const { Paragraph, Text, Title } = Typography;

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

const resourceStatusColor: Record<AppResourceEntry["status"], string> = {
  ready: "success",
  draft: "processing",
  warning: "warning"
};

const resourceTypeText: Record<AppResourceEntry["resourceType"], string> = {
  object: "数据对象",
  form: "表单",
  view: "视图/台账",
  workflow: "流程",
  permission: "权限",
  release: "发布"
};

const operationText: Record<AppOperationLog["action"], string> = {
  create: "创建应用",
  edit: "编辑信息",
  publish: "发布应用",
  stop: "停用应用",
  restore: "恢复应用",
  delete: "删除应用",
  export: "导出元数据",
  import: "导入元数据",
  member_change: "成员变更"
};

export function AppDetailPage() {
  const { appId } = useParams();
  const [detail, setDetail] = useState<AppDetail>();
  const [loading, setLoading] = useState(Boolean(appId));
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!appId) {
      return;
    }

    appApi
      .getAppDetail(appId)
      .then((response) => {
        if (response.success && response.data) {
          setDetail(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "应用详情加载失败");
      })
      .finally(() => setLoading(false));
  }, [appId]);

  const memberColumns = useMemo<ColumnsType<AppMemberSummary>>(
    () => [
      { title: "成员", dataIndex: "memberName" },
      { title: "角色", dataIndex: "roleName" },
      {
        title: "主体类型",
        dataIndex: "principalType",
        render: (value: AppMemberSummary["principalType"]) => ({ user: "用户", role: "角色", org: "组织" })[value]
      },
      { title: "更新时间", dataIndex: "updatedAt" }
    ],
    []
  );

  function showRuntimeMessage(app: AppSummary) {
    if (app.status === "published") {
      return;
    }

    void message.warning(app.status === "disabled" ? "该应用已停用，暂不可访问。" : "该应用尚未发布，请先完成发布后再访问运行端。");
  }

  function confirmLifecycleAction(actionName: string, content: string) {
    Modal.confirm({
      title: actionName,
      content,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        void message.info(`${actionName}已在 Mock 页面记录入口，真实状态变更等待应用中心后端接入。`);
      }
    });
  }

  function showExportModal(appDetail: AppDetail) {
    Modal.info({
      title: "导出应用元数据包",
      width: 640,
      content: (
        <Space direction="vertical" size={12}>
          <Alert
            type="info"
            showIcon
            message="本次仅导出应用配置元数据，不包含业务数据、流程实例、附件和审计日志。"
          />
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="包名">{appDetail.metadataPackage.packageName}</Descriptions.Item>
            <Descriptions.Item label="版本">{appDetail.metadataPackage.version}</Descriptions.Item>
            <Descriptions.Item label="包含">{appDetail.metadataPackage.includes.join("、")}</Descriptions.Item>
            <Descriptions.Item label="不包含">{appDetail.metadataPackage.excludes.join("、")}</Descriptions.Item>
          </Descriptions>
        </Space>
      ),
      okText: "知道了"
    });
  }

  function showImportModal() {
    Modal.info({
      title: "导入应用元数据包",
      width: 560,
      content: (
        <Space direction="vertical" size={12}>
          <Alert type="warning" showIcon message="Mock 仅展示上传、解析、编码冲突检测和确认导入入口，不写入真实应用。" />
          <List
            size="small"
            dataSource={["上传应用包", "解析 manifest", "校验版本兼容性", "校验应用编码冲突", "预览导入内容", "确认导入"]}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Space>
      ),
      okText: "知道了"
    });
  }

  return (
    <section className="page-stack">
      <div className="page-heading">
        <div>
          <Title level={2}>{detail?.app.appName ?? "应用详情"}</Title>
          <Paragraph type="secondary">对齐 P0-AC-011 至 P0-AC-023：详情、资源结构、设计/运行/发布入口、生命周期、成员、导入导出和操作日志。</Paragraph>
        </div>
        {detail ? (
          <Space wrap>
            {detail.app.status === "published" ? (
              <Link to={`/runtime/apps/${detail.app.appId}`}>
                <Button type="primary" icon={<PlayCircleOutlined />}>
                  运行
                </Button>
              </Link>
            ) : (
              <Button icon={<PlayCircleOutlined />} onClick={() => showRuntimeMessage(detail.app)}>
                运行
              </Button>
            )}
            <Link to={`/apps/${detail.app.appId}/releases`}>
              <Button icon={<UploadOutlined />}>发布</Button>
            </Link>
            <Button icon={<ExportOutlined />} onClick={() => showExportModal(detail)}>
              导出
            </Button>
            <Button icon={<ImportOutlined />} onClick={showImportModal}>
              导入
            </Button>
          </Space>
        ) : null}
      </div>

      {error ? <Alert type="error" message={error} showIcon /> : null}
      {loading ? <Skeleton active /> : null}
      {!loading && !detail ? <Empty description="应用详情不存在" /> : null}

      {detail ? (
        <>
          <Card>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} xl={16}>
                <Descriptions column={{ xs: 1, md: 2 }} size="small">
                  <Descriptions.Item label="应用编码">{detail.app.appKey}</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color={statusColor[detail.app.status]}>{statusText[detail.app.status]}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="负责人">{detail.app.ownerName}</Descriptions.Item>
                  <Descriptions.Item label="分类">{detail.app.categoryName}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{detail.createdAt}</Descriptions.Item>
                  <Descriptions.Item label="更新时间">{detail.app.updatedAt}</Descriptions.Item>
                  <Descriptions.Item label="当前版本">{detail.currentVersion ?? "未发布"}</Descriptions.Item>
                  <Descriptions.Item label="最近发布人">{detail.latestPublisherName ?? "未发布"}</Descriptions.Item>
                </Descriptions>
                <Paragraph className="detail-description">{detail.app.description}</Paragraph>
              </Col>
              <Col xs={24} xl={8}>
                <Space wrap className="detail-action-bar">
                  <Link to={`/apps/${detail.app.appId}/overview`}>
                    <Button icon={<SettingOutlined />}>设计总览</Button>
                  </Link>
                  <Link to={`/apps/${detail.app.appId}/permissions`}>
                    <Button icon={<SafetyCertificateOutlined />}>权限</Button>
                  </Link>
                  <Button
                    icon={detail.app.status === "disabled" ? <ReloadOutlined /> : <PauseCircleOutlined />}
                    onClick={() =>
                      confirmLifecycleAction(
                        detail.app.status === "disabled" ? "恢复启用应用" : "停用应用",
                        detail.app.status === "disabled"
                          ? "恢复后有权限用户可重新进入运行端，恢复操作需写入审计日志。"
                          : "停用后用户将无法访问该应用运行端，未完成流程可能无法继续处理，确认停用？"
                      )
                    }
                  >
                    {detail.app.status === "disabled" ? "恢复" : "停用"}
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      confirmLifecycleAction(
                        "删除应用",
                        "应用删除后将进入回收站，普通用户不可访问，相关待办可能无法继续处理。确认删除？"
                      )
                    }
                  >
                    删除
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <Row gutter={[16, 16]}>
            {[
              ["业务对象", detail.resourceStats.objectCount],
              ["表单", detail.resourceStats.formCount],
              ["视图", detail.resourceStats.viewCount],
              ["流程", detail.resourceStats.workflowCount],
              ["看板", detail.resourceStats.dashboardCount],
              ["成员", detail.resourceStats.memberCount],
              ["最近操作", detail.resourceStats.recentOperationCount]
            ].map(([label, value]) => (
              <Col xs={12} md={8} xl={3} key={label}>
                <Card>
                  <Statistic title={label} value={value} />
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={14}>
              <Card title="资源结构" extra={<ApiOutlined />}>
                <List
                  dataSource={detail.resources}
                  renderItem={(resource) => (
                    <List.Item
                      actions={[
                        <Link key="open" to={resource.path}>
                          打开
                        </Link>
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <Space wrap>
                            <Text strong>{resource.resourceName}</Text>
                            <Tag>{resourceTypeText[resource.resourceType]}</Tag>
                            <Tag color={resourceStatusColor[resource.status]}>{resource.status}</Tag>
                          </Space>
                        }
                        description={resource.description}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} xl={10}>
              <Card title="快捷入口" extra={<FileSearchOutlined />}>
                <Row gutter={[12, 12]}>
                  {[
                    { title: "数据建模", icon: <ApiOutlined />, path: "models" },
                    { title: "表单设计", icon: <FileSearchOutlined />, path: "forms" },
                    { title: "流程设计", icon: <ReloadOutlined />, path: "workflows" },
                    { title: "权限配置", icon: <SafetyCertificateOutlined />, path: "permissions" },
                    { title: "发布管理", icon: <UploadOutlined />, path: "releases" },
                    { title: "操作日志", icon: <AuditOutlined />, path: "logs" }
                  ].map((entry) => (
                    <Col xs={12} key={entry.title}>
                      {entry.path === "logs" ? (
                        <Button className="full-width" icon={entry.icon} onClick={() => message.info("操作日志已在本页展示最近 10 条，后续接入独立审计查询。")}>
                          {entry.title}
                        </Button>
                      ) : (
                        <Link to={`/apps/${detail.app.appId}/${entry.path}`}>
                          <Button className="full-width" icon={entry.icon}>
                            {entry.title}
                          </Button>
                        </Link>
                      )}
                    </Col>
                  ))}
                </Row>
              </Card>

              <Card title="成员管理入口" extra={<TeamOutlined />}>
                <Table rowKey="memberId" size="small" pagination={false} columns={memberColumns} dataSource={detail.members} />
                <Button className="full-width member-action" icon={<TeamOutlined />} onClick={() => message.info("成员维护入口已预留，后续接入组织、角色与应用权限服务。")}>
                  维护成员
                </Button>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={14}>
              <Card title="最近操作日志" extra={<AuditOutlined />}>
                <Timeline
                  items={detail.operationLogs.map((log) => ({
                    color: log.result === "success" ? "green" : "red",
                    children: (
                      <Space direction="vertical" size={2}>
                        <Space wrap>
                          <Text strong>{operationText[log.action]}</Text>
                          <Tag color={log.result === "success" ? "success" : "error"}>{log.result}</Tag>
                          <Text type="secondary">{log.occurredAt}</Text>
                        </Space>
                        <Text>{log.summary}</Text>
                        <Text type="secondary">操作人：{log.operatorName}</Text>
                      </Space>
                    )
                  }))}
                />
              </Card>
            </Col>
            <Col xs={24} xl={10}>
              <Card title="导入导出范围" extra={<DownloadOutlined />}>
                <Alert
                  type="info"
                  showIcon
                  message="P0 应用包仅包含配置元数据；业务数据、流程实例、附件和审计日志不随应用包迁移。"
                />
                <List
                  size="small"
                  header="导出文件"
                  dataSource={detail.metadataPackage.includes}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Card>
            </Col>
          </Row>
        </>
      ) : null}
    </section>
  );
}
