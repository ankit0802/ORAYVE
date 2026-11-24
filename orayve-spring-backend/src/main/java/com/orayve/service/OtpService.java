package com.orayve.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Value("${orayve.sms.twilio.account-sid:${TWILIO_ACCOUNT_SID:}}")
    private String twilioSid;

    @Value("${orayve.sms.twilio.auth-token:${TWILIO_AUTH_TOKEN:}}")
    private String twilioToken;

    @Value("${orayve.sms.twilio.from-number:${TWILIO_PHONE_NUMBER:}}")
    private String twilioFrom;

    @Value("${orayve.sms.fast2sms.api-key:${FAST2SMS_API_KEY:}}")
    private String fast2smsApiKey;

    // Thread-safe in-memory cache for live OTPs: mobile -> OtpEntry
    private final Map<String, OtpEntry> otpStorage = new ConcurrentHashMap<>();

    public static class OtpEntry {
        private final String otp;
        private final Instant expiryTime;
        private int attempts;

        public OtpEntry(String otp, Instant expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
            this.attempts = 0;
        }

        public String getOtp() { return otp; }
        public Instant getExpiryTime() { return expiryTime; }
        public int getAttempts() { return attempts; }
        public void incrementAttempts() { this.attempts++; }
    }

    /**
     * Generates and delivers a cryptographically secure 6-digit OTP.
     */
    public String generateAndSendOtp(String fullMobileNumber) {
        String cleanMobile = fullMobileNumber.replaceAll("\\s+", "");

        // Generate genuine 6-digit cryptographic OTP
        int number = 100000 + RANDOM.nextInt(900000);
        String liveOtp = String.valueOf(number);

        // Store with 5-minute validity
        Instant expiry = Instant.now().plus(5, ChronoUnit.MINUTES);
        otpStorage.put(cleanMobile, new OtpEntry(liveOtp, expiry));

        // Deliver real SMS to physical mobile handset via SMS Gateway
        deliverSms(cleanMobile, liveOtp);

        return liveOtp;
    }

    /**
     * Verifies the OTP for a mobile number.
     * Developer master key fallback '123456' is also supported.
     */
    public boolean verifyOtp(String fullMobileNumber, String userEnteredOtp) {
        if (userEnteredOtp == null || userEnteredOtp.isBlank()) {
            return false;
        }

        String trimmedOtp = userEnteredOtp.trim();
        String cleanMobile = fullMobileNumber.replaceAll("\\s+", "");

        // Developer / test master key fallback
        if ("123456".equals(trimmedOtp)) {
            log.info("[OTP] Developer master OTP accepted for {}", cleanMobile);
            return true;
        }

        OtpEntry entry = otpStorage.get(cleanMobile);
        if (entry == null) {
            log.warn("[OTP] No active OTP found for {}", cleanMobile);
            return false;
        }

        if (Instant.now().isAfter(entry.getExpiryTime())) {
            log.warn("[OTP] Expired OTP attempt for {}", cleanMobile);
            otpStorage.remove(cleanMobile);
            return false;
        }

        entry.incrementAttempts();
        if (entry.getAttempts() > 5) {
            log.warn("[OTP] Too many failed attempts for {}. Invalidating.", cleanMobile);
            otpStorage.remove(cleanMobile);
            return false;
        }

        if (entry.getOtp().equals(trimmedOtp)) {
            log.info("[OTP] Successfully verified live OTP for {}", cleanMobile);
            otpStorage.remove(cleanMobile); // Invalidate on success
            return true;
        }

        log.warn("[OTP] Mismatched OTP for {}. Expected: {}, Received: {}", cleanMobile, entry.getOtp(), trimmedOtp);
        return false;
    }

    private void deliverSms(String mobile, String otp) {
        boolean smsDispatched = false;

        // Extract pure 10 digits for Indian SMS gateways (Fast2SMS)
        String digits = mobile.replaceAll("[^0-9]", "");
        if (digits.startsWith("91") && digits.length() == 12) {
            digits = digits.substring(2);
        }

        // 1. Dispatch via Fast2SMS Gateway (India)
        if (fast2smsApiKey != null && !fast2smsApiKey.isBlank()) {
            try {
                log.info("[SMS] Dispatching live real SMS via Fast2SMS Quick Route to {}", digits);
                String quickBody = String.format("{\"route\":\"q\",\"message\":\"Your ORAYVE verification code is %s. Valid for 5 minutes.\",\"language\":\"english\",\"flash\":0,\"numbers\":\"%s\"}", otp, digits);
                HttpRequest qReq = HttpRequest.newBuilder()
                        .uri(URI.create("https://www.fast2sms.com/dev/bulkV2"))
                        .header("authorization", fast2smsApiKey.trim())
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(quickBody))
                        .build();

                HttpResponse<String> qResp = HTTP_CLIENT.send(qReq, HttpResponse.BodyHandlers.ofString());
                log.info("[SMS] Fast2SMS Gateway Result: {}", qResp.body());

                if (qResp.body() != null && (qResp.body().contains("\"return\":true") || qResp.body().contains("\"status_code\":200"))) {
                    smsDispatched = true;
                }
            } catch (Exception e) {
                log.error("[SMS] Fast2SMS delivery error: {}", e.getMessage());
            }
        }

        // 2. Dispatch via Twilio Gateway (International & India)
        if (!smsDispatched && twilioSid != null && !twilioSid.isBlank() && twilioToken != null && !twilioToken.isBlank()) {
            try {
                String toMobile = mobile.startsWith("+") ? mobile : ("+" + mobile);
                log.info("[SMS] Dispatching live carrier SMS via Twilio to {}", toMobile);

                String auth = Base64.getEncoder().encodeToString((twilioSid.trim() + ":" + twilioToken.trim()).getBytes(StandardCharsets.UTF_8));
                String message = "Your ORAYVE verification code is: " + otp + ". Valid for 5 minutes.";
                String form = "To=" + URLEncoder.encode(toMobile, StandardCharsets.UTF_8)
                        + "&From=" + URLEncoder.encode(twilioFrom != null ? twilioFrom.trim() : "", StandardCharsets.UTF_8)
                        + "&Body=" + URLEncoder.encode(message, StandardCharsets.UTF_8);

                HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create("https://api.twilio.com/2010-04-01/Accounts/" + twilioSid.trim() + "/Messages.json"))
                        .header("Authorization", "Basic " + auth)
                        .header("Content-Type", "application/x-www-form-urlencoded")
                        .POST(HttpRequest.BodyPublishers.ofString(form))
                        .build();

                HttpResponse<String> resp = HTTP_CLIENT.send(req, HttpResponse.BodyHandlers.ofString());
                log.info("[SMS] Twilio Gateway Status: {}, Response: {}", resp.statusCode(), resp.body());
                smsDispatched = resp.statusCode() >= 200 && resp.statusCode() < 300;
            } catch (Exception e) {
                log.error("[SMS] Twilio delivery error: {}", e.getMessage());
            }
        }

        // 3. High-visibility console log
        System.out.println("\n=======================================================");
        System.out.printf("  [ORAYVE LIVE SMS DISPATCH] Recipient: %s%n", mobile);
        System.out.printf("  [LIVE OTP CODE]          : %s (Valid for 5 mins)%n", otp);
        System.out.printf("  [REAL CARRIER DISPATCH]  : %s%n", smsDispatched ? "DELIVERED TO PHONE" : "PENDING GATEWAY KEY (Set FAST2SMS_API_KEY or TWILIO credentials in .env)");
        System.out.println("=======================================================\n");
    }
}
