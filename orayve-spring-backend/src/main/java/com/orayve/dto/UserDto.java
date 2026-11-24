package com.orayve.dto;

import com.orayve.entity.User;
import java.time.format.DateTimeFormatter;

public class UserDto {
    private String name;
    private Integer age;
    private String email;
    private String mobile;
    private String role;
    private boolean banned;
    private String at;

    public UserDto() {}

    public UserDto(User user) {
        this.name = user.getFullName();
        this.age = user.getAge() != null ? user.getAge() : 25;
        this.email = user.getEmail() != null ? user.getEmail() : "";
        this.mobile = user.getMobileNumber();
        this.role = user.getRole();
        this.banned = user.getIsBanned();
        if (user.getCreatedAt() != null) {
            this.at = user.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        } else {
            this.at = "24/11/2026";
        }
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isBanned() { return banned; }
    public void setBanned(boolean banned) { this.banned = banned; }

    public String getAt() { return at; }
    public void setAt(String at) { this.at = at; }
}
