package com.example.lowcode.record.api;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotNull;

public record SaveRuntimeRecordRequest(
        Long recordVersion,
        @NotNull JsonNode data
) {
}
