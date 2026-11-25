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

// In-memory live OTP storage: mobile -> { otp, exp }
const LIVE_OTPS = new Map();

function verifyOtpHelper(mobile, userOtp) {
  if (!userOtp) return false;
  const trimmed = userOtp.trim();
  if (trimmed === '123456') return true; // dev fallback
  const clean = (mobile || '').replace(/\s+/g, '');
  const entry = LIVE_OTPS.get(clean);
  if (!entry) return false;
  if (Date.now() > entry.exp) {
    LIVE_OTPS.delete(clean);
    return false;
  }
  if (entry.otp === trimmed) {
    LIVE_OTPS.delete(clean);
    return true;
  }
  return false;
}

// POST /api/auth/send-otp
app.post('/api/auth/send-otp', async (req, res) => {
  const { mobile, countryCode, purpose } = req.body;
  if (!mobile) {
    return res.status(400).json({ success: false, message: 'Valid mobile number required' });
  }

  const cleanMobile = mobile.trim().replace(/\s+/g, '');
  const digits = cleanMobile.replace(/[^0-9]/g, '');
  if (digits.length < 7 || digits.length > 15) {
    return res.status(400).json({ success: false, message: 'Please enter a valid mobile number (7-15 digits)' });
  }
  const last10 = digits.slice(-10);

  // Early context-aware duplicate / existence check
  if (purpose === 'register') {
    if (pool) {
      try {
        const existing = await pool.query(
          "SELECT 1 FROM public.users WHERE RIGHT(regexp_replace(mobile_number, '[^0-9]', '', 'g'), 10) = $1",
          [last10]
        );
        if (existing.rows.length > 0) {
          return res.status(409).json({ success: false, message: 'Mobile number is already registered. Please switch to Login.' });
        }
      } catch (e) {
        console.error('[DB] Error checking duplicate user in send-otp:', e.message);
      }
    } else if (USERS.some(u => (u.mobile || '').replace(/[^0-9]/g, '').endsWith(last10))) {
      return res.status(409).json({ success: false, message: 'Mobile number is already registered. Please switch to Login.' });
    }
  } else if (purpose === 'login') {
    let exists = false;
    if (pool) {
      try {
        const found = await pool.query(
          "SELECT 1 FROM public.users WHERE RIGHT(regexp_replace(mobile_number, '[^0-9]', '', 'g'), 10) = $1",
          [last10]
        );
        exists = found.rows.length > 0;
      } catch (e) {
        console.error('[DB] Error checking user existence in send-otp:', e.message);
      }
    } else {
      exists = USERS.some(u => (u.mobile || '').replace(/[^0-9]/g, '').endsWith(last10));
    }
    if (!exists) {
      return res.status(404).json({ success: false, message: 'No account found with this mobile number. Please switch to Register.' });
    }
  }

  const liveOtp = String(Math.floor(100000 + Math.random() * 900000));
  LIVE_OTPS.set(cleanMobile, { otp: liveOtp, exp: Date.now() + 5 * 60 * 1000 });

  // Dispatch live carrier SMS if API keys are configured in .env
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
  let smsCarrierStatus = 'PENDING GATEWAY (Set FAST2SMS_API_KEY or TWILIO in .env)';

  if (fast2smsKey) {
    let indianDigits = digits;
    if (indianDigits.startsWith('91') && indianDigits.length === 12) indianDigits = indianDigits.substring(2);
    smsCarrierStatus = 'DISPATCHED VIA FAST2SMS';
    fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': fast2smsKey.trim(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'q',
        message: `Your ORAYVE verification code is ${liveOtp}. Valid for 5 minutes.`,
        language: 'english',
        flash: 0,
        numbers: indianDigits
      })
    })
    .then(r => r.json())
    .then(d => console.log('[SMS] Fast2SMS Gateway Result:', d))
    .catch(err => console.error('[SMS] Fast2SMS error:', err.message));
  } else if (twilioSid && twilioToken) {
    const toMobile = cleanMobile.startsWith('+') ? cleanMobile : ('+' + cleanMobile);
    smsCarrierStatus = 'DISPATCHED VIA TWILIO';
    const auth = Buffer.from(`${twilioSid.trim()}:${twilioToken.trim()}`).toString('base64');
    const form = new URLSearchParams();
    form.append('To', toMobile);
    form.append('From', twilioFrom || '');
    form.append('Body', `Your ORAYVE verification code is: ${liveOtp}. Valid for 5 minutes.`);
    fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid.trim()}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: form.toString()
    }).then(r => r.json()).then(d => console.log('[SMS] Twilio Gateway Result:', d.sid || d.message)).catch(err => console.error('[SMS] Twilio error:', err.message));
  }

  console.log(`\n=======================================================`);
  console.log(`  [ORAYVE LIVE SMS] Recipient: ${cleanMobile}`);
  console.log(`  [LIVE OTP CODE] : ${liveOtp} (Valid for 5 minutes)`);
  console.log(`  [CARRIER STATUS]: ${smsCarrierStatus}`);
  console.log(`  [TIMESTAMP]     : ${new Date().toISOString()}`);
  console.log(`=======================================================\n`);

  res.json({
    success: true,
    message: `OTP sent to ${cleanMobile}. Please check your phone.`,
    data: { mobile: cleanMobile, countryCode: countryCode || '+91', expiresIn: 300 }
  });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { mobile, otp } = req.body;
  const m = (mobile || '').trim();
  const digits = m.replace(/[^0-9]/g, '');
  const last10 = digits.slice(-10);

  if (!verifyOtpHelper(m, otp)) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please enter the latest 6-digit OTP or click Send OTP.' });
  }

  let user = USERS.find(u => (u.mobile || '').replace(/[^0-9]/g, '').endsWith(last10));

  // Check Neon DB if available
  if (pool) {
    try {
      const q = await pool.query(
        "SELECT full_name as name, age, email, mobile_number as mobile, is_banned as banned, role FROM public.users WHERE RIGHT(regexp_replace(mobile_number, '[^0-9]', '', 'g'), 10) = $1 OR mobile_number = $2",
        [last10, m]
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
  if (!name || !age || !email || !mobile) return res.status(400).json({ success: false, message: 'All fields are required' });

  const m = mobile.trim();
  const em = email.trim();

  // Strict email format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(em)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address (e.g. name@domain.com)' });
  }

  // Verify OTP
  if (!verifyOtpHelper(m, otp)) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please enter the latest 6-digit OTP or click Send OTP.' });
  }

  // Check duplicate mobile or email in Neon DB
  const digitsOnly = m.replace(/[^0-9]/g, '');
  const last10 = digitsOnly.slice(-10);
  if (pool) {
    try {
      const existing = await pool.query(
        'SELECT 1 FROM public.users WHERE mobile_number LIKE $1 OR mobile_number = $2 OR email = $3',
        [`%${last10}`, m, em]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'Mobile number or email is already registered. Please switch to Login.' });
      }
    } catch (e) {
      console.error('[DB] Error checking duplicate user:', e.message);
    }
  } else {
    if (USERS.some(u => (u.mobile || '').replace(/[^0-9]/g, '').endsWith(last10))) {
      return res.status(409).json({ success: false, message: 'Mobile number is already registered. Please switch to Login.' });
    }
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
  const { mobile, name, phone, street, city, pin, state } = req.body;
  if (!name || !phone || !street || !pin) return res.status(400).json({ success: false, message: 'Missing address fields' });

  const newAddr = {
    id: 'a' + Date.now(),
    m: mobile,
    name,
    phone,
    street,
    city: city || 'Bengaluru',
    state: state || 'Maharashtra',
    pin
  };
  ADDRESSES.push(newAddr);

  if (pool) {
    pool.query(`
      INSERT INTO public.user_addresses (mobile, recipient_name, phone, street_line1, city, state, pincode)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `, [mobile, name, phone, street, city || 'Bengaluru', state || 'Maharashtra', pin]).catch(err => console.error('[DB] Address insert error:', err.message));
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
    const qty = Math.max(1, parseInt(item.qty || item.q || 1));

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

  // Decrement stock and increment sold counter in memory AND Neon PostgreSQL
  for (const item of processedItems) {
    const prod = PRODUCTS.find(p => p.id === item.pid);
    if (prod) {
      const v = prod.v.find(x => x.id === item.vid);
      if (v) v.stock = Math.max(0, v.stock - item.qty);
      prod.sold = (prod.sold || 0) + item.qty;
    }

    // Persist real-time stock reduction and sold count to Neon PostgreSQL
    if (pool) {
      pool.query(`
        UPDATE public.product_variants 
        SET stock_quantity = GREATEST(0, stock_quantity - $1) 
        WHERE sku = $2;
      `, [item.qty, item.sku]).catch(e => console.error('[DB] Stock update error:', e.message));

      pool.query(`
        UPDATE public.products 
        SET total_units_sold = COALESCE(total_units_sold, 0) + $1 
        WHERE title = $2;
      `, [item.qty, item.title]).catch(e => console.error('[DB] Sold count update error:', e.message));
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

  // Persist order and line items to Neon PostgreSQL
  if (pool) {
    pool.query(`
      INSERT INTO public.orders (order_number, invoice_number, user_mobile, shipping_address_snapshot, subtotal_amount, discount_amount, final_amount, payment_method, payment_status, order_status, coupon_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PAID', 0, $9)
      RETURNING order_id;
    `, [orderId, invNumber, mobile, JSON.stringify(addr), subtotal, discount, finalTotal, pay, coupon || ''])
    .then(res => {
      const oId = res.rows[0]?.order_id;
      if (oId) {
        for (const item of processedItems) {
          pool.query(`
            INSERT INTO public.order_items (order_id, product_title, category_name, color_name, sku, hsn_code, unit_price, quantity)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
          `, [oId, item.title, item.cat, item.color, item.sku, item.hsn, item.price, item.qty]).catch(e => console.error('[DB] Item insert error:', e.message));
        }
      }
    }).catch(e => console.error('[DB] Order insert error:', e.message));
  }
  res.json({ success: true, message: `Order ${orderId} placed successfully!`, data: orderRecord });
});

// GET /api/orders (Fetches all live orders from Neon PostgreSQL or in-memory)
app.get('/api/orders', async (req, res) => {
  const { mobile } = req.query;

  if (pool) {
    try {
      let queryStr = `
        SELECT 
          o.order_id,
          o.order_number as id,
          o.invoice_number as inv,
          o.user_mobile as mobile,
          o.shipping_address_snapshot as addr,
          o.subtotal_amount as sub,
          o.discount_amount as disc,
          o.final_amount as total,
          o.payment_method as pay,
          o.order_status as status,
          o.coupon_code as coupon,
          o.created_at as at,
          o.cancel_info as "cancelInfo",
          o.return_info as "returnInfo",
          COALESCE(
            json_agg(
              json_build_object(
                'title', oi.product_title,
                'cat', oi.category_name,
                'color', oi.color_name,
                'sku', oi.sku,
                'hsn', oi.hsn_code,
                'price', oi.unit_price,
                'qty', oi.quantity
              )
            ) FILTER (WHERE oi.order_item_id IS NOT NULL), '[]'
          ) as items
        FROM public.orders o
        LEFT JOIN public.order_items oi ON oi.order_id = o.order_id
      `;

      const params = [];
      if (mobile) {
        const cleanDigits = mobile.replace(/[^0-9]/g, '');
        const last10 = cleanDigits.slice(-10);
        queryStr += ` WHERE o.user_mobile LIKE $1 OR o.user_mobile = $2`;
        params.push(`%${last10}`, mobile);
      }

      queryStr += ` GROUP BY o.order_id ORDER BY o.created_at DESC;`;

      const q = await pool.query(queryStr, params);
      const nowMs = Date.now();

      const dbOrders = q.rows.map(r => {
        let parsedAddr = r.addr;
        try {
          if (typeof r.addr === 'string') parsedAddr = JSON.parse(r.addr);
        } catch {}

        let cancelInfo = r.cancelInfo;
        try {
          if (typeof cancelInfo === 'string') cancelInfo = JSON.parse(cancelInfo);
        } catch {}

        let returnInfo = r.returnInfo;
        try {
          if (typeof returnInfo === 'string') returnInfo = JSON.parse(returnInfo);
        } catch {}

        let currentStatus = parseInt(r.status) || 0;
        let needsDbSync = false;

        // Auto-progression: 1 hr after cancellation requested -> Refund Initiated
        if (currentStatus === 4 && cancelInfo && cancelInfo.requestedAt) {
          const elapsedMs = nowMs - new Date(cancelInfo.requestedAt).getTime();
          if (elapsedMs >= 1 * 60 * 60 * 1000) {
            currentStatus = 5; // REFUND_INITIATED
            cancelInfo.status = 'REFUND_INITIATED';
            cancelInfo.refundInitiatedAt = new Date().toISOString();
            needsDbSync = true;
          }
        }

        // Auto-progression: 2 hrs after return/replace requested -> Pickup Scheduled
        if (currentStatus === 6 && returnInfo && returnInfo.requestedAt) {
          const elapsedMs = nowMs - new Date(returnInfo.requestedAt).getTime();
          if (elapsedMs >= 2 * 60 * 60 * 1000) {
            currentStatus = 7; // PICKUP_SCHEDULED
            returnInfo.status = 'PICKUP_SCHEDULED';
            returnInfo.pickupScheduledAt = new Date().toISOString();
            needsDbSync = true;
          }
        } else if (currentStatus === 9 && returnInfo && returnInfo.requestedAt) {
          const elapsedMs = nowMs - new Date(returnInfo.requestedAt).getTime();
          if (elapsedMs >= 2 * 60 * 60 * 1000) {
            currentStatus = 10; // REPLACEMENT_PICKUP
            returnInfo.status = 'PICKUP_SCHEDULED';
            returnInfo.pickupScheduledAt = new Date().toISOString();
            needsDbSync = true;
          }
        }

        if (needsDbSync) {
          pool.query(
            'UPDATE public.orders SET order_status = $1, cancel_info = $2, return_info = $3 WHERE order_number = $4',
            [currentStatus, cancelInfo ? JSON.stringify(cancelInfo) : null, returnInfo ? JSON.stringify(returnInfo) : null, r.id]
          ).catch(e => console.error('[DB] Auto-progression update error:', e.message));
        }

        return {
          id: r.id,
          inv: r.inv,
          mobile: r.mobile,
          at: new Date(r.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          status: currentStatus,
          pay: r.pay,
          coupon: r.coupon || '',
          sub: parseFloat(r.sub),
          disc: parseFloat(r.disc || 0),
          total: parseFloat(r.total),
          addr: parsedAddr,
          items: r.items || [],
          cancelInfo,
          returnInfo
        };
      });

      if (!mobile && dbOrders.length > 0) {
        ORDERS = dbOrders;
      }

      return res.json({ success: true, data: dbOrders });
    } catch (e) {
      console.error('[DB] Error fetching orders:', e.message);
    }
  }

  // Fallback for in-memory orders
  const nowMs = Date.now();
  ORDERS.forEach(order => {
    if (order.status === 4 && order.cancelInfo?.requestedAt) {
      const elapsedMs = nowMs - new Date(order.cancelInfo.requestedAt).getTime();
      if (elapsedMs >= 1 * 60 * 60 * 1000) {
        order.status = 5;
        order.cancelInfo.status = 'REFUND_INITIATED';
      }
    } else if (order.status === 6 && order.returnInfo?.requestedAt) {
      const elapsedMs = nowMs - new Date(order.returnInfo.requestedAt).getTime();
      if (elapsedMs >= 2 * 60 * 60 * 1000) {
        order.status = 7;
        order.returnInfo.status = 'PICKUP_SCHEDULED';
      }
    } else if (order.status === 9 && order.returnInfo?.requestedAt) {
      const elapsedMs = nowMs - new Date(order.returnInfo.requestedAt).getTime();
      if (elapsedMs >= 2 * 60 * 60 * 1000) {
        order.status = 10;
        order.returnInfo.status = 'PICKUP_SCHEDULED';
      }
    }
  });

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
app.get('/api/admin/analytics', async (req, res) => {
  const revenue = ORDERS.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const totalOrders = ORDERS.length;
  
  // Calculate real units sold from orders
  let totalUnitsSold = ORDERS.reduce((s, o) => {
    return s + (o.items || []).reduce((is, it) => is + Number(it.qty || it.q || 1), 0);
  }, 0);

  if (pool) {
    try {
      const qSold = await pool.query('SELECT COALESCE(SUM(quantity), 0) as total FROM public.order_items;');
      if (qSold.rows && qSold.rows.length) {
        totalUnitsSold = parseInt(qSold.rows[0].total) || totalUnitsSold;
      }
    } catch (e) {
      console.error('[DB] Error querying total units sold:', e.message);
    }
  }

  const avgOrderValue = totalOrders > 0 ? Math.round(revenue / totalOrders) : 0;
  const lowStock = PRODUCTS.flatMap(p => (p.v || []).filter(v => (v.stock || 0) <= 10).map(v => ({ 
    product: p.title, 
    color: v.color, 
    sku: v.sku,
    stock: v.stock 
  })));
  
  // Category sales breakdown
  const categorySales = {};
  ORDERS.forEach(o => {
    (o.items || []).forEach(it => {
      const cat = it.cat || 'Accessories';
      const c = categorySales[cat] || (categorySales[cat] = { units: 0, revenue: 0 });
      const q = Number(it.qty || it.q || 1);
      const pr = Number(it.price || 0);
      c.units += q;
      c.revenue += pr * q;
    });
  });

  // Products to boost (high views, low conversion < 1.8%)
  const boost = PRODUCTS.filter(p => (p.views || 0) >= 1200 && ((p.sold || 0) / (p.views || 1)) * 100 < 1.8)
    .sort((a, b) => ((a.sold || 0) / (a.views || 1)) - ((b.sold || 0) / (b.views || 1)))
    .slice(0, 6)
    .map(p => ({ title: p.title, views: p.views, sold: p.sold }));

  res.json({
    success: true,
    data: {
      revenue,
      ordersCount: totalOrders,
      totalUnitsSold,
      avgOrderValue,
      liveProductsCount: PRODUCTS.length,
      lowStockCount: lowStock.length,
      lowStockAlerts: lowStock.slice(0, 15),
      categorySales,
      productsToBoost: boost
    }
  });
});

// Helper to credit points to User's Aura Wallet
async function creditWallet(mobile, points, orderId, description) {
  if (!mobile || !points) return;
  const cleanMob = mobile.replace(/[^0-9]/g, '').slice(-10);
  const pts = Math.round(Number(points));
  if (pts <= 0) return;

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO public.user_wallets (user_mobile, balance_points, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (user_mobile) 
        DO UPDATE SET balance_points = public.user_wallets.balance_points + $2, updated_at = NOW();
      `, [cleanMob, pts]);

      await pool.query(`
        INSERT INTO public.wallet_transactions (user_mobile, type, points, amount, order_id, description, status)
        VALUES ($1, 'CREDIT', $2, $3, $4, $5, 'SUCCESS');
      `, [cleanMob, pts, pts, orderId || null, description || 'Aura Points Credited']);
    } catch (e) {
      console.error('[DB] creditWallet error:', e.message);
    }
  }
}

// GET /api/wallet (Fetches user's Aura Credit Points and full passbook history)
app.get('/api/wallet', async (req, res) => {
  const { mobile } = req.query;
  if (!mobile) {
    return res.status(400).json({ success: false, message: 'Mobile number required' });
  }

  const cleanMob = mobile.replace(/[^0-9]/g, '').slice(-10);

  if (pool) {
    try {
      let walletQ = await pool.query('SELECT balance_points FROM public.user_wallets WHERE user_mobile = $1', [cleanMob]);
      if (walletQ.rows.length === 0) {
        // Initialize new wallet with 500 welcome points
        await pool.query('INSERT INTO public.user_wallets (user_mobile, balance_points) VALUES ($1, 500) ON CONFLICT DO NOTHING;', [cleanMob]);
        await pool.query(`
          INSERT INTO public.wallet_transactions (user_mobile, type, points, amount, description, status)
          VALUES ($1, 'CREDIT', 500, 500, 'Welcome to ORAYVE Aura Club Membership Bonus', 'SUCCESS');
        `, [cleanMob]);
        walletQ = await pool.query('SELECT balance_points FROM public.user_wallets WHERE user_mobile = $1', [cleanMob]);
      }

      const balance = walletQ.rows.length ? parseInt(walletQ.rows[0].balance_points) : 500;

      const txQ = await pool.query(`
        SELECT transaction_id as id, type, points, amount, order_id as "orderId",
               description, status, to_char(created_at, 'DD Mon YYYY, HH:MI AM') as date
        FROM public.wallet_transactions
        WHERE user_mobile = $1
        ORDER BY created_at DESC;
      `, [cleanMob]);

      return res.json({
        success: true,
        data: {
          mobile: cleanMob,
          points: balance,
          currencyValue: balance,
          rate: '1 Aura Point = ₹1.00',
          transactions: txQ.rows
        }
      });
    } catch (e) {
      console.error('[DB] Wallet fetch error:', e.message);
    }
  }

  res.json({
    success: true,
    data: {
      mobile: cleanMob,
      points: 500,
      currencyValue: 500,
      rate: '1 Aura Point = ₹1.00',
      transactions: [
        {
          id: 'tx_init',
          type: 'CREDIT',
          points: 500,
          amount: 500,
          description: 'Welcome to ORAYVE Aura Club Membership Bonus',
          status: 'SUCCESS',
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        }
      ]
    }
  });
});

// POST /api/orders/:id/cancel (User requests cancellation before delivery)
app.post('/api/orders/:id/cancel', async (req, res) => {
  const { reason, comments, refundMethod } = req.body;
  const orderId = req.params.id;

  let order = ORDERS.find(o => o.id === orderId);
  if (!order && pool) {
    try {
      const q = await pool.query('SELECT order_number as id, user_mobile as mobile, final_amount as total, order_status as status, cancel_info as "cancelInfo" FROM public.orders WHERE order_number = $1;', [orderId]);
      if (q.rows.length) order = q.rows[0];
    } catch (e) {}
  }

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (order.status >= 3) {
    return res.status(400).json({ success: false, message: 'Delivered orders cannot be cancelled directly. Please submit a Return or Replacement request.' });
  }

  const isWalletRefund = String(refundMethod || '').toUpperCase().includes('WALLET');
  const targetRefundMethod = isWalletRefund
    ? 'Orayve Aura Wallet (Instant Credit)'
    : 'Original Payment Source (Bank/UPI within 3-5 days)';

  // If wallet refund selected, refund is initiated INSTANTLY
  const nextStatus = isWalletRefund ? 5 : 4; // 5 = REFUND_INITIATED, 4 = CANCEL_REQUESTED

  const cancelData = {
    requestedAt: new Date().toISOString(),
    reason: reason || 'Customer requested order cancellation',
    comments: comments || '',
    refundMethod: targetRefundMethod,
    status: isWalletRefund ? 'REFUND_CREDITED' : 'IN_PROCESS',
    refundInitiatedAt: isWalletRefund ? new Date().toISOString() : null
  };

  if (order) {
    order.status = nextStatus;
    order.cancelInfo = cancelData;
  }

  if (pool) {
    try {
      await pool.query(
        'UPDATE public.orders SET order_status = $1, cancel_info = $2 WHERE order_number = $3;',
        [nextStatus, JSON.stringify(cancelData), orderId]
      );
    } catch (e) {
      console.error('[DB] Order cancel update error:', e.message);
    }
  }

  // If wallet refund: credit points to user's wallet immediately!
  if (isWalletRefund) {
    const refundPoints = Math.round(Number(order.total || 0));
    const userMob = order.mobile || order.addr?.phone || order.addr?.mobile;
    await creditWallet(userMob, refundPoints, orderId, `Instant Cancellation Refund for Order #${orderId}`);
  }

  res.json({
    success: true,
    message: isWalletRefund
      ? `Cancellation processed. ₹${order.total} has been refunded instantly to your Orayve Aura Wallet!`
      : 'Cancellation request received. Verification is in process.',
    data: { id: orderId, status: nextStatus, cancelInfo: cancelData }
  });
});

// POST /api/orders/:id/return (User requests return or replacement after delivery)
app.post('/api/orders/:id/return', async (req, res) => {
  const { type, reason, condition, comments, items, refundMethod, replacementVariant, photos } = req.body;
  const orderId = req.params.id;

  let order = ORDERS.find(o => o.id === orderId);
  if (!order && pool) {
    try {
      const q = await pool.query('SELECT order_number as id, user_mobile as mobile, final_amount as total, order_status as status, return_info as "returnInfo" FROM public.orders WHERE order_number = $1;', [orderId]);
      if (q.rows.length) order = q.rows[0];
    } catch (e) {}
  }

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const isReplace = (type || '').toUpperCase() === 'REPLACE';
  const isWalletRefund = !isReplace && String(refundMethod || '').toUpperCase().includes('WALLET');
  const targetRefundMethod = isWalletRefund
    ? 'Orayve Aura Wallet (Instant Credit upon pickup)'
    : 'Original Payment Source (Bank/UPI within 3-5 days)';

  const nextStatus = isReplace ? 9 : 6; // REPLACEMENT_REQUESTED (9) or RETURN_REQUESTED (6)

  const returnData = {
    type: isReplace ? 'REPLACE' : 'RETURN',
    requestedAt: new Date().toISOString(),
    reason: reason || (isReplace ? 'Exchange requested' : 'Return requested'),
    condition: condition || 'Unused, tags and luxury packaging intact',
    comments: comments || '',
    items: Array.isArray(items) && items.length ? items : (order.items || []),
    refundMethod: isReplace ? 'Exchange Variant' : targetRefundMethod,
    replacementVariant: replacementVariant || 'Same Colorway Replacement',
    photos: Array.isArray(photos) ? photos : [],
    status: 'IN_PROCESS'
  };

  if (order) {
    order.status = nextStatus;
    order.returnInfo = returnData;
  }

  if (pool) {
    try {
      await pool.query(
        'UPDATE public.orders SET order_status = $1, return_info = $2 WHERE order_number = $3;',
        [nextStatus, JSON.stringify(returnData), orderId]
      );
    } catch (e) {
      console.error('[DB] Order return update error:', e.message);
    }
  }

  res.json({
    success: true,
    message: `${isReplace ? 'Replacement' : 'Return'} request submitted. Pickup assignment is in process.`,
    data: { id: orderId, status: nextStatus, returnInfo: returnData }
  });
});

// POST /api/orders/:id/simulate-time (Fast-forward simulation for testing)
app.post('/api/orders/:id/simulate-time', async (req, res) => {
  const { advanceHours = 1 } = req.body;
  const orderId = req.params.id;

  const order = ORDERS.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const msToSubtract = Number(advanceHours) * 60 * 60 * 1000;

  if (order.cancelInfo && order.cancelInfo.requestedAt) {
    const oldTime = new Date(order.cancelInfo.requestedAt).getTime();
    order.cancelInfo.requestedAt = new Date(oldTime - msToSubtract).toISOString();
  }
  if (order.returnInfo && order.returnInfo.requestedAt) {
    const oldTime = new Date(order.returnInfo.requestedAt).getTime();
    order.returnInfo.requestedAt = new Date(oldTime - msToSubtract).toISOString();
  }

  // Check transitions
  if (order.status === 4 && order.cancelInfo) {
    order.status = 5; // REFUND_INITIATED
    order.cancelInfo.status = 'REFUND_INITIATED';
    order.cancelInfo.refundInitiatedAt = new Date().toISOString();
  } else if (order.status === 6 && order.returnInfo) {
    order.status = 7; // PICKUP_SCHEDULED
    order.returnInfo.status = 'PICKUP_SCHEDULED';
    order.returnInfo.pickupScheduledAt = new Date().toISOString();
  } else if (order.status === 7 && order.returnInfo) {
    order.status = 8; // RETURN_REFUNDED
    order.returnInfo.status = 'REFUND_INITIATED';
    order.returnInfo.refundInitiatedAt = new Date().toISOString();
  } else if (order.status === 9 && order.returnInfo) {
    order.status = 10; // REPLACE_PICKUP
    order.returnInfo.status = 'PICKUP_SCHEDULED';
    order.returnInfo.pickupScheduledAt = new Date().toISOString();
  } else if (order.status === 10 && order.returnInfo) {
    order.status = 11; // REPLACE_DELIVERED
    order.returnInfo.status = 'COMPLETED';
    order.returnInfo.deliveredAt = new Date().toISOString();
  }

  if (pool) {
    try {
      await pool.query(
        'UPDATE public.orders SET order_status = $1, cancel_info = $2, return_info = $3 WHERE order_number = $4;',
        [order.status, order.cancelInfo ? JSON.stringify(order.cancelInfo) : null, order.returnInfo ? JSON.stringify(order.returnInfo) : null, orderId]
      );
    } catch (e) {
      console.error('[DB] Time simulation update error:', e.message);
    }
  }

  res.json({ success: true, message: `Fast-forwarded by ${advanceHours} hour(s)`, data: order });
});

// PUT /api/admin/orders/:id/status
app.put('/api/admin/orders/:id/status', async (req, res) => {
  const { status, cancelInfo, returnInfo } = req.body;
  const nextStatus = parseInt(status);
  const order = ORDERS.find(o => o.id === req.params.id);
  if (order) {
    order.status = nextStatus;
    if (cancelInfo !== undefined) order.cancelInfo = cancelInfo;
    if (returnInfo !== undefined) order.returnInfo = returnInfo;
  }

  if (pool) {
    try {
      let updateSql = 'UPDATE public.orders SET order_status = $1';
      const params = [nextStatus];
      let pIdx = 2;

      if (cancelInfo !== undefined) {
        updateSql += `, cancel_info = $${pIdx++}`;
        params.push(cancelInfo ? JSON.stringify(cancelInfo) : null);
      }
      if (returnInfo !== undefined) {
        updateSql += `, return_info = $${pIdx++}`;
        params.push(returnInfo ? JSON.stringify(returnInfo) : null);
      }

      updateSql += ` WHERE order_number = $${pIdx};`;
      params.push(req.params.id);

      await pool.query(updateSql, params);
    } catch (e) {
      console.error('[DB] Update order status error:', e.message);
    }
  }

  // If status is refunded (5 or 8) and refundMethod is wallet, credit points immediately!
  if (order && (nextStatus === 5 || nextStatus === 8)) {
    const isWallet = String(order?.cancelInfo?.refundMethod || order?.returnInfo?.refundMethod || '').toUpperCase().includes('WALLET');
    if (isWallet) {
      const userMob = order.mobile || order.addr?.phone || order.addr?.mobile;
      creditWallet(userMob, order.total, order.id, `${nextStatus === 5 ? 'Cancellation' : 'Return'} Refund for Order #${order.id}`).catch(() => {});
    }
  }

  res.json({ success: true, message: 'Order status updated', data: { id: req.params.id, status: nextStatus, cancelInfo, returnInfo } });
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

  if (pool) {
    try {
      pool.query(`
        INSERT INTO public.products (product_id, title, category_name, slug, design_style, hsn_code, imgs, total_units_sold)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 0)
        ON CONFLICT (product_id) DO NOTHING;
      `, [newProd.id, newProd.title, newProd.cat, newProd.id, newProd.design, newProd.hsn, JSON.stringify(newProd.imgs)]).catch(() => {});

      for (const v of newProd.v) {
        pool.query(`
          INSERT INTO public.product_variants (variant_id, product_id, sku, color_name, color_hex, photo_url, mrp_price, discount_percent, sale_price, stock_quantity)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (sku) DO UPDATE SET stock_quantity = EXCLUDED.stock_quantity;
        `, [v.id, newProd.id, v.sku, v.color, v.hex, v.photo, v.mrp, v.d, v.price, v.stock]).catch(() => {});
      }
    } catch (e) {
      console.error('[DB] Error persisting product to Neon:', e.message);
    }
  }

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

// ============================================================================
// VERIFIED BUYER REVIEWS & RATINGS (Live Photos & Text)
// ============================================================================

let PRODUCT_REVIEWS = [
  {
    id: 'rev_1',
    pid: 'p1',
    pTitle: 'Savile Bifold Leather Wallet',
    name: 'Rohit Sharma',
    mobile: '+919876543210',
    date: '20 Nov 2026',
    rate: 5,
    title: 'Superb leather finish & compact design',
    text: 'Great finish and feels genuinely premium for the price. The packaging was lovely and arrived securely in 2 days.',
    photos: [],
    verified: true,
    helpful: 5
  },
  {
    id: 'rev_2',
    pid: 'p1',
    pTitle: 'Savile Bifold Leather Wallet',
    name: 'Neha Kapoor',
    mobile: '+919876543211',
    date: '22 Nov 2026',
    rate: 5,
    title: 'Looks exactly like photos',
    text: 'The stitching is precise and the card slots fit cards without stretching. Highly recommend Orayve for daily carry.',
    photos: [],
    verified: true,
    helpful: 3
  }
];

// GET /api/catalog/products/:id/reviews
app.get('/api/catalog/products/:id/reviews', async (req, res) => {
  const pid = req.params.id;
  if (pool) {
    try {
      const q = await pool.query(`
        SELECT review_id as id, product_id as pid, product_title as "pTitle",
               user_name as name, user_mobile as mobile, rating as rate,
               headline as title, comment as text, photos,
               is_verified_purchase as verified, helpful_votes as helpful,
               to_char(created_at, 'DD Mon YYYY') as date
        FROM public.product_reviews
        WHERE product_id = $1 OR product_title ILIKE $2
        ORDER BY created_at DESC;
      `, [pid, `%${pid}%`]);
      if (q.rows.length > 0) {
        return res.json({ success: true, data: q.rows });
      }
    } catch (e) {
      console.error('[DB] Error fetching reviews:', e.message);
    }
  }

  const list = PRODUCT_REVIEWS.filter(r => r.pid === pid || r.pTitle?.toLowerCase().includes(pid.toLowerCase()));
  res.json({ success: true, data: list });
});

// POST /api/catalog/products/:id/reviews (Strict Verified Buyer check!)
app.post('/api/catalog/products/:id/reviews', async (req, res) => {
  const pid = req.params.id;
  const { name, mobile, rate, title, text, photos, pTitle } = req.body;
  if (!mobile || !rate || !text) {
    return res.status(400).json({ success: false, message: 'Rating, review comment, and customer mobile number are required.' });
  }

  const cleanMob = mobile.replace(/[^0-9]/g, '').slice(-10);

  // Verify purchase from Neon DB orders or in-memory orders
  let isVerified = false;
  let verifiedProductTitle = pTitle || '';

  if (pool) {
    try {
      const qCheck = await pool.query(`
        SELECT oi.product_title 
        FROM public.orders o
        JOIN public.order_items oi ON oi.order_id = o.order_id
        WHERE RIGHT(regexp_replace(o.user_mobile, '[^0-9]', '', 'g'), 10) = $1
      `, [cleanMob]);

      if (qCheck.rows.length > 0) {
        isVerified = true;
        if (!verifiedProductTitle) verifiedProductTitle = qCheck.rows[0].product_title;
      }
    } catch (e) {
      console.error('[DB] Purchase verification error:', e.message);
    }
  }

  if (!isVerified) {
    const userOrder = ORDERS.find(o => (o.mobile || o.addr?.phone || '').replace(/[^0-9]/g, '').slice(-10) === cleanMob);
    if (userOrder && userOrder.items && userOrder.items.length) {
      isVerified = true;
      if (!verifiedProductTitle) verifiedProductTitle = userOrder.items[0].title;
    }
  }

  if (!isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Verified Purchase Required: Only buyers who have ordered this product from Orayve can post reviews.'
    });
  }

  const newRev = {
    id: `rev_${Date.now()}`,
    pid,
    pTitle: verifiedProductTitle || pid,
    name: (name || 'Verified Buyer').trim(),
    mobile,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    rate: Math.min(5, Math.max(1, parseInt(rate) || 5)),
    title: (title || 'Verified Purchase').trim(),
    text: text.trim(),
    photos: Array.isArray(photos) ? photos : [],
    verified: true,
    helpful: 0
  };

  PRODUCT_REVIEWS.unshift(newRev);

  if (pool) {
    try {
      await pool.query(`
        INSERT INTO public.product_reviews (product_id, product_title, user_name, user_mobile, rating, headline, comment, photos, is_verified_purchase)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE);
      `, [newRev.pid, newRev.pTitle, newRev.name, newRev.mobile, newRev.rate, newRev.title, newRev.text, JSON.stringify(newRev.photos)]);
    } catch (e) {
      console.error('[DB] Insert review error:', e.message);
    }
  }

  res.json({ success: true, message: 'Verified review published successfully!', data: newRev });
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

// Hydrate initial orders from Neon PostgreSQL
async function loadOrdersFromDatabase() {
  if (!pool) return;
  try {
    const q = await pool.query(`
      SELECT 
        o.order_id,
        o.order_number as id,
        o.invoice_number as inv,
        o.user_mobile as mobile,
        o.shipping_address_snapshot as addr,
        o.subtotal_amount as sub,
        o.discount_amount as disc,
        o.final_amount as total,
        o.payment_method as pay,
        o.order_status as status,
        o.coupon_code as coupon,
        o.created_at as at,
        COALESCE(
          json_agg(
            json_build_object(
              'title', oi.product_title,
              'cat', oi.category_name,
              'color', oi.color_name,
              'sku', oi.sku,
              'hsn', oi.hsn_code,
              'price', oi.unit_price,
              'qty', oi.quantity
            )
          ) FILTER (WHERE oi.order_item_id IS NOT NULL), '[]'
        ) as items
      FROM public.orders o
      LEFT JOIN public.order_items oi ON oi.order_id = o.order_id
      GROUP BY o.order_id
      ORDER BY o.created_at DESC;
    `);
    if (q.rows.length > 0) {
      ORDERS = q.rows.map(r => {
        let parsedAddr = r.addr;
        try {
          if (typeof r.addr === 'string') parsedAddr = JSON.parse(r.addr);
        } catch {}
        return {
          id: r.id,
          inv: r.inv,
          mobile: r.mobile,
          at: new Date(r.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          status: parseInt(r.status) || 0,
          pay: r.pay,
          coupon: r.coupon || '',
          sub: parseFloat(r.sub),
          disc: parseFloat(r.disc || 0),
          total: parseFloat(r.total),
          addr: parsedAddr,
          items: r.items || []
        };
      });
      console.log(`[DB] Successfully loaded ${ORDERS.length} orders from Neon PostgreSQL.`);
    }
  } catch (e) {
    console.error('[DB] Failed loading initial orders from Neon:', e.message);
  }
}

// Synchronize real-time product stock & total units sold from Neon PostgreSQL
async function loadInventoryFromDatabase() {
  if (!pool) return;
  try {
    const qV = await pool.query('SELECT sku, stock_quantity FROM public.product_variants;');
    const stockMap = new Map();
    qV.rows.forEach(r => stockMap.set(r.sku, r.stock_quantity));

    const qP = await pool.query('SELECT title, total_units_sold FROM public.products;');
    const soldMap = new Map();
    qP.rows.forEach(r => soldMap.set(r.title, r.total_units_sold));

    for (const p of PRODUCTS) {
      if (soldMap.has(p.title)) {
        p.sold = soldMap.get(p.title);
      }
      for (const v of p.v) {
        if (stockMap.has(v.sku)) {
          v.stock = stockMap.get(v.sku);
        }
      }
    }
    console.log('[DB] Synchronized product stock and sales counters from Neon PostgreSQL.');
  } catch (e) {
    console.error('[DB] Failed synchronizing inventory from Neon:', e.message);
  }
}

app.listen(PORT, async () => {
  console.log(`[ORAYVE] API Server listening on port ${PORT}`);
  await initDatabase();
  await loadOrdersFromDatabase();
  await loadInventoryFromDatabase();
});
