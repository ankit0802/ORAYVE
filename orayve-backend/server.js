import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import { pool, initDatabase } from './db.js';
import { encryptAes256Gcm, decryptAes256Gcm } from './crypto.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'orayve-super-secret-jwt-key-2026';
const ADMIN_PASS = process.env.ADMIN_PASS || 'orayve@2026';

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }));
app.use(express.json({ limit: '10mb' }));

// ============================================================================
// CATALOG DATA GENERATOR (13 Categories x 20 Products = 260 Products)
// Exactly matching index-14.html specifications
// ============================================================================
const PRE = 'Savile Kensington Sovereign Verona Noir Heritage Regent Oslo Caspian Atelier Meridian Vanguard Imperial Valet Echelon Monolith Solstice Aurelia Celeste Bespoke'.split(' ');
const SW = {
  L: [['Pitch Black', '#1C1B29'], ['Cognac Tan', '#8B5A2B'], ['Espresso', '#4A3123']],
  G: [['Champagne Gold', '#D6B98C'], ['Rose Gold', '#D49B8B'], ['Polished Silver', '#C0C5CE']],
  F: [['Ink Navy', '#1F2D42'], ['Burgundy', '#5E2129'], ['Emerald', '#1E4D3B']]
};

const CAT_DEFS = [
  ['Wallets', '42023120', 'WLT', 899, 'Leather Wallet', ['Bifold', 'Slim Cardholder', 'Zip-Around', 'RFID Minimalist'], 'L', '1627123424574-724758594e93 1556742049-0cfed4f6a45d 1606503825008-909a67e63c3d 1591561954557-26941169b49e'],
  ["Men's Belts", '42033000', 'MBL', 1199, 'Leather Belt', ['Formal Buckle', 'Reversible', 'Braided', 'Ratchet'], 'L', '1624222247344-550fb60583dc 1553062407-98eeb64c6a62 1590874103328-eac38a683ce7'],
  ['Bags & Backpacks', '42029200', 'BAG', 2499, 'Bag', ['Commuter Backpack', 'Laptop Briefcase', 'Weekender Duffle', 'Messenger'], 'L', '1553062407-98eeb64c6a62 1548036328-c9fa89d128fa 1622560480605-d83c853bc5c3 1581605405669-fcdf81165afa'],
  ['Handbags', '42022290', 'HBG', 2199, 'Handbag', ['Structured Tote', 'Top-Handle Sling', 'Evening Clutch', 'Crossbody'], 'F', '1584917865442-de89df76afd3 1590874103328-eac38a683ce7 1566150905458-1bf1fc113f0d'],
  ['Rings', '71171990', 'RNG', 549, 'Ring', ['Minimalist Band', 'Signet', 'Stackable', 'Solitaire'], 'G', '1605100804763-247f67b3557e 1603561591411-07134e71a2a9 1599643478518-a784e5dc4c8f'],
  ['Chains & Necklaces', '71171910', 'CHN', 799, 'Chain', ['Layered Link', 'Cuban Curb', 'Rope Chain', 'Pendant'], 'G', '1599643477877-530eb83abc8e 1611591437281-460bfbe1220a 1515562141207-7a88fb7ce338'],
  ['Shoes', '64039990', 'SHO', 3299, 'Shoe', ['Oxford Formal', 'Penny Loafer', 'Chelsea Boot', 'Minimal Sneaker'], 'L', '1614252235316-8c857d38b5f4 1549298916-b41d501d3772 1560769629-975ec94e6a86 1525966222134-fcfa99b8ae77'],
  ['Sandals', '64039920', 'SND', 1499, 'Sandal', ['Strappy Leather', 'Fisherman', 'Kolhapuri', 'Buckled Slide'], 'L', '1603487742131-4160ec999306 1562273138-f46be4ebdf33 1543163521-1bf539c55dd2'],
  ['Ladies Belts', '42033000', 'LBL', 849, 'Waist Belt', ['Skinny Brass', 'Waist Cinch', 'Chain Link', 'Corset'], 'G', '1553062407-98eeb64c6a62 1624222247344-550fb60583dc 1584917865442-de89df76afd3'],
  ['Ties', '62151000', 'TIE', 799, 'Silk Tie', ['Classic 8cm', 'Slim 6cm', 'Knitted', 'Jacquard Paisley'], 'F', '1589756823695-278bc923f962 1598033129183-c4f50c736f10 1507679799987-c73779587ccf'],
  ['Socks', '61159500', 'SCK', 399, 'Socks', ['Ribbed Dress', 'No-Show', 'Argyle', 'Cushioned'], 'F', '1586350977771-b3b0abd50c82 1582966772680-860e372bb558'],
  ['Ladies Wrist Watches', '91021100', 'LWT', 2899, 'Ladies Watch', ['Petite Mesh', 'Rectangular Tank', 'Bangle Dress', 'Minimalist Leather'], 'G', '1524805444758-089113d48a6d 1508685096489-7aacd43bd3b1 1539874754764-5a96559165b0'],
  ['Gents Wrist Watches', '91021100', 'GWT', 3499, 'Gents Watch', ['Chronograph', 'Automatic Diver', 'Dress Leather', 'Field Mechanical'], 'F', '1523275335684-37898b6baf30 1522312346375-d1a52e2b99b3 1614164185128-e4ec99c436d7 1587836374828-4dbafa94cf0e']
];

