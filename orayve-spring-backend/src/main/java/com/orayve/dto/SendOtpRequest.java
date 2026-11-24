package com.orayve.dto;

import jakarta.validation.constraints.NotBlank;

public class SendOtpRequest {

    @NotBlank(message = "Mobile number is required")
    private String mobile;

    private String countryCode = "+91";
    private String purpose; // "register", "login", or null

    public SendOtpRequest() {}

    public SendOtpRequest(String mobile, String countryCode) {
        this.mobile = mobile;
        this.countryCode = countryCode;
    }

    public SendOtpRequest(String mobile, String countryCode, String purpose) {
        this.mobile = mobile;
        this.countryCode = countryCode;
        this.purpose = purpose;
    }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
}
