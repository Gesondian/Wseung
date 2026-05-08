package com.example.lowcode.common.context;

import java.util.Optional;

public final class RequestContextHolder {
    private static final ThreadLocal<RequestContext> HOLDER = new ThreadLocal<>();

    private RequestContextHolder() {
    }

    public static void set(RequestContext context) {
        HOLDER.set(context);
    }

    public static Optional<RequestContext> current() {
        return Optional.ofNullable(HOLDER.get());
    }

    public static RequestContext require() {
        return current().orElseGet(() -> RequestContext.anonymous("missing-request-id", "missing-trace-id"));
    }

    public static void clear() {
        HOLDER.remove();
    }
}
