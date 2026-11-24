package com.orayve.controller;

import com.orayve.dto.ApiResponse;
import com.orayve.dto.CouponApplyRequest;
import com.orayve.entity.Coupon;
import com.orayve.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@Tag(name = "Coupons", description = "Coupon listing and discount calculation")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @GetMapping
    @Operation(summary = "List all active promotional coupons")
    public ResponseEntity<ApiResponse<List<Coupon>>> getCoupons() {
        return ResponseEntity.ok(ApiResponse.ok(couponService.getAllCoupons()));
    }

    @PostMapping("/apply")
    @Operation(summary = "Apply coupon code to order amount")
    public ResponseEntity<ApiResponse<Map<String, Object>>> applyCoupon(@Valid @RequestBody CouponApplyRequest request) {
        Map<String, Object> data = couponService.applyCoupon(request);
        return ResponseEntity.ok(ApiResponse.ok("Coupon applied successfully", data));
    }
}
