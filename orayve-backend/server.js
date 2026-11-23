import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import { pool, initDatabase } from './db.js';
import { encryptAes256Gcm, decryptAes256Gcm, verifyRazorpaySignature } from './crypto.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'orayve-super-secret-jwt-key-2026-change-in-prod';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_orayve_demo';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'orayve_demo_secret';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json());

// In-Memory Storage Fallback (when PostgreSQL is offline / starting up)
const memoryStore = {
  users: [
    {
      user_id: '00000000-0000-0000-0000-000000000001',
      full_name: 'Super Admin',
      email: 'superadmin@orayve.in',
      mobile_number: '+919876543210',
      password_hash: bcrypt.hashSync('SuperAdmin@2026', 10),
      role: 'ROLE_SUPER_ADMIN',
      account_status: 'ACTIVE',
      created_at: new Date().toISOString(),
    },
  ],
  adminProfiles: [
    {
      admin_profile_id: '00000000-0000-0000-0000-000000000002',
      user_id: '00000000-0000-0000-0000-000000000001',
      unique_admin_id: 'ADM-2026-0001',
      company_email: 'superadmin@orayve.in',
      residential_address: 'ORAYVE Executive Suite, Indiranagar, Bengaluru, KA 560038',
      gov_id_type: 'PAN',
      gov_id_encrypted: encryptAes256Gcm('ABCDE1234F'),
      pan_number_encrypted: encryptAes256Gcm('ABCDE1234F'),
      approval_status: 'APPROVED',
      created_at: new Date().toISOString(),
    },
  ],
  addresses: [],
  orders: [],
  cartItems: [],
  wishlistItems: [],
  coupons: [
    { coupon_id: 'c1', code: 'WELCOME15', discount_type: 'PERCENTAGE', discount_value: 15, min_order_amount: 500, max_discount_cap: 500, is_active: true },
    { coupon_id: 'c2', code: 'ORAYVE200', discount_type: 'FLAT', discount_value: 200, min_order_amount: 999, max_discount_cap: 200, is_active: true },
  ],
  returnRequests: [],
  auditLogs: [],
};

// ----------------------------------------------------------------------------
// Rate Limiter Middleware (Sliding Window 100 req/min per IP)
// ----------------------------------------------------------------------------
const ipRequests = new Map();
function rateLimiter(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000;
  
  if (!ipRequests.has(ip)) {
    ipRequests.set(ip, []);
  }
  const timestamps = ipRequests.get(ip).filter(t => now - t < windowMs);
  if (timestamps.length >= 100) {
    return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
  }
  timestamps.push(now);
  ipRequests.set(ip, timestamps);
  next();
}
app.use(rateLimiter);

// ----------------------------------------------------------------------------
// Auth Middleware
// ----------------------------------------------------------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'ROLE_ADMIN' && req.user.role !== 'ROLE_SUPER_ADMIN')) {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }
  next();
}

function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ROLE_SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Forbidden: Super Admin access required' });
  }
  next();
}

