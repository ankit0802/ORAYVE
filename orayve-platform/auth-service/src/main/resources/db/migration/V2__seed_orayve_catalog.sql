-- ============================================================================
-- ORAYVE ENTERPRISE SEED DATA (V2)
-- Super Admin, Categories, Featured Products, Variants, and Coupons
-- ============================================================================

-- 1. SEED SUPER ADMIN USER
INSERT INTO auth_schema.users (
    user_id, full_name, email, mobile_number, password_hash,
    is_email_verified, is_mobile_verified, role, account_status
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Super Admin',
    'superadmin@orayve.in',
    '+919876543210',
    '$2a$10$dXJ3SW6G7P50lGmMQgel6uPaRK4cT1JJYGhKkCE0gJHvzCCv6W.T6', -- SuperAdmin@2026
    TRUE,
    TRUE,
    'ROLE_SUPER_ADMIN',
    'ACTIVE'
) ON CONFLICT (email) DO NOTHING;

-- Seed Super Admin Profile
INSERT INTO auth_schema.admin_profiles (
    admin_profile_id, user_id, unique_admin_id, company_email,
    residential_address, gov_id_type, gov_id_encrypted, pan_number_encrypted,
    otp_verified, approval_status, approved_at
) VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'ADM-2026-0001',
    'superadmin@orayve.in',
    'ORAYVE Executive Suite, Indiranagar, Bengaluru, KA 560038',
    'PAN',
    'ENC_GOV_ID_SUPERADMIN',
    'ENC_PAN_SUPERADMIN',
    TRUE,
    'APPROVED',
    NOW()
) ON CONFLICT (company_email) DO NOTHING;

-- 2. SEED CATEGORIES
INSERT INTO catalog_schema.categories (category_id, name, slug, is_active) VALUES
(1, 'Wallets', 'wallets', TRUE),
(2, 'Men''s Belts', 'mens-belts', TRUE),
(3, 'Bags & Backpacks', 'bags-backpacks', TRUE),
(4, 'Handbags', 'handbags', TRUE),
(5, 'Rings', 'rings', TRUE),
(6, 'Chains & Necklaces', 'chains-necklaces', TRUE),
(7, 'Shoes', 'shoes', TRUE),
(8, 'Sandals', 'sandals', TRUE),
(9, 'Ladies Belts', 'ladies-belts', TRUE),
(10, 'Ties', 'ties', TRUE),
(11, 'Socks', 'socks', TRUE),
(12, 'Ladies Wrist Watches', 'ladies-watches', TRUE),
(13, 'Gents Wrist Watches', 'gents-watches', TRUE)
ON CONFLICT (slug) DO NOTHING;

SELECT setval('catalog_schema.categories_category_id_seq', 14, FALSE);

-- 3. SEED INITIAL FEATURED PRODUCTS & VARIANTS
-- (A) Rings
INSERT INTO catalog_schema.products (
    product_id, category_id, title, slug, description,
    material_type, design_style, hsn_code, country_of_origin,
    min_sale_price, rating_avg, review_count, view_count, total_units_sold,
    is_active, created_by
) VALUES (
    '10000000-0000-0000-0000-000000000001',
    5,
    'Sovereign Minimalist Band Ring',
    'sovereign-minimalist-band-ring',
    'Precision crafted minimalist band with beveled edges and micro-brushed finish. Designed for timeless elegance.',
    'Titanium & 18K PVD Brass',
    'Minimalist Band',
    '71171990',
    'India',
    549.00,
    4.8,
    142,
    1240,
    88,
    TRUE,
    '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO catalog_schema.product_variants (
    variant_id, product_id, sku, color_name, color_hex, size_label,
    mrp_price, discount_percent, sale_price, stock_quantity, low_stock_threshold, is_default_variant, is_active
) VALUES
('10000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', 'ORV-RNG-01-1', 'Champagne Gold', '#D6B98C', 'Standard', 899.00, 38.93, 549.00, 45, 10, TRUE, TRUE),
('10000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001', 'ORV-RNG-01-2', 'Rose Gold', '#D49B8B', 'Standard', 949.00, 36.88, 599.00, 32, 10, FALSE, TRUE),
('10000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001', 'ORV-RNG-01-3', 'Polished Silver', '#C0C5CE', 'Standard', 899.00, 38.93, 549.00, 50, 10, FALSE, TRUE)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO catalog_schema.product_images (product_id, variant_id, image_url, is_primary, sort_order) VALUES
('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80', TRUE, 0),
('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80', FALSE, 1),
('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', FALSE, 2);

