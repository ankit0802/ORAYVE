# ORAYVE — Enterprise Spring Boot 3 Backend

> **Brand**: ORAYVE · *Small Details. Big Presence.*  
> **Stack**: Java 17 LTS, Spring Boot 3.2.5, Spring Data JPA, Spring Security 6, JJWT 0.12.5, OpenPDF, PostgreSQL 18 (Neon Serverless).

---

## 🚀 Key Features

1. **Enterprise Layered Architecture**:
   - `entity/` — JPA Entities mapped directly to live Neon PostgreSQL tables (`public.users`, `public.products`, `public.product_variants`, `public.categories`, `public.coupons`, `public.orders`, `public.order_items`, `public.user_addresses`).
   - `repository/` — Spring Data JPA repositories with optimized `JOIN FETCH` queries.
   - `service/` — Business logic, cryptographically secure live OTP generation, discount calculations, order processing, and luxury PDF tax invoice generation.
   - `controller/` — Clean REST controllers with OpenAPI / Swagger 3 annotations.
   - `security/` — Stateless JWT authentication filter, BCrypt password hashing, and role-based access control.
   - `dto/` — Validated request/response models (`@Email`, `@NotBlank`, `@Min`, `@Max`).
   - `exception/` — Centralized `GlobalExceptionHandler` with standardized `ApiResponse<T>` envelope.

2. **Strict Validations & Unique Constraints**:
   - **Unique Mobile Numbers**: Unique database constraint on `mobile_number` across all international formats.
   - **Strict Email Validation**: Standard RFC regex pattern (`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`), preventing invalid domains or malformed entries.
   - **Unique Email**: Duplicate registrations with existing email addresses are rejected with HTTP 409 Conflict.
   - **Live 6-Digit Cryptographic OTP**: Generated via `SecureRandom`, stored in-memory with 5-minute TTL and max attempt limits.

3. **Interactive Swagger Documentation**:
   - Access Swagger UI: [http://localhost:5000/swagger-ui.html](http://localhost:5000/swagger-ui.html)
   - OpenAPI Specification: [http://localhost:5000/v3/api-docs](http://localhost:5000/v3/api-docs)

4. **Branded Luxury PDF Invoices**:
   - Generated dynamically with OpenPDF using ORAYVE brand colors (#1C1B29 Ink, #B8905C Brass), detailed SKU breakdowns, and tax invoice metadata.

---

## 🛠️ How to Run

### Method 1: Using the Included Maven Wrapper
```powershell
cd orayve-spring-backend
.\mvnw.cmd spring-boot:run
```

### Method 2: Running the Pre-Packaged Fat Jar
```powershell
cd orayve-spring-backend
java -jar target\orayve-spring-backend-1.0.0.jar
```

### Method 3: Rebuilding the Package
```powershell
cd orayve-spring-backend
.\mvnw.cmd clean package -DskipTests
```

---

## 🌐 Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status and brand metadata |
| `POST` | `/api/auth/send-otp` | Generate and dispatch live 6-digit OTP |
| `POST` | `/api/auth/register` | Register new user with verified OTP and valid email |
| `POST` | `/api/auth/login` | Login user via mobile number and verified OTP |
| `GET` | `/api/catalog/categories` | List all active categories |
| `GET` | `/api/catalog/products` | List all products with color variants and pricing |
| `GET` | `/api/catalog/search?q={keyword}` | Full-text search across catalog |
| `GET` | `/api/coupons` | List active promotional coupons |
| `POST` | `/api/coupons/apply` | Calculate discount amount on cart |
| `POST` | `/api/checkout/place-order` | Confirm and place new order |
| `GET` | `/api/orders/{id}/invoice` | Download official branded PDF tax invoice |
| `GET` | `/api/admin/users` | List all registered users |
| `PATCH` | `/api/admin/users/{mobile}/ban` | Suspend or reactivate user |
| `DELETE` | `/api/admin/users/{mobile}` | Delete user |
| `GET` | `/api/admin/analytics` | Revenue and platform metrics |
