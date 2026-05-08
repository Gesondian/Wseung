package com.example.lowcode.common.context;

import java.util.List;

public record RequestContext(
        String tenantId,
        String userId,
        String requestId,
        String traceId,
        List<String> roleIds
) {
    public static RequestContext anonymous(String requestId, String traceId) {
        return new RequestContext("default", "anonymous", requestId, traceId, List.of("anonymous"));
    }
}
