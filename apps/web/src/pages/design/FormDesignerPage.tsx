import {
  CopyOutlined,
  DeleteOutlined,
  DragOutlined,
  EyeOutlined,
  SaveOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined
} from "@ant-design/icons";
import { Alert, Button, Card, Checkbox, Col, Empty, Input, List, message, Row, Select, Skeleton, Space, Tag, Typography } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import type { RuntimeField } from "@lowcode/runtime-contracts";

import type { FormCanvasSection } from "../../services/designApi";
import { designApi } from "../../services/designApi";

const { Paragraph, Title, Text } = Typography;

interface DesignerField extends RuntimeField {
  instanceId: string;
  label: string;
  width: "half" | "full";
}

interface DesignerSection {
  sectionKey: string;
  sectionName: string;
  fields: DesignerField[];
}

type DragPayload =
  | {
      source: "palette";
      fieldKey: string;
    }
  | {
      source: "canvas";
      instanceId: string;
    };

function toDesignerSections(sections: FormCanvasSection[]): DesignerSection[] {
  return sections.map((section) => ({
    ...section,
    fields: section.fields.map((field, index) => ({
      ...field,
      instanceId: `${section.sectionKey}:${field.fieldKey}:${index}`,
      label: field.fieldName,
      width: field.fieldType === "textarea" || field.fieldType === "subtable" || field.fieldType === "attachment" ? "full" : "half"
    }))
  }));
}

function flattenFields(sections: DesignerSection[]) {
  return sections.flatMap((section) => section.fields);
}

