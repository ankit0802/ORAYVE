package com.orayve.repository;

import com.orayve.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query(value = "SELECT COUNT(*) > 0 FROM users WHERE RIGHT(REGEXP_REPLACE(mobile_number, '[^0-9]', '', 'g'), 10) = :suffix", nativeQuery = true)
    boolean existsByMobileSuffix(@Param("suffix") String suffix);

    @Query(value = "SELECT * FROM users WHERE RIGHT(REGEXP_REPLACE(mobile_number, '[^0-9]', '', 'g'), 10) = :suffix LIMIT 1", nativeQuery = true)
    Optional<User> findByMobileSuffix(@Param("suffix") String suffix);
}
