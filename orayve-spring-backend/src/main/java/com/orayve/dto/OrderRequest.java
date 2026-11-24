package com.orayve.dto;

import java.util.List;
import java.util.Map;

public class OrderRequest {

    private String mobile;
    private Map<String, Object> addr;
    private List<CartItemDto> items;
    private String pay;
    private String coupon;

    public OrderRequest() {}

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public Map<String, Object> getAddr() { return addr; }
    public void setAddr(Map<String, Object> addr) { this.addr = addr; }

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }

    public String getPay() { return pay; }
    public void setPay(String pay) { this.pay = pay; }

    public String getCoupon() { return coupon; }
    public void setCoupon(String coupon) { this.coupon = coupon; }
}
