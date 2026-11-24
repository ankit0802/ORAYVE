package com.orayve.repository;

import com.orayve.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByUserMobileOrderByCreatedAtDesc(String userMobile);
    List<Order> findAllByOrderByCreatedAtDesc();
}
