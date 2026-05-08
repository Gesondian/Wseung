package com.example.lowcode.common;

import java.util.List;

public record ApiResponse<T>(
        boolean success,
        String code,
        String message,
        T data,
        List<ApiErrorDetail> details,
        String requestId,
        String traceId
) {

    public static <T> ApiResponse<T> ok(T data, String requestId, String traceId) {
        return new ApiResponse<>(true, "OK", "success", data, List.of(), requestId, traceId);
    }

    public static <T> ApiResponse<T> error(String code, String message, List<ApiErrorDetail> details, String requestId, String traceId) {
        return new ApiResponse<>(false, code, message, null, details == null ? List.of() : details, requestId, traceId);
    }
}
