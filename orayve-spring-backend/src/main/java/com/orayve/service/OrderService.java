package com.orayve.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.orayve.dto.CartItemDto;
import com.orayve.dto.OrderRequest;
import com.orayve.entity.Coupon;
import com.orayve.entity.Order;
import com.orayve.entity.OrderItem;
import com.orayve.exception.BadRequestException;
import com.orayve.exception.ResourceNotFoundException;
import com.orayve.repository.CouponRepository;
import com.orayve.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final CouponRepository couponRepository;
    private final ObjectMapper objectMapper;

    public OrderService(OrderRepository orderRepository, CouponRepository couponRepository, ObjectMapper objectMapper) {
        this.orderRepository = orderRepository;
        this.couponRepository = couponRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public Order placeOrder(OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place an order with an empty cart");
        }

        long rand = 10000 + new Random().nextInt(90000);
        String orderNumber = "ORD-ORV-" + rand;
        String invoiceNumber = "INV-ORV-" + OffsetDateTime.now().getYear() + "-" + (1000 + new Random().nextInt(9000));

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItemDto item : request.getItems()) {
            BigDecimal price = item.getPrice() != null ? item.getPrice() : BigDecimal.ZERO;
            int q = item.getQ() != null ? item.getQ() : 1;
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(q)));
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (request.getCoupon() != null && !request.getCoupon().isBlank()) {
            Optional<Coupon> couponOpt = couponRepository.findByCodeIgnoreCase(request.getCoupon().trim());
            if (couponOpt.isPresent() && couponOpt.get().getIsActive()) {
                Coupon c = couponOpt.get();
                if ("PERCENT".equalsIgnoreCase(c.getDiscountType())) {
                    discount = subtotal.multiply(c.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                    if (c.getMaxDiscountCap() != null && discount.compareTo(c.getMaxDiscountCap()) > 0) {
                        discount = c.getMaxDiscountCap();
                    }
                } else {
                    discount = c.getDiscountValue();
                }
            }
        }

        BigDecimal finalAmount = subtotal.subtract(discount).max(BigDecimal.ZERO);

        String addressJson = "{}";
        try {
            if (request.getAddr() != null) {
                addressJson = objectMapper.writeValueAsString(request.getAddr());
            }
        } catch (Exception e) {
            addressJson = String.valueOf(request.getAddr());
        }

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setInvoiceNumber(invoiceNumber);
        order.setUserMobile(request.getMobile());
        order.setShippingAddressSnapshot(addressJson);
        order.setSubtotalAmount(subtotal);
        order.setDiscountAmount(discount);
        order.setFinalAmount(finalAmount);
        order.setPaymentMethod(request.getPay() != null ? request.getPay() : "COD");
        order.setPaymentStatus("COD".equalsIgnoreCase(request.getPay()) ? "PENDING" : "PAID");
        order.setOrderStatus(0);
        order.setCreatedAt(OffsetDateTime.now());

        List<OrderItem> items = new ArrayList<>();
        for (CartItemDto cartItem : request.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductTitle(cartItem.getTitle() != null ? cartItem.getTitle() : "Luxury Watch");
            orderItem.setCategoryName(cartItem.getCat() != null ? cartItem.getCat() : "Chronograph");
            orderItem.setColorName(cartItem.getColor() != null ? cartItem.getColor() : "Classic");
            orderItem.setSku(cartItem.getSku() != null ? cartItem.getSku() : "SKU-" + System.currentTimeMillis());
            orderItem.setUnitPrice(cartItem.getPrice() != null ? cartItem.getPrice() : BigDecimal.valueOf(2999));
            orderItem.setQuantity(cartItem.getQ() != null ? cartItem.getQ() : 1);
            orderItem.setHsnCode("9102");
            items.add(orderItem);
        }

        order.setItems(items);
        Order savedOrder = orderRepository.save(order);
        log.info("[ORDER] Placed order {} for {} (Total: ₹{})", savedOrder.getOrderNumber(), savedOrder.getUserMobile(), savedOrder.getFinalAmount());
        return savedOrder;
    }

    public List<Order> getOrdersByMobile(String mobile) {
        return orderRepository.findByUserMobileOrderByCreatedAtDesc(mobile);
    }

    public Order getOrderById(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));
    }
}