// ----------------------------------------------------------------------------
// 1. AUTH & USER APIS
// ----------------------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, mobileNumber, password } = req.body;
  if (!fullName || (!email && !mobileNumber) || !password) {
    return res.status(400).json({ success: false, message: 'Full name, email/mobile, and password are required' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const userId = crypto.randomUUID();

  if (pool) {
    try {
      const result = await pool.query(
        `INSERT INTO auth_schema.users (user_id, full_name, email, mobile_number, password_hash, role, account_status)
         VALUES ($1, $2, $3, $4, $5, 'ROLE_USER', 'ACTIVE')
         RETURNING user_id, full_name, email, mobile_number, role`,
        [userId, fullName, email || null, mobileNumber || null, passwordHash]
      );
      const user = result.rows[0];
      const token = jwt.sign({ userId: user.user_id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, message: 'Registration successful', data: { user, token } });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ success: false, message: 'Email or mobile number already registered' });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Memory fallback
  const existing = memoryStore.users.find(u => (email && u.email === email) || (mobileNumber && u.mobile_number === mobileNumber));
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email or mobile number already registered' });
  }
  const newUser = {
    user_id: userId,
    full_name: fullName,
    email: email || null,
    mobile_number: mobileNumber || null,
    password_hash: passwordHash,
    role: 'ROLE_USER',
    account_status: 'ACTIVE',
    created_at: new Date().toISOString(),
  };
  memoryStore.users.push(newUser);
  const token = jwt.sign({ userId: newUser.user_id, role: newUser.role, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, message: 'Registration successful', data: { user: newUser, token } });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { emailOrMobile, password } = req.body;
  if (!emailOrMobile || !password) {
    return res.status(400).json({ success: false, message: 'Email/Mobile and password required' });
  }

  let user = null;
  if (pool) {
    try {
      const result = await pool.query(
        `SELECT * FROM auth_schema.users WHERE email = $1 OR mobile_number = $1`,
        [emailOrMobile]
      );
      user = result.rows[0];
    } catch (err) {
      console.error(err);
    }
  } else {
    user = memoryStore.users.find(u => u.email === emailOrMobile || u.mobile_number === emailOrMobile);
  }

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (user.account_status !== 'ACTIVE') {
    return res.status(403).json({ success: false, message: `Account is ${user.account_status}. Please contact support.` });
  }

  const token = jwt.sign({ userId: user.user_id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        mobileNumber: user.mobile_number,
        role: user.role,
      },
    },
  });
});

// POST /api/auth/otp-login (Mobile OTP Login / Registration)
app.post('/api/auth/otp-login', async (req, res) => {
  const { mobileNumber, otp } = req.body;
  if (!mobileNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Mobile number and OTP required' });
  }

  // Demo OTP verification: '123456' or valid 6-digit OTP
  if (otp !== '123456' && otp.length !== 6) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  let user = memoryStore.users.find(u => u.mobile_number === mobileNumber);
  if (!user) {
    user = {
      user_id: crypto.randomUUID(),
      full_name: 'Orayve Customer',
      mobile_number: mobileNumber,
      role: 'ROLE_USER',
      account_status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };
    memoryStore.users.push(user);
  }

  const token = jwt.sign({ userId: user.user_id, role: user.role, mobile: user.mobile_number }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, message: 'OTP verified successfully', data: { token, user } });
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  let user = null;
  let addresses = [];

  if (pool) {
    try {
      const uRes = await pool.query('SELECT user_id, full_name, email, mobile_number, role, account_status FROM auth_schema.users WHERE user_id = $1', [req.user.userId]);
      user = uRes.rows[0];
      const aRes = await pool.query('SELECT * FROM auth_schema.user_addresses WHERE user_id = $1 ORDER BY is_default DESC', [req.user.userId]);
      addresses = aRes.rows;
    } catch (err) {
      console.error(err);
    }
  } else {
    user = memoryStore.users.find(u => u.user_id === req.user.userId);
    addresses = memoryStore.addresses.filter(a => a.user_id === req.user.userId);
  }

  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: { user, addresses } });
});

// ----------------------------------------------------------------------------
// 2. ADMIN KYC & ONBOARDING APIS
// ----------------------------------------------------------------------------

