package com.orayve.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categories", schema = "public")
public class Category {

    @Id
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "slug", nullable = false)
    private String slug;

    @Column(name = "hsn_code")
    private String hsnCode;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public Category() {}

    public Category(Integer categoryId, String name, String slug, String hsnCode) {
        this.categoryId = categoryId;
        this.name = name;
        this.slug = slug;
        this.hsnCode = hsnCode;
        this.isActive = true;
    }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getHsnCode() { return hsnCode; }
    public void setHsnCode(String hsnCode) { this.hsnCode = hsnCode; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
