package com.orayve;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class OrayveApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrayveApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  [ORAYVE] Enterprise Spring Boot 3 Backend is ONLINE on port 5000");
        System.out.println("  [API DOCS] Swagger UI: http://localhost:5000/swagger-ui.html");
        System.out.println("  [DATABASE] Connected to Neon PostgreSQL (AWS US-East-2)");
        System.out.println("  [SLOGAN] Small Details. Big Presence.");
        System.out.println("==================================================================");
    }
}