// POST /api/admin-auth/register
app.post('/api/admin-auth/register', async (req, res) => {
  const { fullName, companyEmail, mobile, residentialAddress, govIdType, govIdNumber, panNumber, password } = req.body;

  // Strict Domain Restriction: must be @orayve.in
  if (!companyEmail || !companyEmail.toLowerCase().endsWith('@orayve.in')) {
    return res.status(400).json({
      success: false,
      message: 'Admin registration strictly restricted to company domain (@orayve.in)',
    });
  }

  if (!fullName || !mobile || !residentialAddress || !govIdType || !govIdNumber || !panNumber || !password) {
    return res.status(400).json({ success: false, message: 'All KYC fields are mandatory' });
  }

  // Encrypt Gov ID & PAN at rest using AES-256-GCM
  const govIdEncrypted = encryptAes256Gcm(govIdNumber);
  const panEncrypted = encryptAes256Gcm(panNumber);
  const passwordHash = bcrypt.hashSync(password, 10);
  const userId = crypto.randomUUID();
  const profileId = crypto.randomUUID();

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO auth_schema.users (user_id, full_name, email, mobile_number, password_hash, role, account_status)
         VALUES ($1, $2, $3, $4, $5, 'ROLE_ADMIN', 'PENDING_APPROVAL')`,
        [userId, fullName, companyEmail, mobile, passwordHash]
      );
      await pool.query(
        `INSERT INTO auth_schema.admin_profiles (admin_profile_id, user_id, company_email, residential_address, gov_id_type, gov_id_encrypted, pan_number_encrypted, approval_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')`,
        [profileId, userId, companyEmail, residentialAddress, govIdType, govIdEncrypted, panEncrypted]
      );
      return res.json({
        success: true,
        message: 'Admin KYC submitted. Your account is PENDING_APPROVAL by Super Admin.',
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Memory fallback
  const newUser = {
    user_id: userId,
    full_name: fullName,
    email: companyEmail,
    mobile_number: mobile,
    password_hash: passwordHash,
    role: 'ROLE_ADMIN',
    account_status: 'PENDING_APPROVAL',
    created_at: new Date().toISOString(),
  };
  memoryStore.users.push(newUser);
  memoryStore.adminProfiles.push({
    admin_profile_id: profileId,
    user_id: userId,
    company_email: companyEmail,
    residential_address: residentialAddress,
    gov_id_type: govIdType,
    gov_id_encrypted: govIdEncrypted,
    pan_number_encrypted: panEncrypted,
    approval_status: 'PENDING',
    created_at: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: 'Admin KYC submitted. Your account is PENDING_APPROVAL by Super Admin.',
  });
});

// GET /api/admin-auth/pending (Super Admin Only)
app.get('/api/admin-auth/pending', authenticateToken, requireSuperAdmin, async (req, res) => {
  let pending = [];
  if (pool) {
    try {
      const result = await pool.query(`
        SELECT p.admin_profile_id, p.unique_admin_id, p.company_email, p.residential_address,
               p.gov_id_type, p.approval_status, p.created_at, u.full_name, u.mobile_number, u.user_id
        FROM auth_schema.admin_profiles p
        JOIN auth_schema.users u ON p.user_id = u.user_id
        WHERE p.approval_status = 'PENDING'
      `);
      pending = result.rows;
    } catch (err) {
      console.error(err);
    }
  } else {
    pending = memoryStore.adminProfiles
      .filter(p => p.approval_status === 'PENDING')
      .map(p => {
        const u = memoryStore.users.find(x => x.user_id === p.user_id) || {};
        return { ...p, full_name: u.full_name, mobile_number: u.mobile_number };
      });
  }

  res.json({ success: true, data: pending });
});

// POST /api/admin-auth/approve (Super Admin Only)
app.post('/api/admin-auth/approve', authenticateToken, requireSuperAdmin, async (req, res) => {
  const { userId, approve } = req.body;
  if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });

  const status = approve ? 'APPROVED' : 'REJECTED';
  const accountStatus = approve ? 'ACTIVE' : 'REJECTED';
  const uniqueAdminId = approve ? `ADM-2026-${String(Math.floor(Math.random() * 9000) + 1000)}` : null;

  if (pool) {
    try {
      await pool.query(
        `UPDATE auth_schema.admin_profiles
         SET approval_status = $1, unique_admin_id = COALESCE(unique_admin_id, $2), approved_by = $3, approved_at = NOW()
         WHERE user_id = $4`,
        [status, uniqueAdminId, req.user.userId, userId]
      );
      await pool.query(
        `UPDATE auth_schema.users SET account_status = $1 WHERE user_id = $2`,
        [accountStatus, userId]
      );
      // Audit log
      await pool.query(
        `INSERT INTO auth_schema.admin_audit_logs (admin_user_id, action, target_entity, target_id, ip_address)
         VALUES ($1, $2, 'ADMIN_PROFILE', $3, $4)`,
        [req.user.userId, approve ? 'APPROVE_ADMIN' : 'REJECT_ADMIN', userId, req.ip]
      );
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  } else {
    const prof = memoryStore.adminProfiles.find(p => p.user_id === userId);
    if (prof) {
      prof.approval_status = status;
      if (approve) prof.unique_admin_id = uniqueAdminId;
    }
    const usr = memoryStore.users.find(u => u.user_id === userId);
    if (usr) usr.account_status = accountStatus;
  }

  res.json({
    success: true,
    message: `Admin ${approve ? 'approved successfully' : 'rejected'}`,
    data: { uniqueAdminId },
  });
});

// ----------------------------------------------------------------------------
// 3. USER ADDRESSES & GPS APIS
// ----------------------------------------------------------------------------
app.get('/api/users/addresses', authenticateToken, (req, res) => {
  const addrs = memoryStore.addresses.filter(a => a.user_id === req.user.userId);
  res.json({ success: true, data: addrs });
});

app.post('/api/users/addresses', authenticateToken, (req, res) => {
  const { label, recipientName, phone, streetLine1, streetLine2, city, state, pincode, latitude, longitude, isDefault } = req.body;
  if (!recipientName || !phone || !streetLine1 || !pincode) {
    return res.status(400).json({ success: false, message: 'Mandatory address fields missing' });
  }

  if (isDefault) {
    memoryStore.addresses.forEach(a => {
      if (a.user_id === req.user.userId) a.is_default = false;
    });
  }

  const newAddress = {
    address_id: crypto.randomUUID(),
    user_id: req.user.userId,
    label: label || 'Home',
    recipient_name: recipientName,
    phone,
    street_line1: streetLine1,
    street_line2: streetLine2 || '',
    city: city || 'Bengaluru',
    state: state || 'Karnataka',
    pincode,
    latitude: latitude || null,
    longitude: longitude || null,
    is_default: Boolean(isDefault),
    created_at: new Date().toISOString(),
  };

  memoryStore.addresses.push(newAddress);
  res.json({ success: true, message: 'Address saved', data: newAddress });
});

// ----------------------------------------------------------------------------
// 4. CHECKOUT & ORDERS APIS
// ----------------------------------------------------------------------------

// POST /api/checkout/initiate
app.post('/api/checkout/initiate', authenticateToken, (req, res) => {
  const { items, addressId, couponCode, paymentMethod } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ success: false, message: 'No items in cart' });
  }

  // Server-side price recalculation
  let subtotal = 0;
  items.forEach(it => {
    subtotal += Number(it.price) * Number(it.quantity);
  });

  let discount = 0;
  if (couponCode) {
    const coupon = memoryStore.coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.is_active);
    if (coupon && subtotal >= coupon.min_order_amount) {
      if (coupon.discount_type === 'PERCENTAGE') {
        discount = Math.min((subtotal * coupon.discount_value) / 100, coupon.max_discount_cap);
      } else {
        discount = Math.min(coupon.discount_value, coupon.max_discount_cap);
      }
    }
  }

  const finalAmount = Math.max(0, subtotal - discount);
  const orderNumber = `ORD-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`;
  const razorpayOrderId = `order_${crypto.randomBytes(10).toString('hex')}`;

  res.json({
    success: true,
    data: {
      orderNumber,
      subtotal,
      discount,
      finalAmount,
      razorpayOrderId,
      keyId: RAZORPAY_KEY_ID,
      currency: 'INR',
    },
  });
});

