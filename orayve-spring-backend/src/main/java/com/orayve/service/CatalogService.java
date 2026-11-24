package com.orayve.service;

import com.orayve.dto.ProductResponseDto;
import com.orayve.entity.Category;
import com.orayve.entity.Product;
import com.orayve.exception.ResourceNotFoundException;
import com.orayve.repository.CategoryRepository;
import com.orayve.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CatalogService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    public List<ProductResponseDto> getAllProducts() {
        return productRepository.findAllWithVariants().stream()
                .map(ProductResponseDto::new)
                .collect(Collectors.toList());
    }

    public ProductResponseDto getProductById(String id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return new ProductResponseDto(p);
    }

    public List<ProductResponseDto> searchProducts(String query) {
        if (query == null || query.isBlank()) {
            return getAllProducts();
        }
        return productRepository.searchProducts(query.trim()).stream()
                .map(ProductResponseDto::new)
                .collect(Collectors.toList());
    }
}
