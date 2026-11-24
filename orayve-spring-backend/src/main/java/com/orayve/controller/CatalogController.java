package com.orayve.controller;

import com.orayve.dto.ApiResponse;
import com.orayve.dto.ProductResponseDto;
import com.orayve.entity.Category;
import com.orayve.service.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog")
@Tag(name = "Catalog", description = "Categories, products, and search")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/categories")
    @Operation(summary = "List all luxury watch categories")
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(catalogService.getAllCategories()));
    }

    @GetMapping("/products")
    @Operation(summary = "List all luxury watch products with variants")
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> getProducts() {
        return ResponseEntity.ok(ApiResponse.ok(catalogService.getAllProducts()));
    }

    @GetMapping("/products/{id}")
    @Operation(summary = "Get single product by ID")
    public ResponseEntity<ApiResponse<ProductResponseDto>> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(catalogService.getProductById(id)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by keyword")
    public ResponseEntity<ApiResponse<List<ProductResponseDto>>> searchProducts(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(ApiResponse.ok(catalogService.searchProducts(q)));
    }
}
