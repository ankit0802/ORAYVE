package com.orayve.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Health", description = "System health check")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "System health check and brand metadata")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "ONLINE");
        status.put("brand", "ORAYVE");
        status.put("tagline", "Small Details. Big Presence.");
        status.put("backend", "Java 17 Spring Boot 3.2.5 Enterprise Edition");
        status.put("database", "Neon PostgreSQL (AWS US-East-2)");
        status.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(status);
    }
}