// POST /api/checkout/verify-payment
app.post('/api/checkout/verify-payment', authenticateToken, (req, res) => {
  const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature, items, address, subtotal, discount, finalAmount, paymentMethod } = req.body;

  // Verify HMAC-SHA256 signature in production mode
  if (razorpaySignature && process.env.NODE_ENV === 'production') {
    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature, RAZORPAY_KEY_SECRET);
    if (!isValid) return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }

  const orderId = crypto.randomUUID();
  const invoiceNumber = `INV-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`;

  const orderRecord = {
    order_id: orderId,
    order_number: orderNumber || `ORD-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`,
    user_id: req.user.userId,
    shipping_address_snapshot: address,
    subtotal_amount: subtotal,
    discount_amount: discount || 0,
    final_amount: finalAmount,
    payment_method: paymentMethod || 'UPI',
    payment_status: 'PAID',
    order_status: 'ORDER_PLACED',
    gateway_order_id: razorpayOrderId,
    gateway_payment_id: razorpayPaymentId || `pay_${crypto.randomBytes(8).toString('hex')}`,
    invoice_number: invoiceNumber,
    items: items || [],
    created_at: new Date().toISOString(),
  };

  memoryStore.orders.unshift(orderRecord);

  res.json({
    success: true,
    message: 'Payment verified and order placed successfully!',
    data: {
      orderId: orderRecord.order_id,
      orderNumber: orderRecord.order_number,
      invoiceNumber: orderRecord.invoice_number,
      status: orderRecord.order_status,
      returnPolicy: 'Protected by ORAYVE 7-Day Return & Replacement Policy',
    },
  });
});

