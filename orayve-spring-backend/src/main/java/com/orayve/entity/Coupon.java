package com.orayve.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "coupons", schema = "public")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "coupon_id", updatable = false, nullable = false)
    private UUID couponId;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "discount_type", nullable = false)
    private String discountType = "PERCENT"; // "PERCENT" or "FLAT"

    @Column(name = "discount_value", nullable = false)
    private BigDecimal discountValue;

    @Column(name = "min_order_amount")
    private BigDecimal minOrderAmount = BigDecimal.ZERO;

    @Column(name = "max_discount_cap")
    private BigDecimal maxDiscountCap = BigDecimal.valueOf(100000);

    @Column(name = "is_active")
    private Boolean isActive = true;

    public Coupon() {}

    public Coupon(String code, String discountType, BigDecimal discountValue, BigDecimal minOrderAmount, BigDecimal maxDiscountCap) {
        this.code = code != null ? code.trim().toUpperCase() : null;
        this.discountType = discountType != null ? discountType : "PERCENT";
        this.discountValue = discountValue;
        this.minOrderAmount = minOrderAmount != null ? minOrderAmount : BigDecimal.ZERO;
        this.maxDiscountCap = maxDiscountCap != null ? maxDiscountCap : BigDecimal.valueOf(100000);
        this.isActive = true;
    }

    public UUID getCouponId() { return couponId; }
    public void setCouponId(UUID couponId) { this.couponId = couponId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code != null ? code.trim().toUpperCase() : null; }

    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public BigDecimal getMaxDiscountCap() { return maxDiscountCap; }
    public void setMaxDiscountCap(BigDecimal maxDiscountCap) { this.maxDiscountCap = maxDiscountCap; }

    public Boolean getIsActive() { return isActive != null && isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
