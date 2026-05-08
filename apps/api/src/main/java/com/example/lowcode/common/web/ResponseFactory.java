package com.example.lowcode.common.web;

import com.example.lowcode.common.ApiErrorDetail;
import com.example.lowcode.common.ApiResponse;
import com.example.lowcode.common.context.RequestContext;
import com.example.lowcode.common.context.RequestContextHolder;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ResponseFactory {
    public <T> ApiResponse<T> ok(T data) {
        RequestContext context = RequestContextHolder.require();
        return ApiResponse.ok(data, context.requestId(), context.traceId());
    }

    public <T> ApiResponse<T> error(String code, String message, List<ApiErrorDetail> details) {
        RequestContext context = RequestContextHolder.require();
        return ApiResponse.error(code, message, details, context.requestId(), context.traceId());
    }
}
