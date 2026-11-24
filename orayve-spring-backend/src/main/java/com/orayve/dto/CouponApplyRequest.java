package com.orayve.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class CouponApplyRequest {

    @NotBlank(message = "Coupon code is required")
    private String code;

    private BigDecimal amount = BigDecimal.ZERO;

    public CouponApplyRequest() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