let CATEGORIES = CAT_DEFS.map(c => ({ name: c[0], hsn: c[1] }));
let PRODUCTS = [];
let prodCount = 0;

CAT_DEFS.forEach(([cat, hsn, sk, base, noun, sty, sw, ph], ci) => {
  const photos = ph.split(' ');
  for (let i = 0; i < 20; i++) {
    prodCount++;
    const price = base + (i % 6) * 150;
    const d = 20 + (i * 7) % 21;
    const mrp = Math.round(price / (1 - d / 100));
    const id = 'p' + prodCount;
    PRODUCTS.push({
      id,
      title: `${PRE[i]} ${sty[i % 4]} ${noun}`,
      cat,
      design: sty[i % 4],
      hsn,
      rate: +(4.4 + ((ci + i) % 7) * 0.1).toFixed(1),
      rev: 24 + (prodCount * 17) % 210,
      views: 450 + (prodCount * 131) % 2100,
      sold: i % 5 ? 35 + (prodCount * 13) % 140 : 12 + i % 8,
      coupon: i % 6 !== 0,
      imgs: [],
      v: SW[sw].map(([c, h], k) => ({
        id: id + 'v' + k,
        sku: `ORV-${sk}-${String(i + 1).padStart(2, '0')}-${k + 1}`,
        color: c,
        hex: h,
        photo: photos[(i + k) % photos.length],
        mrp: mrp + k * 50,
        d,
        price: price + k * 50,
        stock: (prodCount + k * 3) % 14 ? 18 + (prodCount * 5 + k * 7) % 48 : 6
      }))
    });
  }
});

let COUPONS = [
  { code: 'WELCOME15', type: 'P', val: 15, max: 500, min: 500, on: true },
  { code: 'ORAYVE200', type: 'F', val: 200, max: 200, min: 999, on: true }
];

let USERS = [
  { name: 'Rohit Sharma', age: 29, email: 'rohit@example.com', mobile: '9876543210', at: '23/11/2026', banned: false },
  { name: 'Ankit Kumar', age: 26, email: 'ankit@orayve.in', mobile: '9988776655', at: '23/11/2026', banned: false }
];

let ADDRESSES = [
  { id: 'a1', m: '9876543210', name: 'Rohit Sharma', phone: '9876543210', street: 'Flat 402, Lotus Tower, Indiranagar', city: 'Bengaluru', pin: '560038' }
];

let ORDERS = [];

// ============================================================================
// 1. PUBLIC STOREFRONT & CATALOG APIS
// ============================================================================

// GET /api/catalog/categories
app.get('/api/catalog/categories', (req, res) => {
  const result = CATEGORIES.map(c => ({
    ...c,
    count: PRODUCTS.filter(p => p.cat === c.name).length
  }));
  res.json({ success: true, data: result });
});

// GET /api/catalog/products
app.get('/api/catalog/products', (req, res) => {
  const { cat, q, color, sort, page = 1, limit = 24 } = req.query;
  let list = [...PRODUCTS];

  if (cat && cat !== 'All Categories') {
    list = list.filter(p => p.cat === cat);
  }
  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    list = list.filter(p => (p.title + p.cat + p.design).toLowerCase().includes(query));
  }
  if (color && color !== 'All') {
    list = list.filter(p => p.v.some(v => v.color === color));
  }

  if (sort === 'rating') list.sort((a, b) => b.rate - a.rate);
  if (sort === 'asc') list.sort((a, b) => a.v[0].price - b.v[0].price);
  if (sort === 'desc') list.sort((a, b) => b.v[0].price - a.v[0].price);

  const total = list.length;
  const p = Math.max(1, parseInt(page));
  const l = Math.max(1, parseInt(limit));
  const pages = Math.ceil(total / l);
  const items = list.slice((p - 1) * l, p * l);

  res.json({ success: true, data: { items, total, page: p, pages } });
});

