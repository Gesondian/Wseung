package com.example.lowcode.auth.api;

import com.example.lowcode.auth.application.AuthApplicationService;
import com.example.lowcode.common.ApiResponse;
import com.example.lowcode.common.web.ResponseFactory;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthApplicationService authApplicationService;
    private final ResponseFactory responseFactory;

    public AuthController(AuthApplicationService authApplicationService, ResponseFactory responseFactory) {
        this.authApplicationService = authApplicationService;
        this.responseFactory = responseFactory;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return responseFactory.ok(authApplicationService.login(request));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        return responseFactory.ok(null);
    }

    @GetMapping("/me")
    public ApiResponse<LoginResponse.LoginUser> me() {
        return responseFactory.ok(authApplicationService.currentUser());
    }
}
