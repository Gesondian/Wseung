package com.example.lowcode.auth.application;

import com.example.lowcode.audit.application.SecurityEventService;
import com.example.lowcode.auth.api.LoginRequest;
import com.example.lowcode.auth.api.LoginResponse;
import com.example.lowcode.common.error.BusinessException;
import com.example.lowcode.common.error.ErrorCode;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AuthApplicationService {
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    private final SecurityEventService securityEventService;

    public AuthApplicationService(SecurityEventService securityEventService) {
        this.securityEventService = securityEventService;
    }

    public LoginResponse login(LoginRequest request) {
        if (!ADMIN_USERNAME.equals(request.loginIdentifier()) || !ADMIN_PASSWORD.equals(request.password())) {
            securityEventService.record("auth.login_failed", request.loginIdentifier(), "内置账号密码校验失败");
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "用户名或密码错误");
        }

        return new LoginResponse(
                "mock_backend_access_token",
                "Bearer",
                7200,
                currentUser()
        );
    }

    public LoginResponse.LoginUser currentUser() {
        return new LoginResponse.LoginUser("usr_admin", "admin", "系统管理员", "org_headquarters", List.of("system_admin"));
    }
}
