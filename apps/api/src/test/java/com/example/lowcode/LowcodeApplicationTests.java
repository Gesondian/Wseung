package com.example.lowcode;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class LowcodeApplicationTests {
    @Autowired
    private MockMvc mvc;

    @Test
    void contextLoads() {
    }

    @Test
    void healthResponseIncludesRequestContext() throws Exception {
        mvc.perform(get("/api/v1/health")
                .header("X-Request-Id", "req_test_001")
                .header("X-Trace-Id", "trace_test_001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requestId").value("req_test_001"))
                .andExpect(jsonPath("$.traceId").value("trace_test_001"))
                .andExpect(jsonPath("$.code").value("OK"));
    }

    @Test
    void loginFailureUsesUnifiedErrorAndRecordsSecurityEvent() throws Exception {
        mvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"loginIdentifier":"admin","password":"bad","rememberMe":false}
                        """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));

        mvc.perform(get("/api/v1/audit/security-events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].eventType").value("auth.login_failed"));
    }

    @Test
    void runtimeRecordCreateGetUpdateAndVersionConflict() throws Exception {
        String createResponse = mvc.perform(post("/api/v1/runtime/apps/app_contract/entities/contract/records")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"data":{"title":"测试合同","amount":1200}}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.recordVersion").value(1))
                .andExpect(jsonPath("$.data.data.title").value("测试合同"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String recordId = com.jayway.jsonpath.JsonPath.read(createResponse, "$.data.recordId");

        mvc.perform(get("/api/v1/runtime/apps/app_contract/entities/contract/records/" + recordId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.recordId").value(recordId));

        mvc.perform(put("/api/v1/runtime/apps/app_contract/entities/contract/records/" + recordId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"recordVersion":1,"data":{"title":"测试合同-更新","amount":1800}}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.recordVersion").value(2))
                .andExpect(jsonPath("$.data.data.title").value("测试合同-更新"));

        mvc.perform(put("/api/v1/runtime/apps/app_contract/entities/contract/records/" + recordId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"recordVersion":1,"data":{"title":"过期版本"}}
                        """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("VERSION_CONFLICT"));
    }

    @Test
    void runtimeRecordSubmitCreatesTaskAndIsIdempotent() throws Exception {
        String createResponse = mvc.perform(post("/api/v1/runtime/apps/app_contract/entities/contract/records")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"data":{"title":"待提交合同","amount":2200}}
                        """))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String recordId = com.jayway.jsonpath.JsonPath.read(createResponse, "$.data.recordId");

        String submitResponse = mvc.perform(post("/api/v1/runtime/apps/app_contract/entities/contract/records/" + recordId + "/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"recordVersion":1,"idempotencyKey":"idem_submit_001"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.recordId").value(recordId))
                .andExpect(jsonPath("$.data.status").value("todo"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String taskId = com.jayway.jsonpath.JsonPath.read(submitResponse, "$.data.taskId");

        mvc.perform(post("/api/v1/runtime/apps/app_contract/entities/contract/records/" + recordId + "/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"recordVersion":1,"idempotencyKey":"idem_submit_001"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.taskId").value(taskId));

        mvc.perform(post("/api/v1/runtime/apps/app_contract/entities/contract/records/" + recordId + "/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"recordVersion":1,"idempotencyKey":"idem_submit_002"}
                        """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("VERSION_CONFLICT"));
    }

    @Test
    void workflowTaskListDetailApproveAndRejectUseVersionAndIdempotency() throws Exception {
        String firstTaskId = submitRecord("审批合同一", "idem_submit_task_101");
        String secondTaskId = submitRecord("审批合同二", "idem_submit_task_102");

        mvc.perform(get("/api/v1/workflow/tasks")
                .header("X-Mock-User-Id", "usr_approver"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[?(@.taskId == '" + firstTaskId + "')]").exists())
                .andExpect(jsonPath("$.data[?(@.taskId == '" + secondTaskId + "')]").exists());

        mvc.perform(get("/api/v1/workflow/tasks/" + firstTaskId)
                .header("X-Mock-User-Id", "usr_approver"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.taskId").value(firstTaskId))
                .andExpect(jsonPath("$.data.taskVersion").value(1))
                .andExpect(jsonPath("$.data.status").value("todo"));

        String approveResponse = mvc.perform(post("/api/v1/workflow/tasks/" + firstTaskId + "/approve")
                .header("X-Mock-User-Id", "usr_approver")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"taskVersion":1,"idempotencyKey":"idem_approve_101","comment":"同意"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("approved"))
                .andExpect(jsonPath("$.data.taskVersion").value(2))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String approvedTaskId = com.jayway.jsonpath.JsonPath.read(approveResponse, "$.data.taskId");

        mvc.perform(post("/api/v1/workflow/tasks/" + firstTaskId + "/approve")
                .header("X-Mock-User-Id", "usr_approver")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"taskVersion":1,"idempotencyKey":"idem_approve_101","comment":"重复同意"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.taskId").value(approvedTaskId))
                .andExpect(jsonPath("$.data.status").value("approved"));

        mvc.perform(post("/api/v1/workflow/tasks/" + secondTaskId + "/reject")
                .header("X-Mock-User-Id", "usr_approver")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"taskVersion":0,"idempotencyKey":"idem_reject_102","comment":"版本错误"}
                        """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("VERSION_CONFLICT"));

        mvc.perform(post("/api/v1/workflow/tasks/" + secondTaskId + "/reject")
                .header("X-Mock-User-Id", "usr_approver")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"taskVersion":1,"idempotencyKey":"idem_reject_102","comment":"驳回"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("rejected"))
                .andExpect(jsonPath("$.data.taskVersion").value(2));

        mvc.perform(post("/api/v1/workflow/tasks/" + secondTaskId + "/approve")
                .header("X-Mock-User-Id", "usr_approver")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"taskVersion":2,"idempotencyKey":"idem_approve_102","comment":"重复处理"}
                        """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("WORKFLOW_TASK_INVALID"));
    }

    private String submitRecord(String title, String idempotencyKey) throws Exception {
        String createResponse = mvc.perform(post("/api/v1/runtime/apps/app_contract/entities/contract/records")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"data":{"title":"%s","amount":2200}}
                        """.formatted(title)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String recordId = com.jayway.jsonpath.JsonPath.read(createResponse, "$.data.recordId");

        String submitResponse = mvc.perform(post("/api/v1/runtime/apps/app_contract/entities/contract/records/" + recordId + "/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"recordVersion":1,"idempotencyKey":"%s"}
                        """.formatted(idempotencyKey)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return com.jayway.jsonpath.JsonPath.read(submitResponse, "$.data.taskId");
    }
}
