package com.orayve.controller;

import com.orayve.dto.ApiResponse;
import com.orayve.dto.OrderRequest;
import com.orayve.entity.Order;
import com.orayve.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@Tag(name = "Orders & Checkout", description = "Order placement and history")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/api/checkout/place-order")
    @Operation(summary = "Place order with items, shipping address, and payment method")
    public ResponseEntity<ApiResponse<Order>> placeOrder(@Valid @RequestBody OrderRequest request) {
        Order order = orderService.placeOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Order placed successfully. Confirmation: " + order.getOrderNumber(), order));
    }

    @GetMapping("/api/orders/user/{mobile}")
    @Operation(summary = "Get user order history by mobile number")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByMobile(@PathVariable String mobile) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrdersByMobile(mobile)));
    }

    @GetMapping("/api/orders/{id}")
    @Operation(summary = "Get order details by UUID or order number")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderById(uuid)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderByNumber(id)));
        }
    }
}
