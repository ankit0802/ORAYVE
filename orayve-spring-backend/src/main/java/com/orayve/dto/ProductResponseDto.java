package com.orayve.dto;

import com.orayve.entity.Product;
import com.orayve.entity.ProductVariant;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductResponseDto {
    private String id;
    private String title;
    private String cat;
    private String hsn;
    private String style;
    private BigDecimal rating;
    private Integer reviews;
    private Long views;
    private Long sold;
    private Boolean coupon;
    private List<VariantResponseDto> v = new ArrayList<>();

    public ProductResponseDto() {}

    public ProductResponseDto(Product product) {
        this.id = product.getProductId();
        this.title = product.getTitle();
        this.cat = product.getCategoryName();
        this.hsn = product.getHsnCode();
        this.style = product.getDesignStyle();
        this.rating = product.getRatingAvg();
        this.reviews = product.getReviewCount();
        this.views = product.getViewCount();
        this.sold = product.getTotalUnitsSold();
        this.coupon = product.getIsCouponApplicable();
        if (product.getVariants() != null) {
            for (ProductVariant variant : product.getVariants()) {
                this.v.add(new VariantResponseDto(variant));
            }
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCat() { return cat; }
    public void setCat(String cat) { this.cat = cat; }

    public String getHsn() { return hsn; }
    public void setHsn(String hsn) { this.hsn = hsn; }

    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getReviews() { return reviews; }
    public void setReviews(Integer reviews) { this.reviews = reviews; }

    public Long getViews() { return views; }
    public void setViews(Long views) { this.views = views; }

    public Long getSold() { return sold; }
    public void setSold(Long sold) { this.sold = sold; }

    public Boolean getCoupon() { return coupon; }
    public void setCoupon(Boolean coupon) { this.coupon = coupon; }

    public List<VariantResponseDto> getV() { return v; }
    public void setV(List<VariantResponseDto> v) { this.v = v; }

    public static class VariantResponseDto {
        private String id;
        private String sku;
        private String color;
        private String hex;
        private String photo;
        private BigDecimal mrp;
        private BigDecimal disc;
        private BigDecimal price;
        private Integer stock;

        public VariantResponseDto() {}

        public VariantResponseDto(ProductVariant variant) {
            this.id = variant.getVariantId();
            this.sku = variant.getSku();
            this.color = variant.getColorName();
            this.hex = variant.getColorHex();
            this.photo = variant.getPhotoUrl();
            this.mrp = variant.getMrpPrice();
            this.disc = variant.getDiscountPercent();
            this.price = variant.getSalePrice();
            this.stock = variant.getStockQuantity();
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }

        public String getHex() { return hex; }
        public void setHex(String hex) { this.hex = hex; }

        public String getPhoto() { return photo; }
        public void setPhoto(String photo) { this.photo = photo; }

        public BigDecimal getMrp() { return mrp; }
        public void setMrp(BigDecimal mrp) { this.mrp = mrp; }

        public BigDecimal getDisc() { return disc; }
        public void setDisc(BigDecimal disc) { this.disc = disc; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public Integer getStock() { return stock; }
        public void setStock(Integer stock) { this.stock = stock; }
    }
}
