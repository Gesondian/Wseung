package com.example.lowcode.common.web;

import com.example.lowcode.common.context.RequestContext;
import com.example.lowcode.common.context.RequestContextHolder;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component("lowcodeRequestContextFilter")
public class RequestContextFilter extends OncePerRequestFilter {
    private static final String REQUEST_ID_HEADER = "X-Request-Id";
    private static final String TRACE_ID_HEADER = "X-Trace-Id";
    private static final String USER_ID_HEADER = "X-Mock-User-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestId = headerOrNewId(request, REQUEST_ID_HEADER);
        String traceId = headerOrNewId(request, TRACE_ID_HEADER);
        String userId = headerOrDefault(request, USER_ID_HEADER, "anonymous");

        RequestContext context = new RequestContext("default", userId, requestId, traceId, List.of("system_admin"));
        RequestContextHolder.set(context);
        MDC.put("requestId", requestId);
        MDC.put("traceId", traceId);
        response.setHeader(REQUEST_ID_HEADER, requestId);
        response.setHeader(TRACE_ID_HEADER, traceId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.clear();
            RequestContextHolder.clear();
        }
    }

    private static String headerOrNewId(HttpServletRequest request, String headerName) {
        String value = request.getHeader(headerName);
        return value == null || value.isBlank() ? UUID.randomUUID().toString() : value;
    }

    private static String headerOrDefault(HttpServletRequest request, String headerName, String defaultValue) {
        String value = request.getHeader(headerName);
        return value == null || value.isBlank() ? defaultValue : value;
    }
}
