package com.orayve.dto;

import jakarta.validation.constraints.NotBlank;

public class SendOtpRequest {

    @NotBlank(message = "Mobile number is required")
    private String mobile;

    private String countryCode = "+91";

    public SendOtpRequest() {}

    public SendOtpRequest(String mobile, String countryCode) {
        this.mobile = mobile;
        this.countryCode = countryCode;
    }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }
}
