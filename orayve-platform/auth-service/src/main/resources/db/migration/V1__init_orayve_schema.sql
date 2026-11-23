-- ============================================================================
-- ORAYVE ENTERPRISE DATABASE SCHEMA (V1)
-- 4-Schema Topology: auth_schema, catalog_schema, order_schema, notif_schema
-- ============================================================================

-- ============================================================================
-- SCHEMA 1: AUTH, USERS & ADMIN KYC (auth_schema)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS auth_schema;

CREATE TABLE auth_schema.users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE,
    mobile_number VARCHAR(15) UNIQUE,
    password_hash TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(25) NOT NULL DEFAULT 'ROLE_USER'
        CHECK (role IN ('ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN')),
    account_status VARCHAR(25) DEFAULT 'ACTIVE'
        CHECK (account_status IN ('PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'REJECTED', 'DELETED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_email_or_mobile CHECK (email IS NOT NULL OR mobile_number IS NOT NULL)
);

CREATE TABLE auth_schema.refresh_tokens (
    token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth_schema.users(user_id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auth_schema.admin_profiles (
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

CREATE TABLE auth_schema.admin_audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    admin_user_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    payload_diff JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auth_schema.user_addresses (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth_schema.users(user_id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL,
    recipient_name VARCHAR(120) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    street_line1 TEXT NOT NULL,
    street_line2 TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_single_default_address
ON auth_schema.user_addresses (user_id) WHERE (is_default = TRUE);

-- ============================================================================
-- SCHEMA 2: CATALOG, VARIANTS & ANALYTICS (catalog_schema)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS catalog_schema;

CREATE TABLE catalog_schema.categories (
    category_id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES catalog_schema.categories(category_id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE catalog_schema.products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id INT NOT NULL REFERENCES catalog_schema.categories(category_id),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    description TEXT,
    material_type VARCHAR(100) NOT NULL,
    design_style VARCHAR(100) NOT NULL,
    hsn_code VARCHAR(20),
    country_of_origin VARCHAR(60) DEFAULT 'India',
    extra_attributes JSONB DEFAULT '{}'::jsonb,
    video_ad_url TEXT,
    is_coupon_applicable BOOLEAN DEFAULT TRUE,
    return_policy_days INT DEFAULT 7,
    min_sale_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    rating_avg DECIMAL(2, 1) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    total_units_sold BIGINT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE catalog_schema.product_variants (
    variant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES catalog_schema.products(product_id) ON DELETE CASCADE,
    sku VARCHAR(64) UNIQUE NOT NULL,
    color_name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7) NOT NULL,
    size_label VARCHAR(30),
    mrp_price DECIMAL(10, 2) NOT NULL CHECK (mrp_price >= 0),
    discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 0 CHECK (discount_percent BETWEEN 0 AND 100),
    sale_price DECIMAL(10, 2) NOT NULL CHECK (sale_price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 10,
    version BIGINT NOT NULL DEFAULT 0,
    is_default_variant BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE catalog_schema.product_images (
    image_id SERIAL PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES catalog_schema.products(product_id) ON DELETE CASCADE,
    variant_id UUID REFERENCES catalog_schema.product_variants(variant_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_prod_filters ON catalog_schema.products (category_id, material_type, design_style, is_active);
CREATE INDEX IF NOT EXISTS idx_prod_sort_price ON catalog_schema.products (min_sale_price);
CREATE INDEX IF NOT EXISTS idx_prod_sort_rating ON catalog_schema.products (rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_variant_color ON catalog_schema.product_variants (color_name, product_id);

-- ============================================================================
-- SCHEMA 3: ORDERS, INVOICES, COUPONS & RETURNS (order_schema)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS order_schema;

CREATE TABLE order_schema.coupons (
    coupon_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,
    discount_type VARCHAR(15) NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FLAT')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_cap DECIMAL(10, 2),
    applicable_category_ids INT[],
    max_total_uses INT DEFAULT 1000,
    max_uses_per_user INT DEFAULT 1,
    used_count INT DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE order_schema.coupon_usages (
    usage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES order_schema.coupons(coupon_id),
    user_id UUID NOT NULL,
    order_id UUID NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(coupon_id, user_id, order_id)
);

CREATE TABLE order_schema.cart_items (
    cart_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    variant_id UUID NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, variant_id)
);

CREATE TABLE order_schema.wishlist_items (
    wishlist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE TABLE order_schema.orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(30) UNIQUE NOT NULL,
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    coupon_id UUID REFERENCES order_schema.coupons(coupon_id),
    shipping_address_snapshot JSONB NOT NULL,
    subtotal_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    final_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('UPI', 'CARD', 'NET_BANKING')),
    payment_status VARCHAR(25) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    order_status VARCHAR(30) DEFAULT 'ORDER_PLACED'
        CHECK (order_status IN ('ORDER_PLACED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
    gateway_order_id VARCHAR(150),
    gateway_payment_id VARCHAR(150),
    delivered_at TIMESTAMPTZ,
    return_eligible_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_schema.order_items (
    order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES order_schema.orders(order_id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    variant_id UUID NOT NULL,
    category_id INT NOT NULL,
    product_title_snapshot VARCHAR(200) NOT NULL,
    color_snapshot VARCHAR(50),
    sku_snapshot VARCHAR(64) NOT NULL,
    mrp_snapshot DECIMAL(10, 2) NOT NULL,
    unit_price_paid DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0)
);

CREATE TABLE order_schema.order_status_history (
    history_id BIGSERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES order_schema.orders(order_id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    remarks TEXT,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_schema.invoices (
    invoice_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE NOT NULL REFERENCES order_schema.orders(order_id),
    invoice_number VARCHAR(40) UNIQUE NOT NULL,
    pdf_storage_url TEXT NOT NULL,
    invoice_snapshot JSONB NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_schema.return_requests (
    return_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES order_schema.orders(order_id),
    order_item_id UUID NOT NULL REFERENCES order_schema.order_items(order_item_id),
    user_id UUID NOT NULL,
    request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('RETURN', 'REPLACEMENT')),
    reason TEXT NOT NULL,
    status VARCHAR(25) DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'APPROVED', 'PICKED_UP', 'COMPLETED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_schema.outbox_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_created ON order_schema.orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_outbox_pending ON order_schema.outbox_events (created_at) WHERE (status = 'PENDING');

-- ============================================================================
-- SCHEMA 4: NOTIFICATIONS — EMAIL & SMS (notif_schema)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS notif_schema;

CREATE TABLE notif_schema.notification_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    channel VARCHAR(10) NOT NULL CHECK (channel IN ('EMAIL', 'SMS')),
    recipient VARCHAR(150) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    has_pdf_attachment BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('SENT', 'FAILED')),
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);
