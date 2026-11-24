package com.orayve.service;

import com.orayve.dto.CouponApplyRequest;
import com.orayve.entity.Coupon;
import com.orayve.exception.BadRequestException;
import com.orayve.exception.ResourceNotFoundException;
import com.orayve.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Map<String, Object> applyCoupon(CouponApplyRequest req) {
        String code = req.getCode() != null ? req.getCode().trim().toUpperCase() : "";
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid coupon code: " + code));

        if (!coupon.getIsActive()) {
            throw new BadRequestException("Coupon " + code + " is no longer active");
        }

        BigDecimal orderAmount = req.getAmount() != null ? req.getAmount() : BigDecimal.ZERO;
        if (orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException("Minimum order value for " + code + " is ₹" + coupon.getMinOrderAmount());
        }

        BigDecimal discount;
        if ("PERCENT".equalsIgnoreCase(coupon.getDiscountType())) {
            discount = orderAmount.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountCap() != null && discount.compareTo(coupon.getMaxDiscountCap()) > 0) {
                discount = coupon.getMaxDiscountCap();
            }
        } else {
            discount = coupon.getDiscountValue();
        }

        BigDecimal finalAmount = orderAmount.subtract(discount).max(BigDecimal.ZERO);

        Map<String, Object> result = new HashMap<>();
        result.put("code", coupon.getCode());
        result.put("discountType", coupon.getDiscountType());
        result.put("discountAmount", discount);
        result.put("finalAmount", finalAmount);
        return result;
    }
}
