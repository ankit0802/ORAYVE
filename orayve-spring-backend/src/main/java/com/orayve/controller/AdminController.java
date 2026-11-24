package com.orayve.controller;

import com.orayve.dto.ApiResponse;
import com.orayve.dto.RegisterRequest;
import com.orayve.dto.UserDto;
import com.orayve.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Operations", description = "User management, metrics, and catalog administration")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    @Operation(summary = "List all registered users from database")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsers() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllUsers()));
    }

    @PostMapping("/users")
    @Operation(summary = "Admin create user")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody RegisterRequest request) {
        UserDto user = adminService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User created successfully", user));
    }

    @PatchMapping("/users/{mobile}/ban")
    @Operation(summary = "Toggle user ban/suspension status")
    public ResponseEntity<ApiResponse<UserDto>> toggleBan(
            @PathVariable String mobile,
            @RequestBody(required = false) Map<String, Boolean> body) {
        Boolean banned = body != null ? body.get("banned") : null;
        UserDto user = adminService.toggleBan(mobile, banned);
        return ResponseEntity.ok(ApiResponse.ok(user.isBanned() ? "User banned" : "User unbanned", user));
    }

    @DeleteMapping("/users/{mobile}")
    @Operation(summary = "Delete user from database")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String mobile) {
        adminService.deleteUser(mobile);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get overall business analytics metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getMetrics()));
    }
}