-- (B) Wallets
INSERT INTO catalog_schema.products (
    product_id, category_id, title, slug, description,
    material_type, design_style, hsn_code, country_of_origin,
    min_sale_price, rating_avg, review_count, view_count, total_units_sold,
    is_active, created_by
) VALUES (
    '10000000-0000-0000-0000-000000000002',
    1,
    'Atelier Stitched Bifold Leather Wallet',
    'atelier-stitched-bifold-leather-wallet',
    'Full-grain Tuscan leather bifold featuring RFID blocking protection, 8 card slots, and dual currency sleeves.',
    'Full-Grain Leather',
    'Bifold',
    '42023120',
    'India',
    899.00,
    4.9,
    215,
    2100,
    140,
    TRUE,
    '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO catalog_schema.product_variants (
    variant_id, product_id, sku, color_name, color_hex, size_label,
    mrp_price, discount_percent, sale_price, stock_quantity, low_stock_threshold, is_default_variant, is_active
) VALUES
('10000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000002', 'ORV-WLT-01-1', 'Pitch Black', '#1C1B29', 'Standard', 1399.00, 35.74, 899.00, 60, 10, TRUE, TRUE),
('10000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000002', 'ORV-WLT-01-2', 'Cognac Tan', '#8B5A2B', 'Standard', 1449.00, 34.51, 949.00, 48, 10, FALSE, TRUE),
('10000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000002', 'ORV-WLT-01-3', 'Emerald Green', '#1E4D3B', 'Standard', 1499.00, 33.36, 999.00, 25, 10, FALSE, TRUE)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO catalog_schema.product_images (product_id, variant_id, image_url, is_primary, sort_order) VALUES
('10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80', TRUE, 0),
('10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80', FALSE, 1),
('10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=600&q=80', FALSE, 2);

-- (C) Gents Wrist Watches
INSERT INTO catalog_schema.products (
    product_id, category_id, title, slug, description,
    material_type, design_style, hsn_code, country_of_origin,
    min_sale_price, rating_avg, review_count, view_count, total_units_sold,
    is_active, created_by
) VALUES (
    '10000000-0000-0000-0000-000000000003',
    13,
    'Imperial Chronograph Dress Watch',
    'imperial-chronograph-dress-watch',
    'Sapphire crystal glass with Japanese quartz movement, 5ATM water resistance, and genuine Italian leather strap.',
    '316L Stainless Steel',
    'Chronograph',
    '91021100',
    'India',
    3499.00,
    4.9,
    188,
    3400,
    112,
    TRUE,
    '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO catalog_schema.product_variants (
    variant_id, product_id, sku, color_name, color_hex, size_label,
    mrp_price, discount_percent, sale_price, stock_quantity, low_stock_threshold, is_default_variant, is_active
) VALUES
('10000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000003', 'ORV-GWT-01-1', 'Ink Navy & Brass', '#1F2D42', '42mm', 4999.00, 30.01, 3499.00, 35, 5, TRUE, TRUE),
('10000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000003', 'ORV-GWT-01-2', 'Pitch Black & Gold', '#1C1B29', '42mm', 5199.00, 30.78, 3599.00, 28, 5, FALSE, TRUE)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO catalog_schema.product_images (product_id, variant_id, image_url, is_primary, sort_order) VALUES
('10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', TRUE, 0),
('10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000032', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80', FALSE, 1);

-- 4. SEED COUPONS
INSERT INTO order_schema.coupons (
    coupon_id, code, discount_type, discount_value, min_order_amount, max_discount_cap,
    max_total_uses, max_uses_per_user, used_count, valid_from, valid_until, is_active
) VALUES
(
    '20000000-0000-0000-0000-000000000001',
    'WELCOME15',
    'PERCENTAGE',
    15.00,
    500.00,
    500.00,
    10000,
    1,
    0,
    NOW(),
    NOW() + INTERVAL '1 year',
    TRUE
),
(
    '20000000-0000-0000-0000-000000000002',
    'ORAYVE200',
    'FLAT',
    200.00,
    999.00,
    200.00,
    5000,
    1,
    0,
    NOW(),
    NOW() + INTERVAL '1 year',
    TRUE
) ON CONFLICT (code) DO NOTHING;