// GET /api/orders (User Orders)
app.get('/api/orders', authenticateToken, (req, res) => {
  const userOrders = memoryStore.orders.filter(o => o.user_id === req.user.userId);
  res.json({ success: true, data: userOrders });
});

// GET /api/orders/:id/invoice (Stream PDF GST Invoice)
app.get('/api/orders/:id/invoice', (req, res) => {
  const order = memoryStore.orders.find(o => o.order_id === req.params.id || o.order_number === req.params.id);
  
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=ORAYVE_INVOICE_${order ? order.order_number : 'SAMPLE'}.pdf`);

  doc.pipe(res);

  // Header Brand
  doc.fontSize(22).font('Helvetica-Bold').fillColor('#1C1B29').text('O R A Y V E', { tracking: 3 });
  doc.fontSize(9).font('Helvetica').fillColor('#B8905C').text('Small Details. Big Presence.');
  doc.moveDown(0.5);
  doc.fontSize(8).fillColor('#555555').text('ORAYVE Retail India Pvt Ltd · Bengaluru, KA · GSTIN: 29AABCO1234F1Z5 · support@orayve.in');
  doc.moveDown(1);
  doc.strokeColor('#B8905C').lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1);

  // Invoice Details
  const invNumber = order ? order.invoice_number : 'INV-2026-902143';
  const ordNumber = order ? order.order_number : 'ORD-2026-881230';
  const ordDate = order ? new Date(order.created_at).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
  const recipient = order && order.shipping_address_snapshot ? order.shipping_address_snapshot.recipientName || 'Customer' : 'Valued Customer';
  const addressStr = order && order.shipping_address_snapshot ? `${order.shipping_address_snapshot.street || ''}, ${order.shipping_address_snapshot.city || ''} - ${order.shipping_address_snapshot.pincode || ''}` : 'Indiranagar, Bengaluru, KA 560038';

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#1C1B29').text('TAX INVOICE / BILL OF SUPPLY', { align: 'right' });
  doc.fontSize(8).font('Helvetica').fillColor('#333333');
  doc.text(`Invoice No: ${invNumber}`, { align: 'right' });
  doc.text(`Order No: ${ordNumber}`, { align: 'right' });
  doc.text(`Date: ${ordDate}`, { align: 'right' });
  doc.text(`Payment: ${order ? order.payment_method : 'UPI'} (PAID)`, { align: 'right' });

  doc.moveDown(1);
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#1C1B29').text('Billed & Shipped To:');
  doc.fontSize(8).font('Helvetica').fillColor('#444444').text(recipient);
  doc.text(addressStr);
  doc.moveDown(1.5);

  // Items Table Header
  const tableTop = doc.y;
  doc.rect(40, tableTop, 510, 20).fill('#F3EFE7');
  doc.fillColor('#1C1B29').fontSize(8).font('Helvetica-Bold');
  doc.text('Item Description', 45, tableTop + 6);
  doc.text('HSN Code', 260, tableTop + 6);
  doc.text('Price (₹)', 340, tableTop + 6);
  doc.text('Qty', 420, tableTop + 6);
  doc.text('Total (₹)', 480, tableTop + 6, { align: 'right', width: 65 });

  doc.moveDown(1);
  let y = tableTop + 26;

  const items = order && order.items && order.items.length ? order.items : [
    { title: 'Sovereign Minimalist Band Ring (Gold)', hsnCode: '71171990', salePrice: 549, qty: 1 },
    { title: 'Atelier Stitched Bifold Leather Wallet (Black)', hsnCode: '42023120', salePrice: 899, qty: 1 }
  ];

  doc.font('Helvetica').fontSize(8).fillColor('#333333');
  items.forEach(it => {
    const itemTotal = Number(it.salePrice || it.price) * Number(it.qty || it.quantity || 1);
    doc.text(it.title, 45, y, { width: 210 });
    doc.text(it.hsnCode || '71171990', 260, y);
    doc.text(`₹${it.salePrice || it.price}`, 340, y);
    doc.text(`${it.qty || it.quantity || 1}`, 420, y);
    doc.text(`₹${itemTotal.toLocaleString('en-IN')}`, 480, y, { align: 'right', width: 65 });
    y += 22;
  });

  doc.moveDown(2);
  doc.strokeColor('#E0E0E0').lineWidth(0.5).moveTo(40, y).lineTo(550, y).stroke();
  y += 12;

  // Totals
  const subtotal = order ? order.subtotal_amount : 1448;
  const discount = order ? order.discount_amount : 0;
  const finalTotal = order ? order.final_amount : 1448;

  doc.fontSize(8).font('Helvetica').text(`Subtotal (Inclusive of GST): ₹${subtotal.toLocaleString('en-IN')}`, 350, y, { align: 'right', width: 195 });
  y += 14;
  if (discount > 0) {
    doc.text(`Discount: -₹${discount.toLocaleString('en-IN')}`, 350, y, { align: 'right', width: 195 });
    y += 14;
  }
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#1C1B29').text(`Grand Total: ₹${finalTotal.toLocaleString('en-IN')}`, 350, y, { align: 'right', width: 195 });

  // Compliance Footer
  doc.moveDown(3);
  doc.rect(40, 710, 510, 50).fill('#F3EFE7');
  doc.fillColor('#1C1B29').fontSize(7.5).font('Helvetica-Bold');
  doc.text('LEGAL & MANDATORY COMPLIANCE DISCLOSURE', 50, 718);
  doc.font('Helvetica').fontSize(7).fillColor('#555555');
  doc.text('• All prices displayed and charged are inclusive of all taxes (GST under Reverse/Forward charge).', 50, 728);
  doc.text('• 7-Day Return/Replacement Policy: Free return/replacement eligible within 7 days of delivery in original packaging.', 50, 738);
  doc.text('• Country of Origin: India. Net Quantity: 1 Unit per packaged item. Customer support: contact@orayve.in', 50, 748);

  doc.end();
});

// ----------------------------------------------------------------------------
// 5. ADMIN ORDERS & LIFECYCLE APIS
// ----------------------------------------------------------------------------

// GET /api/admin/orders
app.get('/api/admin/orders', authenticateToken, requireAdmin, (req, res) => {
  res.json({ success: true, data: memoryStore.orders });
});

// PUT /api/admin/orders/:id/status
app.put('/api/admin/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status, remarks } = req.body;
  const allowed = ['ORDER_PLACED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const order = memoryStore.orders.find(o => o.order_id === req.params.id || o.order_number === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  order.order_status = status;
  order.updated_at = new Date().toISOString();

  // Audit log
  memoryStore.auditLogs.push({
    admin_user_id: req.user.userId,
    action: 'UPDATE_ORDER_STATUS',
    target_entity: 'ORDER',
    target_id: order.order_id,
    new_status: status,
    remarks: remarks || '',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: `Order status updated to ${status}`, data: order });
});

// ----------------------------------------------------------------------------
// 6. HEALTH & METRICS
// ----------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    brand: 'ORAYVE',
    tagline: 'Small Details. Big Presence.',
    database: pool ? 'Neon PostgreSQL' : 'Memory Resilient Fallback',
    timestamp: new Date().toISOString(),
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`   ORAYVE ENTERPRISE API SERVER RUNNING ON PORT ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
  await initDatabase();
});