export function FormDesignerPage() {
  const { appId } = useParams();
  const [sections, setSections] = useState<DesignerSection[]>([]);
  const [loading, setLoading] = useState(Boolean(appId));
  const [error, setError] = useState<string>();
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>();
  const [dragOverSection, setDragOverSection] = useState<string>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const nextInstanceIdRef = useRef(0);
  const selectedField = useMemo(
    () => flattenFields(sections).find((field) => field.instanceId === selectedInstanceId),
    [sections, selectedInstanceId]
  );
  const paletteFields = useMemo(() => {
    const uniqueFields = new Map<string, RuntimeField>();
    for (const field of flattenFields(sections)) {
      uniqueFields.set(field.fieldKey, field);
    }
    return [...uniqueFields.values()];
  }, [sections]);

  useEffect(() => {
    if (!appId) {
      return;
    }

    designApi
      .listFormSections(appId)
      .then((response) => {
        if (response.success && response.data) {
          const nextSections = toDesignerSections(response.data);
          setSections(nextSections);
          setSelectedInstanceId(nextSections[0]?.fields[0]?.instanceId);
          return;
        }
        setError(response.message);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "表单设计加载失败");
      })
      .finally(() => setLoading(false));
  }, [appId]);

  function updateField(instanceId: string, nextValue: Partial<DesignerField>) {
    setSections((current) =>
      current.map((section) => ({
        ...section,
        fields: section.fields.map((field) => (field.instanceId === instanceId ? { ...field, ...nextValue } : field))
      }))
    );
  }

  function removeField(instanceId: string) {
    setSections((current) =>
      current.map((section) => ({
        ...section,
        fields: section.fields.filter((field) => field.instanceId !== instanceId)
      }))
    );
    if (selectedInstanceId === instanceId) {
      setSelectedInstanceId(undefined);
    }
  }

  function duplicateField(field: DesignerField) {
    const nextInstanceId = nextInstanceIdRef.current + 1;
    nextInstanceIdRef.current = nextInstanceId;
    setSections((current) =>
      current.map((section) => {
        const fieldIndex = section.fields.findIndex((item) => item.instanceId === field.instanceId);
        if (fieldIndex < 0) {
          return section;
        }
        const duplicated = {
          ...field,
          instanceId: `${section.sectionKey}:${field.fieldKey}:copy:${nextInstanceId}`,
          label: `${field.label} 副本`
        };
        const fields = [...section.fields];
        fields.splice(fieldIndex + 1, 0, duplicated);
        return { ...section, fields };
      })
    );
  }

  function moveField(instanceId: string, direction: "up" | "down") {
    setSections((current) =>
      current.map((section) => {
        const fieldIndex = section.fields.findIndex((field) => field.instanceId === instanceId);
        if (fieldIndex < 0) {
          return section;
        }
        const nextIndex = direction === "up" ? fieldIndex - 1 : fieldIndex + 1;
        if (nextIndex < 0 || nextIndex >= section.fields.length) {
          return section;
        }
        const fields = [...section.fields];
        [fields[fieldIndex], fields[nextIndex]] = [fields[nextIndex], fields[fieldIndex]];
        return { ...section, fields };
      })
    );
  }

  function parseDragPayload(event: React.DragEvent): DragPayload | undefined {
    const raw = event.dataTransfer.getData("application/json");
    if (!raw) {
      return undefined;
    }
    return JSON.parse(raw) as DragPayload;
  }

  function handleDragStart(event: React.DragEvent, payload: DragPayload) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/json", JSON.stringify(payload));
  }

  function handleDrop(event: React.DragEvent, sectionKey: string) {
    event.preventDefault();
    setDragOverSection(undefined);
    const payload = parseDragPayload(event);
    if (!payload) {
      return;
    }

    if (payload.source === "palette") {
      const sourceField = paletteFields.find((field) => field.fieldKey === payload.fieldKey);
      if (!sourceField) {
        return;
      }
      const nextInstanceId = nextInstanceIdRef.current + 1;
      nextInstanceIdRef.current = nextInstanceId;
      const field: DesignerField = {
        ...sourceField,
        instanceId: `${sectionKey}:${sourceField.fieldKey}:new:${nextInstanceId}`,
        label: sourceField.fieldName,
        width: sourceField.fieldType === "textarea" || sourceField.fieldType === "subtable" || sourceField.fieldType === "attachment" ? "full" : "half"
      };
      setSections((current) =>
        current.map((section) => (section.sectionKey === sectionKey ? { ...section, fields: [...section.fields, field] } : section))
      );
      setSelectedInstanceId(field.instanceId);
      return;
    }

    setSections((current) => {
      const draggedField = flattenFields(current).find((field) => field.instanceId === payload.instanceId);
      if (!draggedField) {
        return current;
      }
      return current.map((section) => {
        const fieldsWithoutDragged = section.fields.filter((field) => field.instanceId !== payload.instanceId);
        if (section.sectionKey !== sectionKey) {
          return { ...section, fields: fieldsWithoutDragged };
        }
        return { ...section, fields: [...fieldsWithoutDragged, draggedField] };
      });
    });
  }

  function handleSaveDraft() {
    void message.success("Mock 草稿已保存到当前浏览器会话");
  }

  const previewJson = useMemo(
    () =>
      JSON.stringify(
        {
          appId,
          sections: sections.map((section) => ({
            sectionKey: section.sectionKey,
            sectionName: section.sectionName,
            fields: section.fields.map(({ instanceId, label, width, fieldKey, fieldName, fieldType, required, readonly }) => ({
              instanceId,
              fieldKey,
              fieldName,
              label,
              fieldType,
              required: Boolean(required),
              readonly: Boolean(readonly),
              width
            }))
          }))
        },
        null,
        2
      ),
    [appId, sections]
  );

  return (
    <section className="page-stack">
      <div className="page-heading">
        <div>
          <Title level={2}>表单设计</Title>
          <Paragraph type="secondary">当前为拖拽设计器 Mock 纵切版，支持拖入画布、选中配置、删除、复制、排序和 JSON 预览。</Paragraph>
        </div>
        <Space wrap>
          <Button icon={<EyeOutlined />} onClick={() => setPreviewOpen((value) => !value)}>
            {previewOpen ? "收起 JSON" : "预览 JSON"}
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveDraft}>
            保存 Mock 草稿
          </Button>
        </Space>
      </div>
      {error ? <Alert type="error" message={error} showIcon /> : null}
      {loading ? <Skeleton active /> : null}
      {!loading && sections.length === 0 ? <Empty description="表单配置不存在" /> : null}
      {sections.length > 0 ? (
        <Row gutter={[16, 16]} align="top">
          <Col xs={24} lg={6}>
            <Card title="字段物料">
              <List
                dataSource={paletteFields}
                renderItem={(field) => (
                  <List.Item
                    className="palette-field"
                    draggable
                    onDragStart={(event) => handleDragStart(event, { source: "palette", fieldKey: field.fieldKey })}
                  >
                    <Space direction="vertical" size={2}>
                      <Text strong>{field.fieldName}</Text>
                      <Text type="secondary">{field.fieldKey}</Text>
                    </Space>
                    <Tag>{field.fieldType}</Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <div className="designer-canvas">
              {sections.map((section) => (
                <section
                  className={`designer-section ${dragOverSection === section.sectionKey ? "designer-section-active" : ""}`}
                  key={section.sectionKey}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverSection(section.sectionKey);
                  }}
                  onDragLeave={() => setDragOverSection(undefined)}
                  onDrop={(event) => handleDrop(event, section.sectionKey)}
                >
                  <div className="designer-section-header">
                    <Title level={4}>{section.sectionName}</Title>
                    <Text type="secondary">拖拽字段到此区域</Text>
                  </div>
                  <Row gutter={[12, 12]}>
                    {section.fields.map((field) => (
                      <Col xs={24} md={field.width === "full" ? 24 : 12} key={field.instanceId}>
                        <div
                          className={`field-tile ${selectedInstanceId === field.instanceId ? "field-tile-selected" : ""}`}
                          draggable
                          onClick={() => setSelectedInstanceId(field.instanceId)}
                          onDragStart={(event) => handleDragStart(event, { source: "canvas", instanceId: field.instanceId })}
                        >
                          <Space direction="vertical" size={4}>
                            <Space>
                              <DragOutlined />
                              <Text strong>{field.label}</Text>
                            </Space>
                            <Text type="secondary">{field.fieldType}</Text>
                            <Space size={4} wrap>
                              {field.required ? <Tag color="red">必填</Tag> : null}
                              {field.readonly ? <Tag color="blue">只读</Tag> : null}
                              <Tag>{field.width === "full" ? "整行" : "半行"}</Tag>
                            </Space>
                          </Space>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </section>
              ))}
            </div>
          </Col>
          <Col xs={24} lg={6}>
            <Card title="属性面板">
              {selectedField ? (
                <Space direction="vertical" className="full-width">
                  <Text strong>{selectedField.fieldName}</Text>
                  <Text type="secondary">编码：{selectedField.fieldKey}</Text>
                  <Text type="secondary">类型：{selectedField.fieldType}</Text>
                  <Input
                    addonBefore="标题"
                    value={selectedField.label}
                    onChange={(event) => updateField(selectedField.instanceId, { label: event.target.value })}
                  />
                  <Select
                    value={selectedField.width}
                    options={[
                      { label: "半行", value: "half" },
                      { label: "整行", value: "full" }
                    ]}
                    onChange={(width) => updateField(selectedField.instanceId, { width })}
                  />
                  <Checkbox
                    checked={Boolean(selectedField.required)}
                    onChange={(event) => updateField(selectedField.instanceId, { required: event.target.checked })}
                  >
                    必填
                  </Checkbox>
                  <Checkbox
                    checked={Boolean(selectedField.readonly)}
                    onChange={(event) => updateField(selectedField.instanceId, { readonly: event.target.checked })}
                  >
                    只读
                  </Checkbox>
                  <Space wrap>
                    <Button icon={<VerticalAlignTopOutlined />} onClick={() => moveField(selectedField.instanceId, "up")}>
                      上移
                    </Button>
                    <Button icon={<VerticalAlignBottomOutlined />} onClick={() => moveField(selectedField.instanceId, "down")}>
                      下移
                    </Button>
                    <Button icon={<CopyOutlined />} onClick={() => duplicateField(selectedField)}>
                      复制
                    </Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => removeField(selectedField.instanceId)}>
                      删除
                    </Button>
                  </Space>
                </Space>
              ) : (
                <Empty description="请选择字段" />
              )}
            </Card>
          </Col>
          {previewOpen ? (
            <Col span={24}>
              <Card title="Mock 表单 DSL 预览">
                <pre className="json-preview">{previewJson}</pre>
              </Card>
            </Col>
          ) : null}
        </Row>
      ) : null}
    </section>
  );
}
