package com.example.lowcode.auth.api;

import java.util.List;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        LoginUser user
) {
    public record LoginUser(
            String id,
            String username,
            String displayName,
            String primaryOrgId,
            List<String> roles
    ) {
    }
}
