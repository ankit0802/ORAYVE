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
        String suffix = digitsOnly.length() >= 10 ? digitsOnly.substring(digitsOnly.length() - 10) : digitsOnly;

        // Context-aware early check to save SMS costs & provide immediate feedback
        if ("register".equalsIgnoreCase(request.getPurpose())) {
            if (userRepository.existsByMobileSuffix(suffix)) {
                throw new ConflictException("Mobile number " + fullMobile + " is already registered. Please switch to Login.");
            }
        } else if ("login".equalsIgnoreCase(request.getPurpose())) {
            if (!userRepository.existsByMobileSuffix(suffix)) {
                throw new ResourceNotFoundException("No account found for mobile " + fullMobile + ". Please switch to Register.");
            }
        }

        String liveOtp = otpService.generateAndSendOtp(fullMobile);

        Map<String, Object> result = new HashMap<>();
        result.put("mobile", fullMobile);
        result.put("countryCode", countryCode);
        result.put("expiresIn", 300);

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

        // 3. Bulletproof Unique Mobile Check using DB functional index
        String digits = rawMobile.replaceAll("[^0-9]", "");
        if (digits.length() < 7 || digits.length() > 15) {
            throw new BadRequestException("Please enter a valid mobile number (7-15 digits)");
        }
        String checkDigits = digits.length() >= 10 ? digits.substring(digits.length() - 10) : digits;
        if (userRepository.existsByMobileSuffix(checkDigits)) {
            throw new ConflictException("Mobile number " + rawMobile + " is already registered. Please switch to Login.");
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
        User savedUser;
        try {
            savedUser = userRepository.save(newUser);
        } catch (org.springframework.dao.DataIntegrityViolationException dive) {
            log.error("[DB] Unique constraint violation on user registration: {}", dive.getMessage());
            throw new ConflictException("Mobile number or email is already registered in the system.");
        }
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

        String digits = rawMobile.replaceAll("[^0-9]", "");
        String checkDigits = digits.length() >= 10 ? digits.substring(digits.length() - 10) : digits;

        // Lookup in Neon DB via indexed suffix query
        User user = userRepository.findByMobileSuffix(checkDigits)
                .orElseThrow(() -> new ResourceNotFoundException("No account found for mobile: " + rawMobile + ". Please register."));

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