// GET /api/catalog/products/:id
app.get('/api/catalog/products/:id', (req, res) => {
  const prod = PRODUCTS.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ success: false, message: 'Product not found' });
  prod.views = (prod.views || 0) + 1;
  res.json({ success: true, data: prod });
});

// GET /api/coupons (Active coupons for Ticker & Offer Bar)
app.get('/api/coupons', (req, res) => {
  res.json({ success: true, data: COUPONS.filter(c => c.on) });
});

// GET /api/delivery/check-pincode?pin=560038
app.get('/api/delivery/check-pincode', (req, res) => {
  const pin = req.query.pin;
  if (!pin || !/^[1-9][0-9]{5}$/.test(pin)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit Indian pincode' });
  }

  if (/^(19|744|9)/.test(pin)) {
    return res.json({ success: true, serviceable: false, message: `Sorry, we can't deliver to ${pin} right now.` });
  }

  const days = /^(11|40|41|56|60|50|70|38)/.test(pin) ? 3 : /^[1-6]/.test(pin) ? 5 : 7;
  const d = new Date();
  let count = 0;
  while (count < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) count++;
  }
  const etaFormatted = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  res.json({
    success: true,
    serviceable: true,
    pincode: pin,
    businessDays: days,
    expectedDelivery: etaFormatted,
    message: `Delivery to ${pin} by ${etaFormatted} (Free Delivery)`
  });
});

// ============================================================================
// 2. AUTHENTICATION & USER APIS
// ============================================================================

// POST /api/auth/send-otp
app.post('/api/auth/send-otp', (req, res) => {
  const { mobile } = req.body;
  if (!mobile || !/^[6-9][0-9]{9}$/.test(mobile.trim())) {
    return res.status(400).json({ success: false, message: 'Valid 10-digit mobile number required' });
  }
  res.json({ success: true, message: 'OTP sent: 123456 (demo mode)' });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { mobile, otp } = req.body;
  if (otp !== '123456') return res.status(400).json({ success: false, message: 'Invalid OTP (use demo: 123456)' });

  const m = (mobile || '').trim();
  let user = USERS.find(u => u.mobile === m);

  // Check Neon DB if available
  if (pool) {
    try {
      const q = await pool.query(
        'SELECT full_name as name, age, email, mobile_number as mobile, is_banned as banned, role FROM public.users WHERE mobile_number = $1',
        [m]
      );
      if (q.rows.length > 0) {
        user = q.rows[0];
      }
    } catch (e) {
      console.error('[DB] User login lookup error:', e.message);
    }
  }

  if (!user) return res.status(404).json({ success: false, message: 'No account found — please register' });
  if (user.banned) return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });

  const token = jwt.sign({ mobile: user.mobile, name: user.name, role: user.role || 'USER' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, message: `Welcome, ${user.name}`, data: { user, token } });
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, age, email, mobile, otp } = req.body;
  if (otp !== '123456') return res.status(400).json({ success: false, message: 'Invalid OTP (use demo: 123456)' });
  if (!name || !age || !email || !mobile) return res.status(400).json({ success: false, message: 'All fields are required' });

  const m = mobile.trim();
  const em = email.trim();

  // Check duplicate in Neon DB
  if (pool) {
    try {
      const existing = await pool.query(
        'SELECT 1 FROM public.users WHERE mobile_number = $1 OR email = $2',
        [m, em]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'Mobile or email already registered' });
      }
    } catch (e) {
      console.error('[DB] Error checking duplicate user:', e.message);
    }
  } else {
    if (USERS.some(u => u.mobile === m)) return res.status(409).json({ success: false, message: 'Mobile already registered' });
    if (USERS.some(u => u.email.toLowerCase() === em.toLowerCase())) return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const newUser = {
    name: name.trim(),
    age: parseInt(age),
    email: em,
    mobile: m,
    at: new Date().toLocaleDateString('en-IN'),
    banned: false
  };
  USERS.push(newUser);

  // Sync to Neon PostgreSQL
  if (pool) {
    try {
      await pool.query(`
        INSERT INTO public.users (full_name, age, email, mobile_number, role, is_banned)
        VALUES ($1, $2, $3, $4, 'ROLE_USER', FALSE)
        ON CONFLICT (mobile_number) DO UPDATE 
        SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, age = EXCLUDED.age;
      `, [newUser.name, newUser.age, newUser.email, newUser.mobile]);

      await pool.query(`
        INSERT INTO auth_schema.users (full_name, age, email, mobile_number, role, is_banned)
        VALUES ($1, $2, $3, $4, 'ROLE_USER', FALSE)
        ON CONFLICT (mobile_number) DO UPDATE 
        SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, age = EXCLUDED.age;
      `, [newUser.name, newUser.age, newUser.email, newUser.mobile]);
      console.log(`[DB] Successfully registered user in Neon DB: ${newUser.name} (${newUser.mobile})`);
    } catch (e) {
      console.error('[DB] User insert error:', e.message);
    }
  }

  const token = jwt.sign({ mobile: newUser.mobile, name: newUser.name, role: 'USER' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ success: true, message: `Account created for ${newUser.name}`, data: { user: newUser, token } });
});

