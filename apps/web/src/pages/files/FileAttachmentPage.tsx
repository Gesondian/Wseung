import { Alert, Card, Empty, Skeleton, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

import type { FileObjectSummary } from "@lowcode/api-client";

import { fileApi } from "../../services/fileApi";

const { Paragraph, Title } = Typography;

const formatSize = (size: number) => `${(size / 1024).toFixed(1)} KB`;

export function FileAttachmentPage() {
  const [files, setFiles] = useState<FileObjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fileApi
      .listFiles()
      .then((response) => {
        if (response.success && response.data) {
          setFiles(response.data);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "文件列表加载失败");
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: ColumnsType<FileObjectSummary> = [
    { title: "文件名", dataIndex: "fileName", key: "fileName" },
    { title: "类型", dataIndex: "mimeType", key: "mimeType" },
    { title: "大小", key: "size", render: (_, file) => formatSize(file.size) },
    { title: "绑定记录", dataIndex: "boundTo", key: "boundTo" },
    { title: "上传人", dataIndex: "uploaderName", key: "uploaderName" },
    { title: "上传时间", dataIndex: "uploadedAt", key: "uploadedAt" },
    {
      title: "访问",
      key: "accessStatus",
      render: (_, file) => <Tag color={file.accessStatus === "allowed" ? "success" : "warning"}>{file.accessStatus === "allowed" ? "可访问" : "需鉴权"}</Tag>
    }
  ];

  return (
    <section className="page-stack">
      <div>
        <Title level={2}>文件与附件</Title>
        <Paragraph type="secondary">P0 不做完整文件中心，本页用于演示文件绑定和访问鉴权状态，不展示 storagePath。</Paragraph>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      <Card>
        {loading ? <Skeleton active /> : null}
        {!loading && files.length === 0 ? <Empty description="暂无文件" /> : null}
        {!loading && files.length > 0 ? <Table rowKey="fileId" columns={columns} dataSource={files} pagination={false} /> : null}
      </Card>
    </section>
  );
}
