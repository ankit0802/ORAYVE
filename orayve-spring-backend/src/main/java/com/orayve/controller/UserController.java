package com.orayve.controller;

import com.orayve.dto.AddressRequest;
import com.orayve.dto.ApiResponse;
import com.orayve.entity.UserAddress;
import com.orayve.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User addresses and profile")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/addresses")
    @Operation(summary = "Save delivery address for user")
    public ResponseEntity<ApiResponse<UserAddress>> saveAddress(@Valid @RequestBody AddressRequest request) {
        UserAddress address = userService.saveAddress(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Address saved successfully", address));
    }

    @GetMapping("/addresses/{mobile}")
    @Operation(summary = "Get saved addresses by user mobile")
    public ResponseEntity<ApiResponse<List<UserAddress>>> getAddresses(@PathVariable String mobile) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getAddressesByMobile(mobile)));
    }
}
