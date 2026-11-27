import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
import crypto from 'crypto';

const { Pool } = pg;

// Connection config: Neon DB or local postgres
const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
    })
  : null;

export async function initDatabase() {
  if (!pool) {
    console.log('[DB] No NEON_DATABASE_URL configured. Running with in-memory resilient storage.');
    return false;
  }

  try {
    const client = await pool.connect();
    console.log('[DB] Connected to PostgreSQL (Neon). Verifying 4 schemas...');

    await client.query(`
      CREATE SCHEMA IF NOT EXISTS auth_schema;
      CREATE SCHEMA IF NOT EXISTS catalog_schema;
      CREATE SCHEMA IF NOT EXISTS order_schema;
      CREATE SCHEMA IF NOT EXISTS notif_schema;

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
        role VARCHAR(25) NOT NULL DEFAULT 'ROLE_USER',
        account_status VARCHAR(25) DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
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
        approval_status VARCHAR(20) DEFAULT 'PENDING',
        approved_by UUID,
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
        user_id UUID,
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

      CREATE TABLE IF NOT EXISTS catalog_schema.categories (
        category_id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(120) UNIQUE NOT NULL,
        hsn_code VARCHAR(20),
        is_active BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS catalog_schema.products (
        product_id VARCHAR(64) PRIMARY KEY,
        category_id INT,
        category_name VARCHAR(100) NOT NULL,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(220) UNIQUE NOT NULL,
        design_style VARCHAR(100) NOT NULL,
        hsn_code VARCHAR(20),
        imgs JSONB DEFAULT '[]'::jsonb,
        rating_avg DECIMAL(3, 1) DEFAULT 4.5,
        review_count INT DEFAULT 0,
        view_count BIGINT DEFAULT 0,
        total_units_sold BIGINT DEFAULT 0,
        is_coupon_applicable BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS catalog_schema.product_variants (
        variant_id VARCHAR(64) PRIMARY KEY,
        product_id VARCHAR(64) NOT NULL REFERENCES catalog_schema.products(product_id) ON DELETE CASCADE,
        sku VARCHAR(64) UNIQUE NOT NULL,
        color_name VARCHAR(50) NOT NULL,
        color_hex VARCHAR(7) NOT NULL,
        photo_url TEXT,
        mrp_price DECIMAL(10, 2) NOT NULL,
        discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 0,
        sale_price DECIMAL(10, 2) NOT NULL,
        stock_quantity INT NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS order_schema.coupons (
        coupon_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(30) UNIQUE NOT NULL,
        discount_type VARCHAR(15) NOT NULL,
        discount_value DECIMAL(10, 2) NOT NULL,
        min_order_amount DECIMAL(10, 2) DEFAULT 0,
        max_discount_cap DECIMAL(10, 2) DEFAULT 1000000,
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
        final_amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(30) NOT NULL,
        payment_status VARCHAR(25) DEFAULT 'PAID',
        order_status INT DEFAULT 0,
        coupon_code VARCHAR(30),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_schema.order_items (
        order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES order_schema.orders(order_id) ON DELETE CASCADE,
        product_title VARCHAR(200) NOT NULL,
        category_name VARCHAR(100),
        color_name VARCHAR(50),
        sku VARCHAR(64) NOT NULL,
        hsn_code VARCHAR(20),
        unit_price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS public.product_reviews (
        review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id VARCHAR(64) NOT NULL,
        product_title VARCHAR(200),
        user_name VARCHAR(120) NOT NULL,
        user_mobile VARCHAR(20) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        headline VARCHAR(200),
        comment TEXT NOT NULL,
        photos JSONB DEFAULT '[]'::jsonb,
        is_verified_purchase BOOLEAN DEFAULT TRUE,
        helpful_votes INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cancel_info JSONB DEFAULT NULL;
      ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS return_info JSONB DEFAULT NULL;
      ALTER TABLE order_schema.orders ADD COLUMN IF NOT EXISTS cancel_info JSONB DEFAULT NULL;
      ALTER TABLE order_schema.orders ADD COLUMN IF NOT EXISTS return_info JSONB DEFAULT NULL;

      ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS product_id VARCHAR(64);
      ALTER TABLE order_schema.order_items ADD COLUMN IF NOT EXISTS product_id VARCHAR(64);

      -- Password authentication support
      ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;
      ALTER TABLE auth_schema.users ADD COLUMN IF NOT EXISTS password_hash TEXT;

      CREATE TABLE IF NOT EXISTS public.user_wallets (
        wallet_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_mobile VARCHAR(20) UNIQUE NOT NULL,
        balance_points INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.wallet_transactions (
        transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_mobile VARCHAR(20) NOT NULL,
        type VARCHAR(20) NOT NULL,
        points INT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        order_id VARCHAR(50),
        description TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'SUCCESS',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.admin_users (
        id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        password_hash TEXT NOT NULL,
        role VARCHAR(32) NOT NULL DEFAULT 'VIEWER_ADMIN',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    client.release();
    console.log('[DB] All PostgreSQL schemas & tables verified.');
    return true;
  } catch (err) {
    console.error('[DB] PostgreSQL init error:', err.message);
    return false;
  }
}
