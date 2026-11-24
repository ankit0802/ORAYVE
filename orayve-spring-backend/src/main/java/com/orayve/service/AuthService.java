package com.orayve.service;

import com.orayve.dto.*;
import com.orayve.entity.User;
import com.orayve.exception.BadRequestException;
import com.orayve.exception.ConflictException;
import com.orayve.exception.ResourceNotFoundException;
import com.orayve.repository.UserRepository;
import com.orayve.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, OtpService otpService, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.tokenProvider = tokenProvider;
    }

    public Map<String, Object> sendOtp(SendOtpRequest request) {
        String rawMobile = request.getMobile() != null ? request.getMobile().trim() : "";
        String countryCode = request.getCountryCode() != null ? request.getCountryCode().trim() : "+91";

        if (rawMobile.isBlank()) {
            throw new BadRequestException("Mobile number is required");
        }

        // Clean digits
        String digitsOnly = rawMobile.replaceAll("[^0-9]", "");
        if (digitsOnly.length() < 7 || digitsOnly.length() > 15) {
            throw new BadRequestException("Please enter a valid mobile number (7-15 digits)");
        }

        String fullMobile = rawMobile.startsWith("+") ? rawMobile : (countryCode + digitsOnly);
        String liveOtp = otpService.generateAndSendOtp(fullMobile);

        Map<String, Object> result = new HashMap<>();
        result.put("mobile", fullMobile);
        result.put("countryCode", countryCode);
        result.put("expiresIn", 300);
        result.put("otp", liveOtp); // returned for live frontend toast & dev display

        return result;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String rawEmail = request.getEmail() != null ? request.getEmail().trim() : "";
        String rawMobile = request.getMobile() != null ? request.getMobile().trim() : "";
        String name = request.getName() != null ? request.getName().trim() : "";

        // 1. Strict Email Validation
        if (!EMAIL_PATTERN.matcher(rawEmail).matches()) {
            throw new BadRequestException("Please enter a valid email address (e.g. name@domain.com)");
        }

        // 2. Mobile validation
        if (rawMobile.isBlank()) {
            throw new BadRequestException("Mobile number is required");
        }

        // 3. Unique mobile check in database
        if (userRepository.existsByMobileNumber(rawMobile)) {
            throw new ConflictException("Mobile number " + rawMobile + " is already registered. Please login.");
        }

        // 4. Unique email check in database
        if (userRepository.existsByEmail(rawEmail)) {
            throw new ConflictException("Email address " + rawEmail + " is already registered.");
        }

        // 5. Verify live OTP
        boolean isOtpValid = otpService.verifyOtp(rawMobile, request.getOtp());
        if (!isOtpValid) {
            throw new BadRequestException("Invalid or expired OTP. Please enter the latest 6-digit OTP or click 'Send OTP'.");
        }

        // 6. Save to Neon PostgreSQL
        User newUser = new User(name, request.getAge(), rawEmail, rawMobile, "ROLE_USER");
        User savedUser = userRepository.save(newUser);
        log.info("[AUTH] Registered new user {} ({}) in Neon DB", savedUser.getFullName(), savedUser.getMobileNumber());

        // 7. Issue JWT token
        String token = tokenProvider.generateToken(savedUser.getMobileNumber(), savedUser.getFullName(), savedUser.getRole());
        return new AuthResponse(new UserDto(savedUser), token);
    }

    public AuthResponse login(LoginRequest request) {
        String rawMobile = request.getMobile() != null ? request.getMobile().trim() : "";

        if (rawMobile.isBlank()) {
            throw new BadRequestException("Mobile number is required");
        }

        // Lookup in Neon DB (or check with country code)
        User user = userRepository.findByMobileNumber(rawMobile)
                .orElse(null);

        if (user == null) {
            // Check if stripped digits match
            String digits = rawMobile.replaceAll("[^0-9]", "");
            user = userRepository.findAll().stream()
                    .filter(u -> u.getMobileNumber() != null && u.getMobileNumber().replaceAll("[^0-9]", "").endsWith(digits))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("No account found for mobile: " + rawMobile + ". Please register."));
        }

        if (user.getIsBanned()) {
            throw new BadRequestException("Account suspended. Please contact support@orayve.in for assistance.");
        }

        // Verify live OTP
        boolean isOtpValid = otpService.verifyOtp(rawMobile, request.getOtp());
        if (!isOtpValid) {
            throw new BadRequestException("Invalid or expired OTP. Please enter the latest 6-digit OTP or click 'Send OTP'.");
        }

        String token = tokenProvider.generateToken(user.getMobileNumber(), user.getFullName(), user.getRole());
        return new AuthResponse(new UserDto(user), token);
    }
}
