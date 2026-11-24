package com.orayve.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_addresses", schema = "public")
public class UserAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "address_id", updatable = false, nullable = false)
    private UUID addressId;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "recipient_name", nullable = false)
    private String recipientName;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "street_line1", nullable = false, columnDefinition = "text")
    private String streetLine1;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "state")
    private String state = "Maharashtra";

    @Column(name = "pincode", nullable = false)
    private String pincode;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public UserAddress() {}

    public UserAddress(String mobile, String recipientName, String phone, String streetLine1, String city, String state, String pincode) {
        this.mobile = mobile;
        this.recipientName = recipientName;
        this.phone = phone;
        this.streetLine1 = streetLine1;
        this.city = city != null ? city : "Pune";
        this.state = state != null ? state : "Maharashtra";
        this.pincode = pincode;
        this.createdAt = OffsetDateTime.now();
    }

    public UUID getAddressId() { return addressId; }
    public void setAddressId(UUID addressId) { this.addressId = addressId; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStreetLine1() { return streetLine1; }
    public void setStreetLine1(String streetLine1) { this.streetLine1 = streetLine1; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
