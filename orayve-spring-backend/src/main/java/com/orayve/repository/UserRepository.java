package com.orayve.repository;

import com.orayve.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByMobileNumber(String mobileNumber);
    Optional<User> findByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);
    boolean existsByEmail(String email);
    List<User> findAllByOrderByCreatedAtDesc();
}
