package com.example.lowcode.auth.api;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String loginIdentifier,
        @NotBlank String password,
        boolean rememberMe
) {
}
