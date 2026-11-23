# 🚀 ORAYVE E-Commerce Platform — Live Deployment & Operations Guide

> **Brand:** ORAYVE — *"Small Details. Big Presence."*  
> **Topology:** React 18 (Vite) Frontend + Enterprise API Backend + Neon Cloud PostgreSQL 16 (4 Schemas) + Razorpay Payments  
> **Deployment Cost:** ₹0 / Free Tier for all components

---

## 🏗️ Architecture Topology

```mermaid
flowchart TD
    subgraph Frontend["Frontend (Vercel / Netlify / Local)"]
        UI["React 18 + Vite + Tailwind CSS\n(Ink Navy #1C1B29, Brass #B8905C, Bone #F3EFE7)"]
    end

    subgraph Backend["Backend API (Render / Koyeb / Local)"]
        API["ORAYVE API Server (Port 8080)\n• JWT RS256 Auth\n• AES-256-GCM KYC Encryption\n• In-Page Color Swatch Engine\n• PDF GST Invoice Generator\n• Razorpay Checkout & Webhooks"]
    end

    subgraph Database["PostgreSQL 16 (Neon.tech Cloud DB)"]
        AS["auth_schema\n(users, admin_profiles, addresses, audit_logs)"]
        CS["catalog_schema\n(categories, products, variants, images)"]
        OS["order_schema\n(orders, order_items, coupons, invoices, returns)"]
        NS["notif_schema\n(notification_logs)"]
    end

    UI -->|REST / HTTPS| API
    API -->|SSL / Pool| Database
```

---

## ⚡ Quick Start (Local Run)

You can run the full working platform locally in 2 terminal tabs:

### Tab 1: Start Backend API (Port 8080)
```powershell
cd C:\Users\ankit\Downloads\ORAYVE\orayve-backend
npm install
npm start
```
*Health Check:* `http://localhost:8080/api/health`

### Tab 2: Start React Frontend (Port 5173)
```powershell
cd C:\Users\ankit\Downloads\ORAYVE\orayve-frontend
npm install
npm run dev
```
*Live Storefront:* `http://localhost:5173`

---

## 🌐 3-Step Live Production Deployment (₹0 Free Tier)

### Step 1: Create Neon PostgreSQL Database (1 Minute)
1. Go to **[https://neon.tech](https://neon.tech)** and sign up for a free account.
2. Click **Create Project** -> Name: `orayve-db` -> Region: closest to you.
3. Copy the **Connection String** (e.g., `postgresql://neondb_owner:npg_xxxx@ep-cool-snow-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`).
4. (Optional) In Neon's **SQL Editor**, paste and run:
   - `orayve-platform/auth-service/src/main/resources/db/migration/V1__init_orayve_schema.sql`
   - `orayve-platform/auth-service/src/main/resources/db/migration/V2__seed_orayve_catalog.sql`
   *(The backend server will also auto-initialize schemas on first run!)*

### Step 2: Deploy Backend to Render.com (Free Web Service)
1. Push this project to GitHub (or create a private repository).
2. Go to **[https://render.com](https://render.com)** -> Click **New +** -> **Web Service**.
3. Select your GitHub repository.
4. Set configurations:
   - **Root Directory:** `orayve-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. In **Environment Variables**, add:
   - `NEON_DATABASE_URL`: `your_neon_connection_string_from_step_1`
   - `JWT_SECRET`: `any_long_random_string`
   - `RAZORPAY_KEY_ID`: `your_razorpay_key_id_or_test_key`
   - `RAZORPAY_KEY_SECRET`: `your_razorpay_secret`
6. Click **Deploy Web Service**. You will get a URL like `https://orayve-backend.onrender.com`.

### Step 3: Deploy Frontend to Vercel (1 Minute)
1. Go to **[https://vercel.com](https://vercel.com)** -> Click **Add New Project**.
2. Select your repository.
3. Set configurations:
   - **Root Directory:** `orayve-frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. Vercel will build and assign you a global CDN URL (e.g. `https://orayve.vercel.app`)!

---

## 🔑 Default Credentials & Access

### Super Admin Portal (`/admin`)
- **Email:** `superadmin@orayve.in`
- **Password:** `SuperAdmin@2026`
- **Passcode:** `orayve@2026`
- **Access Level:** Catalog CRUD, Inventory Stock Control, Order Lifecycle Management, Admin KYC Approvals, Coupon Engine, Analytics Dashboard

### Admin KYC Onboarding Rules
- Strictly restricted to `@orayve.in` company domain.
- Government ID & PAN are encrypted at rest using **AES-256-GCM**.
- Accounts enter `PENDING_APPROVAL` until approved by Super Admin.
- On approval, generates a unique administrative ID (e.g., `ADM-2026-0001`).

### Test User Credentials
- **Email Login:** Any valid email or register a new user in 10 seconds.
- **Mobile OTP Login:** Enter any 10-digit Indian mobile number + OTP `123456`.
- **Pre-configured Coupons:**
  - `WELCOME15`: 15% discount (Min Order ₹500, Max Cap ₹500)
  - `ORAYVE200`: Flat ₹200 discount (Min Order ₹999)

---

## 📋 Legal Compliance Display Verification
Every product page and tax invoice adheres to Indian E-commerce Legal Metrology:
- **MRP** prominently displayed with line-through and explicit sale price.
- **Net Quantity:** 1 Unit per packaged item.
- **HSN Codes:** Displayed on all items (e.g., `71171990` for Rings, `42023120` for Wallets).
- **Country of Origin:** Stated on all products and invoice documents.
- **7-Day Return/Replacement Policy:** Integrated into checkout, order details, and printable GST invoices.
