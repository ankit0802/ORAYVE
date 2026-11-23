-- ============================================================================
-- ORAYVE ENTERPRISE DATABASE SCHEMA (V1)
-- 4-Schema Topology: auth_schema, catalog_schema, order_schema, notif_schema
-- Synchronized with Orayve Complete Master System
-- ============================================================================

-- ============================================================================
-- SCHEMA 1: AUTH, USERS & ADMIN KYC (auth_schema)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS auth_schema;

CREATE TABLE IF NOT EXISTS auth_schema.users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    age INT,
    email VARCHAR(150) UNIQUE,
    mobile_number VARCHAR(15) UNIQUE,
    password_hash TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    role VARCHAR(25) NOT NULL DEFAULT 'ROLE_USER'
        CHECK (role IN ('ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN')),
    account_status VARCHAR(25) DEFAULT 'ACTIVE'
        CHECK (account_status IN ('PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'REJECTED', 'DELETED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_email_or_mobile CHECK (email IS NOT NULL OR mobile_number IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS auth_schema.refresh_tokens (
    token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth_schema.users(user_id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_schema.admin_profiles (
    admin_profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth_schema.users(user_id) ON DELETE CASCADE,
    unique_admin_id VARCHAR(30) UNIQUE,
    company_email VARCHAR(150) UNIQUE NOT NULL,
    residential_address TEXT NOT NULL,
    gov_id_type VARCHAR(30) NOT NULL,
    gov_id_encrypted TEXT NOT NULL,
    pan_number_encrypted TEXT NOT NULL,
    otp_verified BOOLEAN DEFAULT FALSE,
    approval_status VARCHAR(20) DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_by UUID REFERENCES auth_schema.users(user_id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_schema.admin_audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    admin_user_id UUID,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    payload_diff JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_schema.user_addresses (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth_schema.users(user_id) ON DELETE CASCADE,
    mobile VARCHAR(15),
    recipient_name VARCHAR(120) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    street_line1 TEXT NOT NULL,
    street_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Karnataka',
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SCHEMA 2: CATALOG, VARIANTS & ANALYTICS (catalog_schema)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS catalog_schema;

CREATE TABLE IF NOT EXISTS catalog_schema.categories (
    category_id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES catalog_schema.categories(category_id),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    hsn_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS catalog_schema.products (
    product_id VARCHAR(64) PRIMARY KEY,
    category_id INT REFERENCES catalog_schema.categories(category_id),
    category_name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    description TEXT,
    material_type VARCHAR(100) DEFAULT 'Premium Material',
    design_style VARCHAR(100) NOT NULL,
    hsn_code VARCHAR(20),
    country_of_origin VARCHAR(60) DEFAULT 'India',
    extra_attributes JSONB DEFAULT '{}'::jsonb,
    imgs JSONB DEFAULT '[]'::jsonb,
    is_coupon_applicable BOOLEAN DEFAULT TRUE,
    return_policy_days INT DEFAULT 7,
    min_sale_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    rating_avg DECIMAL(3, 1) DEFAULT 4.5,
    review_count INT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    total_units_sold BIGINT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog_schema.product_variants (
    variant_id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES catalog_schema.products(product_id) ON DELETE CASCADE,
    sku VARCHAR(64) UNIQUE NOT NULL,
    color_name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    photo_url TEXT,
    size_label VARCHAR(30) DEFAULT 'Standard',
    mrp_price DECIMAL(10, 2) NOT NULL CHECK (mrp_price >= 0),
    discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 0,
    sale_price DECIMAL(10, 2) NOT NULL CHECK (sale_price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 10,
    version BIGINT NOT NULL DEFAULT 0,
    is_default_variant BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS catalog_schema.product_images (
    image_id SERIAL PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES catalog_schema.products(product_id) ON DELETE CASCADE,
    variant_id VARCHAR(64),
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);

-- ============================================================================
-- SCHEMA 3: ORDERS, INVOICES, COUPONS & RETURNS (order_schema)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS order_schema;

CREATE TABLE IF NOT EXISTS order_schema.coupons (
    coupon_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,
    discount_type VARCHAR(15) NOT NULL CHECK (discount_type IN ('P', 'F', 'PERCENTAGE', 'FLAT')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_cap DECIMAL(10, 2) DEFAULT 1000000,
    applicable_category_ids INT[],
    max_total_uses INT DEFAULT 10000,
    max_uses_per_user INT DEFAULT 1,
    used_count INT DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ DEFAULT NOW() + INTERVAL '10 years',
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS order_schema.orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(30) UNIQUE NOT NULL,
    invoice_number VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID,
    user_mobile VARCHAR(15),
    shipping_address_snapshot JSONB NOT NULL,
    subtotal_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(25) DEFAULT 'PAID',
    order_status INT DEFAULT 0 CHECK (order_status IN (0, 1, 2, 3)), -- 0: PLACED, 1: IN TRANSIT, 2: OUT FOR DELIVERY, 3: DELIVERED
    coupon_code VARCHAR(30),
    gateway_order_id VARCHAR(150),
    gateway_payment_id VARCHAR(150),
    delivered_at TIMESTAMPTZ,
    return_eligible_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_schema.order_items (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES order_schema.orders(order_id) ON DELETE CASCADE,
    product_id VARCHAR(64),
    variant_id VARCHAR(64),
    product_title VARCHAR(200) NOT NULL,
    category_name VARCHAR(100),
    color_name VARCHAR(50),
    sku VARCHAR(64) NOT NULL,
    hsn_code VARCHAR(20),
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS order_schema.order_status_history (
    history_id BIGSERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES order_schema.orders(order_id) ON DELETE CASCADE,
    status INT NOT NULL,
    status_label VARCHAR(50) NOT NULL,
    remarks TEXT,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_schema.return_requests (
    return_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES order_schema.orders(order_id),
    user_mobile VARCHAR(15),
    request_type VARCHAR(20) NOT NULL DEFAULT 'RETURN',
    reason TEXT NOT NULL,
    status VARCHAR(25) DEFAULT 'REQUESTED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SCHEMA 4: NOTIFICATIONS — EMAIL & SMS (notif_schema)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS notif_schema;

CREATE TABLE IF NOT EXISTS notif_schema.notification_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    channel VARCHAR(10) NOT NULL,
    recipient VARCHAR(150) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    has_pdf_attachment BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);
