package com.orayve.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", schema = "public")
public class Product {

    @Id
    @Column(name = "product_id")
    private String productId;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "slug", nullable = false)
    private String slug;

    @Column(name = "design_style", nullable = false)
    private String designStyle;

    @Column(name = "hsn_code")
    private String hsnCode;

    @Column(name = "rating_avg")
    private BigDecimal ratingAvg = BigDecimal.valueOf(4.8);

    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Column(name = "view_count")
    private Long viewCount = 0L;

    @Column(name = "total_units_sold")
    private Long totalUnitsSold = 0L;

    @Column(name = "is_coupon_applicable")
    private Boolean isCouponApplicable = true;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private List<ProductVariant> variants = new ArrayList<>();

    public Product() {}

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDesignStyle() { return designStyle; }
    public void setDesignStyle(String designStyle) { this.designStyle = designStyle; }

    public String getHsnCode() { return hsnCode; }
    public void setHsnCode(String hsnCode) { this.hsnCode = hsnCode; }

    public BigDecimal getRatingAvg() { return ratingAvg; }
    public void setRatingAvg(BigDecimal ratingAvg) { this.ratingAvg = ratingAvg; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public Long getTotalUnitsSold() { return totalUnitsSold; }
    public void setTotalUnitsSold(Long totalUnitsSold) { this.totalUnitsSold = totalUnitsSold; }

    public Boolean getIsCouponApplicable() { return isCouponApplicable; }
    public void setIsCouponApplicable(Boolean isCouponApplicable) { this.isCouponApplicable = isCouponApplicable; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public List<ProductVariant> getVariants() { return variants; }
    public void setVariants(List<ProductVariant> variants) { this.variants = variants; }
}
