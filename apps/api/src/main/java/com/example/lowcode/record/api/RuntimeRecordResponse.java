package com.example.lowcode.record.api;

import com.fasterxml.jackson.databind.JsonNode;

public record RuntimeRecordResponse(
        String recordId,
        String appId,
        String entityKey,
        String appVersionId,
        String snapshotId,
        long recordVersion,
        String businessStatus,
        String workflowStatus,
        JsonNode data
) {
}
