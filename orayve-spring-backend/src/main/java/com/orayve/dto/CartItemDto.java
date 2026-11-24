package com.orayve.dto;

import java.math.BigDecimal;

public class CartItemDto {
    private String pid;
    private String vid;
    private String title;
    private String cat;
    private String color;
    private BigDecimal price;
    private Integer q;
    private String sku;

    public CartItemDto() {}

    public String getPid() { return pid; }
    public void setPid(String pid) { this.pid = pid; }

    public String getVid() { return vid; }
    public void setVid(String vid) { this.vid = vid; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCat() { return cat; }
    public void setCat(String cat) { this.cat = cat; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQ() { return q; }
    public void setQ(Integer q) { this.q = q; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
}
