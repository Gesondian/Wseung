import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

import { AuthLayout } from "../layouts/AuthLayout";
import { MainShell } from "../layouts/MainShell";
import { RuntimeShell } from "../layouts/RuntimeShell";

const AppListPage = lazy(() => import("../pages/app-center/AppListPage").then((module) => ({ default: module.AppListPage })));
const AppDetailPage = lazy(() => import("../pages/app-center/AppDetailPage").then((module) => ({ default: module.AppDetailPage })));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const AppOverviewPage = lazy(() => import("../pages/design/AppOverviewPage").then((module) => ({ default: module.AppOverviewPage })));
const ModelDesignerPage = lazy(() =>
  import("../pages/design/ModelDesignerPage").then((module) => ({ default: module.ModelDesignerPage }))
);
const FormDesignerPage = lazy(() => import("../pages/design/FormDesignerPage").then((module) => ({ default: module.FormDesignerPage })));
const WorkflowDesignerPage = lazy(() =>
  import("../pages/design/WorkflowDesignerPage").then((module) => ({ default: module.WorkflowDesignerPage }))
);
const PermissionDesignerPage = lazy(() =>
  import("../pages/design/PermissionDesignerPage").then((module) => ({ default: module.PermissionDesignerPage }))
);
const ReleaseManagementPage = lazy(() =>
  import("../pages/design/ReleaseManagementPage").then((module) => ({ default: module.ReleaseManagementPage }))
);
const FileAttachmentPage = lazy(() => import("../pages/files/FileAttachmentPage").then((module) => ({ default: module.FileAttachmentPage })));
const LoginPage = lazy(() => import("../pages/login/LoginPage").then((module) => ({ default: module.LoginPage })));
const AuditLogPage = lazy(() => import("../pages/audit/AuditLogPage").then((module) => ({ default: module.AuditLogPage })));
const SecurityEventPage = lazy(() =>
  import("../pages/security/SecurityEventPage").then((module) => ({ default: module.SecurityEventPage }))
);
const DiagnosticsPage = lazy(() => import("../pages/ops/DiagnosticsPage").then((module) => ({ default: module.DiagnosticsPage })));
const RuntimeAppHomePage = lazy(() =>
  import("../pages/runtime/RuntimeAppHomePage").then((module) => ({ default: module.RuntimeAppHomePage }))
);
const RuntimeRecordListPage = lazy(() =>
  import("../pages/runtime/RuntimeRecordListPage").then((module) => ({ default: module.RuntimeRecordListPage }))
);
const RuntimeRecordDetailPage = lazy(() =>
  import("../pages/runtime/RuntimeRecordDetailPage").then((module) => ({ default: module.RuntimeRecordDetailPage }))
);
const RuntimeRecordFormPage = lazy(() =>
  import("../pages/runtime/RuntimeRecordFormPage").then((module) => ({ default: module.RuntimeRecordFormPage }))
);
const TaskTodoPage = lazy(() => import("../pages/tasks/TaskTodoPage").then((module) => ({ default: module.TaskTodoPage })));
const TaskDetailPage = lazy(() => import("../pages/tasks/TaskDetailPage").then((module) => ({ default: module.TaskDetailPage })));

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<div className="route-loading">加载中...</div>}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: withSuspense(<LoginPage />)
      }
    ]
  },
  {
    element: <MainShell />,
    children: [
      {
        path: "/",
        element: withSuspense(<DashboardPage />)
      },
      {
        path: "/apps",
        element: withSuspense(<AppListPage />)
      },
      {
        path: "/apps/:appId",
        element: withSuspense(<AppDetailPage />)
      },
      {
        path: "/apps/:appId/overview",
        element: withSuspense(<AppOverviewPage />)
      },
      {
        path: "/apps/:appId/models",
        element: withSuspense(<ModelDesignerPage />)
      },
      {
        path: "/apps/:appId/forms",
        element: withSuspense(<FormDesignerPage />)
      },
      {
        path: "/apps/:appId/workflows",
        element: withSuspense(<WorkflowDesignerPage />)
      },
      {
        path: "/apps/:appId/permissions",
        element: withSuspense(<PermissionDesignerPage />)
      },
      {
        path: "/apps/:appId/releases",
        element: withSuspense(<ReleaseManagementPage />)
      },
      {
        path: "/tasks/todo",
        element: withSuspense(<TaskTodoPage />)
      },
      {
        path: "/tasks/:taskId",
        element: withSuspense(<TaskDetailPage />)
      },
      {
        path: "/files",
        element: withSuspense(<FileAttachmentPage />)
      },
      {
        path: "/audit/logs",
        element: withSuspense(<AuditLogPage />)
      },
      {
        path: "/security/events",
        element: withSuspense(<SecurityEventPage />)
      },
      {
        path: "/ops/diagnostics",
        element: withSuspense(<DiagnosticsPage />)
      }
    ]
  },
  {
    element: <RuntimeShell />,
    children: [
      {
        path: "/runtime/apps/:appId",
        element: withSuspense(<RuntimeAppHomePage />)
      },
      {
        path: "/runtime/apps/:appId/entities/:entityKey/list",
        element: withSuspense(<RuntimeRecordListPage />)
      },
      {
        path: "/runtime/apps/:appId/entities/:entityKey/new",
        element: withSuspense(<RuntimeRecordFormPage />)
      },
      {
        path: "/runtime/apps/:appId/entities/:entityKey/:recordId",
        element: withSuspense(<RuntimeRecordDetailPage />)
      },
      {
        path: "/runtime/apps/:appId/entities/:entityKey/:recordId/edit",
        element: withSuspense(<RuntimeRecordFormPage />)
      }
    ]
  }
]);