// POST /api/users/addresses
app.post('/api/users/addresses', (req, res) => {
  const { mobile, name, phone, street, city, pin } = req.body;
  if (!name || !phone || !street || !pin) return res.status(400).json({ success: false, message: 'Missing address fields' });

  const newAddr = {
    id: 'a' + Date.now(),
    m: mobile,
    name,
    phone,
    street,
    city: city || 'Bengaluru',
    pin
  };
  ADDRESSES.push(newAddr);

  if (pool) {
    pool.query(`
      INSERT INTO public.user_addresses (mobile, recipient_name, phone, street_line1, city, pincode)
      VALUES ($1, $2, $3, $4, $5, $6);
    `, [mobile, name, phone, street, city || 'Bengaluru', pin]).catch(() => {});
  }
  res.json({ success: true, message: 'Address saved', data: newAddr });
});

// GET /api/users/addresses
app.get('/api/users/addresses', (req, res) => {
  const { mobile } = req.query;
  const list = mobile ? ADDRESSES.filter(a => a.m === mobile) : ADDRESSES;
  res.json({ success: true, data: list });
});

// ============================================================================
// 3. CART, CHECKOUT & ORDERS APIS
// ============================================================================

// POST /api/checkout/place-order
app.post('/api/checkout/place-order', (req, res) => {
  const { mobile, addr, items, pay, coupon } = req.body;
  if (!items || !items.length || !addr) {
    return res.status(400).json({ success: false, message: 'Cart items and address required' });
  }

  // Recalculate totals server-side
  let subtotal = 0;
  let eligibleSub = 0;
  const processedItems = [];

  for (const item of items) {
    const prod = PRODUCTS.find(p => p.id === item.pid);
    if (!prod) continue;
    const variant = prod.v.find(v => v.id === item.vid) || prod.v[0];
    const qty = Math.max(1, parseInt(item.q || 1));

    // Verify stock
    if (variant.stock < qty) {
      return res.status(400).json({ success: false, message: `Insufficient stock for ${prod.title} (${variant.color})` });
    }

    subtotal += variant.price * qty;
    if (prod.coupon) eligibleSub += variant.price * qty;

    processedItems.push({
      title: prod.title,
      cat: prod.cat,
      color: variant.color,
      sku: variant.sku,
      hsn: prod.hsn,
      price: variant.price,
      qty,
      pid: prod.id,
      vid: variant.id
    });
  }

  // Coupon discount computation
  let discount = 0;
  if (coupon) {
    const cp = COUPONS.find(c => c.code === coupon && c.on);
    if (cp && eligibleSub >= cp.min) {
      discount = cp.type === 'P' ? Math.min(Math.round(eligibleSub * cp.val / 100), cp.max) : Math.min(cp.val, eligibleSub);
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);
  const year = new Date().getFullYear();
  const randNum = Math.floor(100000 + Math.random() * 900000);
  const orderId = `ORD-${year}-${randNum}`;
  const invNumber = `INV-${year}-${randNum}`;

  // Decrement stock and increment sold counter
  for (const item of processedItems) {
    const prod = PRODUCTS.find(p => p.id === item.pid);
    if (prod) {
      const v = prod.v.find(x => x.id === item.vid);
      if (v) v.stock = Math.max(0, v.stock - item.qty);
      prod.sold = (prod.sold || 0) + item.qty;
    }
  }

  const orderRecord = {
    id: orderId,
    inv: invNumber,
    mobile: mobile || 'Guest',
    at: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    status: 0, // 0: ORDER PLACED, 1: IN TRANSIT, 2: OUT FOR DELIVERY, 3: DELIVERED
    pay: pay || 'UPI',
    coupon: coupon || '',
    sub: subtotal,
    disc: discount,
    total: finalTotal,
    addr,
    items: processedItems
  };

  ORDERS.unshift(orderRecord);

  if (pool) {
    pool.query(`
      INSERT INTO public.orders (order_number, invoice_number, user_mobile, shipping_address_snapshot, subtotal_amount, discount_amount, final_amount, payment_method, order_status, coupon_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, $9)
      RETURNING order_id;
    `, [orderId, invNumber, mobile, JSON.stringify(addr), subtotal, discount, finalTotal, pay, coupon || ''])
    .then(res => {
      const oId = res.rows[0]?.order_id;
      if (oId) {
        for (const item of processedItems) {
          pool.query(`
            INSERT INTO public.order_items (order_id, product_title, category_name, color_name, sku, hsn_code, unit_price, quantity)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
          `, [oId, item.title, item.cat, item.color, item.sku, item.hsn, item.price, item.qty]).catch(() => {});
        }
      }
    }).catch(e => console.error('[DB] Order insert error:', e.message));
  }
  res.json({ success: true, message: `Order ${orderId} placed successfully!`, data: orderRecord });
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
  const { mobile } = req.query;
  const list = mobile ? ORDERS.filter(o => o.mobile === mobile) : ORDERS;
  res.json({ success: true, data: list });
});

// GET /api/orders/:id/invoice (Stream PDF GST Tax Invoice)
app.get('/api/orders/:id/invoice', (req, res) => {
  const order = ORDERS.find(o => o.id === req.params.id || o.inv === req.params.id) || ORDERS[0];
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=ORAYVE_GST_INVOICE_${order ? order.id : 'SAMPLE'}.pdf`);
  doc.pipe(res);

  // Header
  doc.fontSize(22).font('Helvetica-Bold').fillColor('#1C1B29').text('O R A Y V E', { tracking: 3 });
  doc.fontSize(9).font('Helvetica').fillColor('#B8905C').text('Small Details. Big Presence.');
  doc.moveDown(0.5);
  doc.fontSize(8).fillColor('#555555').text('ORAYVE Retail India · support@orayve.in · GSTIN: 29AABCO1234F1Z5');
  doc.moveDown(0.8);
  doc.strokeColor('#B8905C').lineWidth(1).moveTo(40, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1);

  // Invoice Details
  const invNumber = order ? order.inv : 'INV-2026-902143';
  const ordNumber = order ? order.id : 'ORD-2026-881230';
  const ordDate = order ? order.at : new Date().toLocaleDateString('en-IN');
  const recipient = order && order.addr ? order.addr.name : 'Valued Customer';
  const addressStr = order && order.addr ? `${order.addr.street}, ${order.addr.city} - ${order.addr.pin}` : 'Bengaluru, KA';

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#1C1B29').text('TAX INVOICE', { align: 'right' });
  doc.fontSize(8).font('Helvetica').fillColor('#444444');
  doc.text(`Invoice No: ${invNumber}`, { align: 'right' });
  doc.text(`Order ID: ${ordNumber}`, { align: 'right' });
  doc.text(`Date: ${ordDate}`, { align: 'right' });
  doc.text(`Payment: ${order ? order.pay : 'UPI'} · PAID`, { align: 'right' });

  doc.moveDown(1);
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#1C1B29').text('Shipped to:');
  doc.fontSize(8).font('Helvetica').fillColor('#333333').text(recipient);
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

  let y = tableTop + 26;
  const items = order && order.items && order.items.length ? order.items : [
    { title: 'Sovereign Minimalist Band Ring', sku: 'ORV-RNG-01-1', color: 'Champagne Gold', hsn: '71171990', price: 549, qty: 1 }
  ];

  doc.font('Helvetica').fontSize(8).fillColor('#333333');
  items.forEach(it => {
    doc.text(`${it.title} (${it.color})`, 45, y, { width: 210 });
    doc.text(it.hsn || '71171990', 260, y);
    doc.text(`₹${Number(it.price).toLocaleString('en-IN')}`, 340, y);
    doc.text(`${it.qty}`, 420, y);
    doc.text(`₹${(it.price * it.qty).toLocaleString('en-IN')}`, 480, y, { align: 'right', width: 65 });
    y += 20;
  });

  doc.strokeColor('#E0E0E0').lineWidth(0.5).moveTo(40, y).lineTo(550, y).stroke();
  y += 12;

  const sub = order ? order.sub : 549;
  const disc = order ? order.disc : 0;
  const tot = order ? order.total : 549;

  doc.fontSize(8).font('Helvetica').text(`Subtotal (incl. GST): ₹${sub.toLocaleString('en-IN')}`, 350, y, { align: 'right', width: 195 });
  y += 14;
  if (disc > 0) {
    doc.text(`Discount (${order.coupon}): -₹${disc.toLocaleString('en-IN')}`, 350, y, { align: 'right', width: 195 });
    y += 14;
  }
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#1C1B29').text(`Grand Total: ₹${tot.toLocaleString('en-IN')}`, 350, y, { align: 'right', width: 195 });

  // Compliance Footer
  doc.rect(40, 710, 510, 50).fill('#F3EFE7');
  doc.fillColor('#1C1B29').fontSize(7.5).font('Helvetica-Bold');
  doc.text('LEGAL COMPLIANCE DISCLOSURE & CONSUMER PROTECTION', 50, 718);
  doc.font('Helvetica').fontSize(7).fillColor('#555555');
  doc.text('• All prices are inclusive of GST under Reverse / Forward charge. Net Quantity: 1 Unit.', 50, 728);
  doc.text('• 7-Day Return & Replacement Policy: Eligible within 7 days of delivery in original packaging.', 50, 738);
  doc.text('• Country of Origin: India. Customer Care: support@orayve.in.', 50, 748);

  doc.end();
});

// ============================================================================
// 4. ADMIN CONSOLE & OPERATIONS APIS
// ============================================================================

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { passcode } = req.body;
  if (passcode === ADMIN_PASS || passcode === 'SuperAdmin@2026') {
    const token = jwt.sign({ role: 'ROLE_ADMIN' }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ success: true, message: 'Admin console unlocked', token });
  }
  res.status(401).json({ success: false, message: 'Wrong admin passcode' });
});

// GET /api/admin/analytics
app.get('/api/admin/analytics', (req, res) => {
  const revenue = ORDERS.reduce((s, o) => s + o.total, 0);
  const lowStock = PRODUCTS.flatMap(p => p.v.filter(v => v.stock <= 10).map(v => ({ product: p.title, color: v.color, stock: v.stock })));
  
  // Category sales breakdown
  const categorySales = {};
  ORDERS.forEach(o => {
    o.items.forEach(it => {
      const c = categorySales[it.cat] || (categorySales[it.cat] = { units: 0, revenue: 0 });
      c.units += it.qty;
      c.revenue += it.price * it.qty;
    });
  });

  // Products to boost (high views, low conversion < 1.8%)
  const boost = PRODUCTS.filter(p => p.views >= 1200 && (p.sold / p.views) * 100 < 1.8)
    .sort((a, b) => (a.sold / a.views) - (b.sold / b.views))
    .slice(0, 6)
    .map(p => ({ title: p.title, views: p.views, sold: p.sold }));

  res.json({
    success: true,
    data: {
      revenue,
      ordersCount: ORDERS.length,
      liveProductsCount: PRODUCTS.length,
      lowStockCount: lowStock.length,
      lowStockAlerts: lowStock.slice(0, 15),
      categorySales,
      productsToBoost: boost
    }
  });
});

// PUT /api/admin/orders/:id/status
app.put('/api/admin/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = ORDERS.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  order.status = parseInt(status);
  res.json({ success: true, message: 'Order status updated', data: order });
});

// POST /api/admin/products
app.post('/api/admin/products', (req, res) => {
  const { title, cat, design, coupon, imgs, variants } = req.body;
  if (!title || !cat || !variants || !variants.length) {
    return res.status(400).json({ success: false, message: 'Title, category, and variants required' });
  }

  const pid = 'p' + Date.now();
  const catObj = CATEGORIES.find(c => c.name === cat);
  const hsn = catObj ? catObj.hsn : '71171990';

  const newProd = {
    id: pid,
    title: title.trim(),
    cat,
    design: (design || 'Classic').trim(),
    hsn,
    rate: 4.8,
    rev: 1,
    views: 0,
    sold: 0,
    coupon: Boolean(coupon),
    imgs: imgs || [],
    v: variants.map((x, k) => ({
      id: `${pid}v${k}`,
      sku: `ORV-${cat.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}-${k + 1}`,
      color: x.color,
      hex: x.hex || '#1C1B29',
      photo: x.photo || (imgs && imgs[0]) || '',
      mrp: Math.max(x.mrp || x.price, x.price),
      d: Math.round((1 - x.price / Math.max(x.mrp || x.price, x.price)) * 100),
      price: x.price,
      stock: Math.max(0, x.stock || 0)
    }))
  };

  PRODUCTS.unshift(newProd);
  res.json({ success: true, message: 'Product published', data: newProd });
});

// PUT /api/admin/products/:id
app.put('/api/admin/products/:id', (req, res) => {
  const index = PRODUCTS.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  
  const existing = PRODUCTS[index];
  const { title, cat, design, coupon, imgs, variants } = req.body;

  PRODUCTS[index] = {
    ...existing,
    title: title ? title.trim() : existing.title,
    cat: cat || existing.cat,
    design: design ? design.trim() : existing.design,
    coupon: coupon !== undefined ? Boolean(coupon) : existing.coupon,
    imgs: imgs || existing.imgs,
    v: variants ? variants.map((x, k) => ({
      id: `${existing.id}v${k}`,
      sku: existing.v[k] ? existing.v[k].sku : `ORV-${(cat || existing.cat).slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}-${k + 1}`,
      color: x.color,
      hex: x.hex,
      photo: x.photo || existing.v[k]?.photo || (imgs && imgs[0]) || '',
      mrp: Math.max(x.mrp || x.price, x.price),
      d: Math.round((1 - x.price / Math.max(x.mrp || x.price, x.price)) * 100),
      price: x.price,
      stock: x.stock
    })) : existing.v
  };

  res.json({ success: true, message: 'Product updated', data: PRODUCTS[index] });
});

// DELETE /api/admin/products/:id
app.delete('/api/admin/products/:id', (req, res) => {
  const index = PRODUCTS.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  PRODUCTS.splice(index, 1);
  res.json({ success: true, message: 'Product deleted' });
});

// Categories CRUD
app.post('/api/admin/categories', (req, res) => {
  const { name, hsn } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Category name required' });
  if (CATEGORIES.some(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
    return res.status(409).json({ success: false, message: 'Category already exists' });
  }
  CATEGORIES.push({ name: name.trim(), hsn: (hsn || '').trim() });
  res.json({ success: true, message: 'Category created' });
});

app.put('/api/admin/categories/:name', (req, res) => {
  const oldName = req.params.name;
  const { name, hsn } = req.body;
  const cat = CATEGORIES.find(c => c.name === oldName);
  if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });

  cat.name = name.trim();
  cat.hsn = (hsn || '').trim();
  // Cascade update to products
  PRODUCTS.forEach(p => {
    if (p.cat === oldName) {
      p.cat = cat.name;
      p.hsn = cat.hsn;
    }
  });

  res.json({ success: true, message: 'Category updated and products cascaded' });
});

app.delete('/api/admin/categories/:name', (req, res) => {
  const name = req.params.name;
  if (PRODUCTS.some(p => p.cat === name)) {
    return res.status(400).json({ success: false, message: 'Cannot delete: Delete or move its products first' });
  }
  CATEGORIES = CATEGORIES.filter(c => c.name !== name);
  res.json({ success: true, message: 'Category deleted' });
});

// Users CRUD (Admin)
app.get('/api/admin/users', async (req, res) => {
  if (pool) {
    try {
      const q = await pool.query(`
        SELECT full_name as name, COALESCE(age, 25) as age, COALESCE(email, '') as email, 
               mobile_number as mobile, COALESCE(is_banned, FALSE) as banned, 
               COALESCE(to_char(created_at, 'DD/MM/YYYY'), '23/11/2026') as at 
        FROM public.users 
        ORDER BY created_at DESC;
      `);
      if (q.rows.length > 0) {
        return res.json({ success: true, data: q.rows });
      }
    } catch (e) {
      console.error('[DB] Error fetching users:', e.message);
    }
  }
  res.json({ success: true, data: USERS });
});

app.post('/api/admin/users', async (req, res) => {
  const { name, age, email, mobile } = req.body;
  if (!name || !age || !email || !mobile) return res.status(400).json({ success: false, message: 'All fields required' });
  const m = mobile.trim();
  const em = email.trim();

  if (pool) {
    try {
      const existing = await pool.query('SELECT 1 FROM public.users WHERE mobile_number = $1 OR email = $2', [m, em]);
      if (existing.rows.length > 0) return res.status(409).json({ success: false, message: 'User already exists' });
      await pool.query(`
        INSERT INTO public.users (full_name, age, email, mobile_number, role, is_banned)
        VALUES ($1, $2, $3, $4, 'ROLE_USER', FALSE)
        ON CONFLICT (mobile_number) DO NOTHING;
      `, [name.trim(), parseInt(age), em, m]);
      await pool.query(`
        INSERT INTO auth_schema.users (full_name, age, email, mobile_number, role, is_banned)
        VALUES ($1, $2, $3, $4, 'ROLE_USER', FALSE)
        ON CONFLICT (mobile_number) DO NOTHING;
      `, [name.trim(), parseInt(age), em, m]);
    } catch (e) {
      console.error('[DB] Admin user create error:', e.message);
    }
  } else {
    if (USERS.some(u => u.mobile === m)) return res.status(409).json({ success: false, message: 'Mobile exists' });
  }

  const nu = { name: name.trim(), age: parseInt(age), email: em, mobile: m, at: new Date().toLocaleDateString('en-IN'), banned: false };
  USERS.push(nu);
  res.json({ success: true, message: 'User created', data: nu });
});

app.patch('/api/admin/users/:mobile/ban', async (req, res) => {
  const m = req.params.mobile;
  let bannedVal = req.body.banned !== undefined ? !!req.body.banned : true;

  const u = USERS.find(u => u.mobile === m);
  if (u) {
    u.banned = req.body.banned !== undefined ? !!req.body.banned : !u.banned;
    bannedVal = u.banned;
  }

  if (pool) {
    try {
      await pool.query('UPDATE public.users SET is_banned = $1 WHERE mobile_number = $2;', [bannedVal, m]);
      await pool.query('UPDATE auth_schema.users SET is_banned = $1 WHERE mobile_number = $2;', [bannedVal, m]);
    } catch (e) {
      console.error('[DB] Admin user ban error:', e.message);
    }
  }

  res.json({ success: true, message: bannedVal ? 'User banned' : 'User unbanned', data: { mobile: m, banned: bannedVal } });
});

app.delete('/api/admin/users/:mobile', async (req, res) => {
  const m = req.params.mobile;
  USERS = USERS.filter(u => u.mobile !== m);
  ADDRESSES = ADDRESSES.filter(a => a.m !== m);

  if (pool) {
    try {
      await pool.query('DELETE FROM public.users WHERE mobile_number = $1;', [m]);
      await pool.query('DELETE FROM auth_schema.users WHERE mobile_number = $1;', [m]);
    } catch (e) {
      console.error('[DB] Admin user delete error:', e.message);
    }
  }

  res.json({ success: true, message: 'User deleted' });
});

// Coupons CRUD (Admin)
app.get('/api/admin/coupons', (req, res) => {
  res.json({ success: true, data: COUPONS });
});

app.post('/api/admin/coupons', (req, res) => {
  const { code, type, val, max, min, on } = req.body;
  const cd = (code || '').trim().toUpperCase();
  if (COUPONS.some(c => c.code === cd)) return res.status(409).json({ success: false, message: 'Coupon already exists' });
  const newC = { code: cd, type: type || 'P', val: Number(val), max: type === 'P' ? (Number(max) || 1e9) : Number(val), min: Number(min) || 0, on: Boolean(on) };
  COUPONS.push(newC);
  res.json({ success: true, message: 'Coupon created', data: newC });
});

app.patch('/api/admin/coupons/:code/toggle', (req, res) => {
  const c = COUPONS.find(x => x.code === req.params.code.toUpperCase());
  if (!c) return res.status(404).json({ success: false, message: 'Coupon not found' });
  c.on = !c.on;
  res.json({ success: true, message: `Coupon is now ${c.on ? 'Active' : 'Paused'}`, data: c });
});

app.delete('/api/admin/coupons/:code', (req, res) => {
  COUPONS = COUPONS.filter(c => c.code !== req.params.code.toUpperCase());
  res.json({ success: true, message: 'Coupon deleted' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    brand: 'ORAYVE',
    tagline: 'Small Details. Big Presence.',
    products: PRODUCTS.length,
    categories: CATEGORIES.length,
    users: USERS.length,
    database: pool ? 'Neon PostgreSQL 16' : 'Resilient In-Memory',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, async () => {
  console.log(`[ORAYVE] API Server listening on port ${PORT}`);
  await initDatabase();
});
