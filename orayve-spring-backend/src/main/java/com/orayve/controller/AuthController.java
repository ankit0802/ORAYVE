package com.orayve.controller;

import com.orayve.dto.*;
import com.orayve.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Live OTP generation, registration, and login")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send live OTP to mobile number with country code")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        Map<String, Object> data = authService.sendOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("Live OTP generated and sent to " + data.get("mobile"), data));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user with unique mobile, validated email, and OTP verification")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Account created successfully for " + response.getUser().getName(), response));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user using mobile number and verified OTP")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Welcome back, " + response.getUser().getName(), response));
    }
}
