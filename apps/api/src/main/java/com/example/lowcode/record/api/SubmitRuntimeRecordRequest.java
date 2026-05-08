package com.example.lowcode.record.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubmitRuntimeRecordRequest(
        long recordVersion,
        @NotNull @NotBlank String idempotencyKey
) {
}
