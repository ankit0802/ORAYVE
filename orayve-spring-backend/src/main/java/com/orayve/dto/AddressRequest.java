package com.orayve.dto;

import jakarta.validation.constraints.NotBlank;

public class AddressRequest {

    private String mobile;

    @NotBlank(message = "Recipient name is required")
    private String name;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Street address is required")
    private String street;

    private String city = "Pune";
    private String state = "Maharashtra";

    @NotBlank(message = "PIN code is required")
    private String pin;

    public AddressRequest() {}

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}
