import { Alert, Button, Card, DatePicker, Form, Input, InputNumber, Select, Skeleton, Space, Typography, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { RuntimeRecord } from "@lowcode/api-client";
import type { RuntimeField, RuntimeModelStub } from "@lowcode/runtime-contracts";

import { runtimeApi } from "../../services/runtimeApi";

const { Paragraph, Title } = Typography;

const fieldPlaceholder = (field: RuntimeField) => {
  if (field.fieldType === "attachment") {
    return "Mock 阶段请输入文件 ID，多个文件用逗号分隔";
  }
  if (field.fieldType === "subtable") {
    return "Mock 阶段请输入明细摘要";
  }
  return `请输入${field.fieldName}`;
};

function renderFieldInput(field: RuntimeField) {
  if (field.readonly) {
    return <Input disabled placeholder="只读字段由系统生成" />;
  }
  if (field.fieldType === "money" || field.fieldType === "number") {
    return <InputNumber className="full-width" min={0} placeholder={fieldPlaceholder(field)} />;
  }
  if (field.fieldType === "date") {
    return <DatePicker className="full-width" />;
  }
  if (field.fieldType === "select") {
    return (
      <Select
        placeholder={fieldPlaceholder(field)}
        options={[
          { value: "草稿", label: "草稿" },
          { value: "待审批", label: "待审批" },
          { value: "已完成", label: "已完成" }
        ]}
      />
    );
  }
  if (field.fieldType === "textarea" || field.fieldType === "subtable") {
    return <Input.TextArea rows={4} placeholder={fieldPlaceholder(field)} />;
  }
  return <Input placeholder={fieldPlaceholder(field)} />;
}

export function RuntimeRecordFormPage() {
  const { appId, entityKey, recordId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<Record<string, unknown>>();
  const [model, setModel] = useState<RuntimeModelStub>();
  const [record, setRecord] = useState<RuntimeRecord>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const isEdit = Boolean(recordId);

  useEffect(() => {
    if (!appId || !entityKey) {
      return;
    }

    const modelRequest = runtimeApi.getRuntimeModel(appId);
    const recordRequest = recordId ? runtimeApi.getRuntimeRecord(appId, entityKey, recordId) : Promise.resolve(undefined);

    Promise.all([modelRequest, recordRequest])
      .then(([modelResponse, recordResponse]) => {
        if (!modelResponse.success || !modelResponse.data) {
          setError(modelResponse.message);
          return;
        }
        setModel(modelResponse.data);

        if (recordResponse) {
          if (!recordResponse.success || !recordResponse.data) {
            setError(recordResponse.message);
            return;
          }
          setRecord(recordResponse.data);
          form.setFieldsValue(recordResponse.data.data);
        }
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "表单加载失败");
      })
      .finally(() => setLoading(false));
  }, [appId, entityKey, form, recordId]);

  const entity = useMemo(() => model?.entities?.find((item) => item.entityKey === entityKey), [entityKey, model?.entities]);

  const handleSave = async () => {
    if (!appId || !entityKey || !entity) {
      return;
    }

    setSaving(true);
    setError(undefined);
    try {
      const values = await form.validateFields();
      const response =
        isEdit && recordId
          ? await runtimeApi.updateRuntimeRecord(appId, entityKey, recordId, {
              recordVersion: record?.recordVersion,
              data: values
            })
          : await runtimeApi.createRuntimeRecord(appId, entityKey, { data: values });

      if (response.success && response.data) {
        message.success(isEdit ? "记录已保存" : "记录已创建");
        navigate(`/runtime/apps/${appId}/entities/${entityKey}/${response.data.recordId}`);
        return;
      }
      setError(response.message);
    } catch (reason: unknown) {
      if (reason instanceof Error) {
        setError(reason.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-stack">
      <div className="page-heading">
        <div>
          <Title level={2}>{isEdit ? "编辑记录" : "新建记录"}</Title>
          <Paragraph type="secondary">表单由 RuntimeModel 字段定义驱动，保存时携带 recordVersion。</Paragraph>
        </div>
        {appId && entityKey ? <Link to={`/runtime/apps/${appId}/entities/${entityKey}/list`}><Button>返回列表</Button></Link> : null}
      </div>

      {error ? <Alert type="error" message={error} showIcon /> : null}
      <Card>
        {loading ? <Skeleton active /> : null}
        {!loading && entity ? (
          <Form form={form} layout="vertical">
            {entity.fields.map((field) => (
              <Form.Item
                key={field.fieldKey}
                name={field.fieldKey}
                label={field.fieldName}
                rules={field.required && !field.readonly ? [{ required: true, message: `${field.fieldName}不能为空` }] : undefined}
              >
                {renderFieldInput(field)}
              </Form.Item>
            ))}
            <Space wrap>
              <Button type="primary" loading={saving} onClick={() => void handleSave()}>
                保存
              </Button>
              {appId && entityKey ? <Link to={`/runtime/apps/${appId}/entities/${entityKey}/list`}><Button>取消</Button></Link> : null}
            </Space>
          </Form>
        ) : null}
      </Card>
    </section>
  );
}
