package com.orayve.service;

import com.orayve.dto.RegisterRequest;
import com.orayve.dto.UserDto;
import com.orayve.entity.Order;
import com.orayve.entity.User;
import com.orayve.exception.ConflictException;
import com.orayve.exception.ResourceNotFoundException;
import com.orayve.repository.OrderRepository;
import com.orayve.repository.ProductRepository;
import com.orayve.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public AdminService(UserRepository userRepository, OrderRepository orderRepository, ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto createUser(RegisterRequest request) {
        String mobile = request.getMobile().trim();
        String email = request.getEmail().trim();

        if (userRepository.existsByMobileNumber(mobile)) {
            throw new ConflictException("Mobile number already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email already exists");
        }

        User u = new User(request.getName().trim(), request.getAge(), email, mobile, "ROLE_USER");
        User saved = userRepository.save(u);
        return new UserDto(saved);
    }

    @Transactional
    public UserDto toggleBan(String mobile, Boolean banned) {
        User u = userRepository.findByMobileNumber(mobile)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with mobile: " + mobile));

        u.setIsBanned(banned != null ? banned : !u.getIsBanned());
        User saved = userRepository.save(u);
        return new UserDto(saved);
    }

    @Transactional
    public void deleteUser(String mobile) {
        User u = userRepository.findByMobileNumber(mobile)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with mobile: " + mobile));
        userRepository.delete(u);
    }

    public Map<String, Object> getMetrics() {
        List<Order> orders = orderRepository.findAll();
        BigDecimal totalRevenue = orders.stream()
                .map(Order::getFinalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long userCount = userRepository.count();
        long productCount = productRepository.count();

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalRevenue", totalRevenue);
        metrics.put("totalOrders", orders.size());
        metrics.put("totalUsers", userCount);
        metrics.put("totalProducts", productCount);
        return metrics;
    }
}
