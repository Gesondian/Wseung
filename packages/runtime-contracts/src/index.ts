export interface RuntimeField {
  fieldKey: string;
  fieldName: string;
  fieldType: "text" | "textarea" | "money" | "number" | "date" | "lookup" | "attachment" | "subtable" | "select";
  required?: boolean;
  readonly?: boolean;
  visible?: boolean;
}

export interface RuntimeEntity {
  entityKey: string;
  entityName: string;
  primaryFieldKey: string;
  fields: RuntimeField[];
}

export interface RuntimeView {
  viewKey: string;
  viewName: string;
  entityKey: string;
  columns: string[];
}

export interface RuntimeAction {
  actionKey: string;
  actionName: string;
  type: "create" | "edit" | "submit" | "approve" | "reject" | "download";
}

export interface RuntimeModelStub {
  appId: string;
  snapshotId: string;
  appKey?: string;
  appName?: string;
  entities?: RuntimeEntity[];
  views?: RuntimeView[];
  actions?: RuntimeAction[];
}
