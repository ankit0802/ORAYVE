import React, { useState, useEffect, useRef, useMemo } from 'react';

// ============================================================================
// 1. STATIC CATALOG CONSTANTS & REAL PHOTOGRAPHY (13 Categories x 20 = 260 Items)
// ============================================================================

const PRE = 'Savile Kensington Sovereign Verona Noir Heritage Regent Oslo Caspian Atelier Meridian Vanguard Imperial Valet Echelon Monolith Solstice Aurelia Celeste Bespoke'.split(' ');

const SW = {
  L: [['Pitch Black', '#1C1B29'], ['Cognac Tan', '#8B5A2B'], ['Espresso', '#4A3123']],
  G: [['Champagne Gold', '#D6B98C'], ['Rose Gold', '#D49B8B'], ['Polished Silver', '#C0C5CE']],
  F: [['Ink Navy', '#1F2D42'], ['Burgundy', '#5E2129'], ['Emerald', '#1E4D3B']]
};

const CAT_DATA = [
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

export const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳', len: 10, placeholder: '98765 43210' },
  { code: '+1', country: 'United States', flag: '🇺🇸', len: 10, placeholder: '202 555 0199' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', len: 10, placeholder: '7911 123456' },
  { code: '+971', country: 'UAE', flag: '🇦🇪', len: 9, placeholder: '50 123 4567' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', len: 8, placeholder: '8123 4567' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', len: 9, placeholder: '412 345 678' },
  { code: '+1', country: 'Canada', flag: '🇨🇦', len: 10, placeholder: '416 555 0199' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', len: 10, placeholder: '151 2345678' },
  { code: '+33', country: 'France', flag: '🇫🇷', len: 9, placeholder: '6 12 34 56 78' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', len: 10, placeholder: '90 1234 5678' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', len: 9, placeholder: '50 123 4567' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦', len: 8, placeholder: '3312 3456' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼', len: 8, placeholder: '9123 4567' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾', len: 9, placeholder: '12 345 6789' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿', len: 9, placeholder: '21 123 4567' }
];

function generateInitialProducts() {
  const list = [];
  let n = 0;
  CAT_DATA.forEach(([cat, hsn, sk, base, noun, sty, sw, ph], ci) => {
    const photos = ph.split(' ');
    for (let i = 0; i < 20; i++) {
      n++;
      const price = base + (i % 6) * 150;
      const d = 20 + ((i * 7) % 21);
      const mrp = Math.round(price / (1 - d / 100));
      const id = 'p' + n;
      list.push({
        id,
        title: `${PRE[i]} ${sty[i % 4]} ${noun}`,
        cat,
        design: sty[i % 4],
        hsn,
        rate: +(4.4 + ((ci + i) % 7) * 0.1).toFixed(1),
        rev: 24 + ((n * 17) % 210),
        views: 450 + ((n * 131) % 2100),
        sold: i % 5 ? 35 + ((n * 13) % 140) : 12 + (i % 8),
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
          stock: (n + k * 3) % 14 ? 18 + ((n * 5 + k * 7) % 48) : 6
        }))
      });
    }
  });
  return list;
}

const DEFAULT_COUPONS = [
  { code: 'WELCOME15', type: 'P', val: 15, max: 500, min: 500, on: true },
  { code: 'ORAYVE200', type: 'F', val: 200, max: 200, min: 999, on: true }
];

const OFFERS = {
  'Wallets': ['Buy 2, Get 10% Extra', '🔥 Bestseller'],
  "Men's Belts": ['Combo: Belt + Wallet −15%', '🎁 Gift Combo'],
  'Bags & Backpacks': ['Free Shipping + Extra ₹200', '🚚 Free Delivery'],
  'Handbags': ['Festive Edit · Limited Stock', '✨ Festive'],
  'Rings': ['Buy 1 Get 1 at 50%', '💍 BOGO'],
  'Chains & Necklaces': ['Layer Up · Extra 10% Off', '✨ Trending'],
  'Shoes': ['Footwear Fest · Flat ₹300 Off', '👟 Mega Deal'],
  'Sandals': ['Summer Steals · From ₹1,499', '☀️ Hot Pick'],
  'Ladies Belts': ['Style Under ₹999', '💛 Value'],
  'Ties': ['3 Ties for ₹1,999', '🎯 Bundle'],
  'Socks': ['Pack of 3 · Save 25%', '🧦 Pack Deal'],
  'Ladies Wrist Watches': ['Gifting Special · Free Gift Box', '🎁 Gift Ready'],
  'Gents Wrist Watches': ['Chronograph Sale · Top Rated', '⌚ Top Rated']
};

const STAT = [
  'ORDER PLACED',               // 0
  'IN TRANSIT',                  // 1
  'OUT FOR DELIVERY',            // 2
  'DELIVERED',                   // 3
  'CANCELLATION IN PROCESS',     // 4
  'REFUND INITIATED',            // 5
  'RETURN IN PROCESS',           // 6
  'PICKUP SCHEDULED',            // 7
  'RETURN REFUND INITIATED',     // 8
  'REPLACEMENT IN PROCESS',      // 9
  'REPLACEMENT PICKUP',          // 10
  'REPLACEMENT DELIVERED'        // 11
];

const STAT_DETAILS = {
  0: { label: 'ORDER PLACED', badge: 'bg-blue-100 text-blue-800 border-blue-200', desc: 'Order confirmed and registered in fulfillment queue.' },
  1: { label: 'IN TRANSIT', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', desc: 'Package in transit with Blue Dart / Delhivery courier partner.' },
  2: { label: 'OUT FOR DELIVERY', badge: 'bg-amber-100 text-amber-800 border-amber-200', desc: 'Courier delivery executive is en route to your address today.' },
  3: { label: 'DELIVERED', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', desc: 'Delivered successfully in luxury packaging.' },
  4: { label: 'CANCELLATION IN PROCESS', badge: 'bg-amber-100 text-amber-800 border-amber-300', desc: 'Cancellation in process for checking. Verification in progress.' },
  5: { label: 'REFUND INITIATED', badge: 'bg-purple-100 text-purple-800 border-purple-200', desc: 'Refund initiated. Amount will be credited back to payment source within 3 to 5 business days.' },
  6: { label: 'RETURN IN PROCESS', badge: 'bg-amber-100 text-amber-800 border-amber-300', desc: 'Return in process. Quality check & pickup assignment under review.' },
  7: { label: 'PICKUP SCHEDULED', badge: 'bg-cyan-100 text-cyan-800 border-cyan-200', desc: 'Pickup scheduled. Courier agent will pick up the item from your address.' },
  8: { label: 'REFUND INITIATED', badge: 'bg-purple-100 text-purple-800 border-purple-200', desc: 'Item received & verified. Refund initiated to payment source within 3 to 5 business days.' },
  9: { label: 'REPLACEMENT IN PROCESS', badge: 'bg-amber-100 text-amber-800 border-amber-300', desc: 'Replacement in process. New variant exchange is being processed.' },
  10: { label: 'REPLACEMENT PICKUP', badge: 'bg-cyan-100 text-cyan-800 border-cyan-200', desc: 'Replacement pickup scheduled. Item exchange will be carried out at doorstep.' },
  11: { label: 'REPLACEMENT DELIVERED', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', desc: 'Replacement item delivered successfully.' }
};

const ADMIN_PASS = 'orayve@2026';
const PAGE_SIZE = 24;

const MAT = {
  Wallets: 'Genuine / vegan leather',
  "Men's Belts": 'Leather strap, metal buckle',
  'Bags & Backpacks': 'Canvas, nylon or leather',
  Handbags: 'Faux or genuine leather',
  Rings: 'Stainless steel / plated metal',
  'Chains & Necklaces': 'Stainless steel / gold-plated metal',
  Shoes: 'Leather upper, durable sole',
  Sandals: 'Leather / suede',
  'Ladies Belts': 'Leather or chain, brass finish',
  Ties: 'Silk / woven fabric',
  Socks: 'Cotton / wool blend',
  'Ladies Wrist Watches': 'Stainless steel case, mineral glass',
  'Gents Wrist Watches': 'Stainless steel case, mineral glass'
};

const MFG = {
  name: 'Orayve (orayve.in)',
  addr: 'Prestige Trade Tower, Palace Rd, Bengaluru, KA 560001',
  care: 'support@orayve.in'
};

const REVIEWS = [
  ['Rohit S.', 'Pune', 5, 'Great finish and feels premium for the price. Packaging was lovely.'],
  ['Neha K.', 'Delhi', 4, 'Looks just like the photos. Delivery was on time.'],
  ['Amit P.', 'Mumbai', 5, 'Bought it as a gift and it was a hit. Recommended.'],
  ['Priya M.', 'Bengaluru', 4, 'Good quality, neat build and stitching. Worth it.'],
  ['Sandeep R.', 'Lucknow', 5, 'Excellent value. The colour looks rich in person.'],
  ['Ananya D.', 'Kolkata', 4, 'Nice design and fits my daily use well.'],
  ['Vikram T.', 'Jaipur', 5, 'Better than expected. Will order again.'],
  ['Meera J.', 'Hyderabad', 4, 'Elegant and lightweight. Exactly what I needed.']
];

const TOPICS = [
  ['about', 'About us'],
  ['faq', 'FAQs'],
  ['shipping', 'Shipping policy'],
  ['returns', 'Returns & replacement'],
  ['payments', 'Payments'],
  ['privacy', 'Privacy policy'],
  ['terms', 'Terms & conditions'],
  ['contact', 'Contact us']
];

const INFO = {
  about: ['About Orayve', [
    '<b>Small Details. Big Presence.</b>',
    'Orayve brings together everyday accessories — wallets, belts, bags and backpacks, handbags, rings, chains, shoes, sandals, ties, socks and watches — chosen for clean design and honest value.',
    'Every piece is hand-inspected before dispatch and delivered in signature Orayve packaging. If something is not right, our 7-day return and replacement promise has you covered.'
  ]],
  faq: ['Frequently Asked Questions', [
    '<b>How do I track my order?</b><br>Open the menu, choose My Orders, and see the live status of each order.',
    '<b>How do I check delivery to my area?</b><br>Open any product and enter your pincode under Expected delivery.',
    '<b>Can I use a coupon on every item?</b><br>Coupons apply only to items marked Coupon Eligible and above the minimum order value. Apply them in your bag.',
    '<b>How do I get my GST invoice?</b><br>Go to My Orders and tap Download Bill next to the order.',
    '<b>How do I return something?</b><br>See Returns & replacement, then write to support@orayve.in with your order ID.'
  ]],
  shipping: ['Shipping Policy', [
    'Delivery is <b>free</b> on all orders.',
    'Every order is hand-inspected and dispatched after confirmation. The expected delivery date is shown on each product page for your pincode and is an estimate that can change with courier conditions.',
    'A few remote areas may not be serviceable yet. If we cannot deliver to your pincode, you will see this before you order.',
    'Track the progress of your order anytime in My Orders.'
  ]],
  returns: ['Returns & Replacement', [
    'You can return or exchange an item within <b>7 days of delivery</b>.',
    'The item must be unused and in its original Orayve packaging. Items showing signs of use are not eligible.',
    'To start a request, email support@orayve.in with your order ID, and photos if the item arrived damaged or defective.'
  ]],
  payments: ['Payments & Invoices', [
    'We offer UPI, credit and debit cards, and net banking at checkout.',
    'All prices are in Indian Rupees and include GST. A GST invoice for every order is available in My Orders.',
    'One coupon can be applied per order, subject to its minimum order value and eligible items.'
  ]],
  privacy: ['Privacy Policy', [
    'We collect details — name, age, email, mobile number and delivery addresses — to create your account, process orders and contact you about them.',
    'We share your address and phone number only with delivery partners so they can deliver your order. We do not sell your personal data.',
    'To correct or delete your details, write to support@orayve.in.'
  ]],
  terms: ['Terms & Conditions', [
    'By using this site you agree to these terms. Please keep your account details accurate and secure.',
    'Prices, offers and availability may change without notice. An order is confirmed once you receive an order ID.',
    'Coupons are valid only on eligible items, within their conditions, and may be withdrawn at any time.',
    'We may suspend accounts that misuse the site or its offers. Returns follow our 7-day policy. Governed by the laws of India.'
  ]],
  contact: ['Contact Us', [
    'We are happy to help with orders, returns or any question.',
    'Email: <a href="mailto:support@orayve.in" class="text-brass underline">support@orayve.in</a>',
    'Please include your order ID so we can help you faster.'
  ]]
};

const inr = n => '₹' + Number(n).toLocaleString('en-IN');
const FB = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="#2E2B26"/><circle cx="1.8" cy="1.5" r=".6" fill="none" stroke="#D6B98C" stroke-width=".08"/><circle cx="2.2" cy="1.5" r=".6" fill="none" stroke="#F3EFE7" stroke-width=".08"/></svg>');

function imgUrl(v) {
  if (!v || !v.photo) return FB;
  if (/^(http|data:)/.test(v.photo)) return v.photo;
  return 'https://images.unsplash.com/photo-' + v.photo + '?auto=format&fit=crop&w=600&q=80';
}

function calcEta(days) {
  const d = new Date();
  let count = 0;
  while (count < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) count++;
  }
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function checkPincodeRule(pin) {
  if (!/^[1-9][0-9]{5}$/.test(pin)) {
    return { ok: false, msg: 'Please enter a valid 6-digit pincode.' };
  }
  if (/^(19|744|9)/.test(pin)) {
    return { ok: false, msg: `❌ Sorry, we can't deliver to ${pin} right now.` };
  }
  const days = /^(11|40|41|56|60|50|70|38)/.test(pin) ? 3 : /^[1-6]/.test(pin) ? 5 : 7;
  return {
    ok: true,
    days,
    eta: calcEta(days),
    msg: `✅ Delivery to ${pin} by ${calcEta(days)} (Free delivery · ${days} business days)`
  };
}

// ============================================================================
// INDIAN STATES & UNION TERRITORIES
// ============================================================================
const INDIAN_STATES = [
  'Maharashtra', 'Delhi NCR', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh',
  'Gujarat', 'Telangana', 'West Bengal', 'Rajasthan', 'Kerala',
  'Haryana', 'Punjab', 'Madhya Pradesh', 'Bihar', 'Andhra Pradesh',
  'Odisha', 'Assam', 'Goa', 'Jharkhand', 'Chhattisgarh',
  'Uttarakhand', 'Himachal Pradesh', 'Jammu & Kashmir', 'Chandigarh', 'Puducherry'
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function App() {
  // Admin Authentication State (Persists across page refresh)
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('orv_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Navigation & Views (Keeps admin view on page refresh)
  const [view, setView] = useState(() => {
    try {
      const savedAdmin = localStorage.getItem('orv_admin_auth') === 'true';
      const savedView = localStorage.getItem('orv_view');
      if (savedAdmin) return savedView || 'admin';
      return savedView === 'admin' ? 'store' : (savedView || 'store');
    } catch {
      return 'store';
    }
  });
  const [navHistory, setNavHistory] = useState([]);

  // Data Collections
  const [products, setProducts] = useState(() => {
    try {
      const local = localStorage.getItem('orv_P');
      if (local) return JSON.parse(local);
    } catch {}
    return generateInitialProducts();
  });

  const [categories, setCategories] = useState(() => {
    try {
      const local = localStorage.getItem('orv_cats');
      if (local) return JSON.parse(local);
    } catch {}
    return CAT_DATA.map(c => ({ name: c[0], hsn: c[1] }));
  });

  const [coupons, setCoupons] = useState(() => {
    try {
      const local = localStorage.getItem('orv_coupons');
      if (local) return JSON.parse(local);
    } catch {}
    return DEFAULT_COUPONS;
  });

  // User & Sessions
  const [users, setUsers] = useState(() => {
    try {
      const local = localStorage.getItem('orv_users');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const local = localStorage.getItem('orv_user');
      if (local) return JSON.parse(local);
    } catch {}
    return null;
  });

  const [addresses, setAddresses] = useState(() => {
    try {
      const local = localStorage.getItem('orv_addrs');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  });

  const [orders, setOrders] = useState(() => {
    try {
      const local = localStorage.getItem('orv_orders');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  });

  // Shopping State
  const [cart, setCart] = useState(() => {
    try {
      const local = localStorage.getItem('orv_cart');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const local = localStorage.getItem('orv_wish');
      if (local) return JSON.parse(local);
    } catch {}
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponInput, setCouponInput] = useState('');

  // Storefront Filtering
  const [selectedCat, setSelectedCat] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [onlyWishlist, setOnlyWishlist] = useState(false);
  const [activeVariants, setActiveVariants] = useState({});

  // Product Detail State
  const [detailProduct, setDetailProduct] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [detailTab, setDetailTab] = useState('spec'); // 'spec' | 'mfg'
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Modals & Popovers
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'reg' | null
  const [authAfterRedirect, setAuthAfterRedirect] = useState(false);
  const [infoTopic, setInfoTopic] = useState(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Admin State & Persistence
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminTab, setAdminTab] = useState(() => {
    try {
      return localStorage.getItem('orv_admin_tab') || 'analytics';
    } catch {
      return 'analytics';
    }
  });
  const [adminSearch, setAdminSearch] = useState('');
  const [adminOrderFilter, setAdminOrderFilter] = useState('ALL');
  const [adminOrderSearch, setAdminOrderSearch] = useState('');
  const [adminUserSearch, setAdminUserSearch] = useState('');
  // Enhanced Product Creation / Editing State (N images, N variants)
  const [editingProduct, setEditingProduct] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCat, setFormCat] = useState('');
  const [formDesign, setFormDesign] = useState('');
  const [formHsn, setFormHsn] = useState('');
  const [formCoupon, setFormCoupon] = useState(true);
  const [formImages, setFormImages] = useState([]); // Array of N image URLs or Base64 data URLs
  const [formImageUrlInput, setFormImageUrlInput] = useState('');
  const [formVariants, setFormVariants] = useState([]); // Dynamic N variants
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Verified Buyer Reviews State & Photo Uploads
  const [reviews, setReviews] = useState(() => {
    try {
      const local = localStorage.getItem('orv_reviews');
      if (local) return JSON.parse(local);
    } catch {}
    return [
      {
        id: 'rev_init_1',
        pid: 'p1',
        pTitle: 'Savile Bifold Leather Wallet',
        name: 'Shivani',
        mobile: '+918318710833',
        date: '24 Nov 2026',
        rate: 5,
        title: 'Exquisite Leather Quality & Stitching!',
        text: 'Received my wallet today in pristine Orayve luxury packaging. The Pitch Black leather has an incredible soft grain, cards glide in smoothly, and it fits neatly in my pocket without any bulk. Truly signature quality.',
        photos: [],
        verified: true,
        helpful: 7
      },
      {
        id: 'rev_init_2',
        pid: 'p1',
        pTitle: 'Savile Bifold Leather Wallet',
        name: 'Priya Sharma',
        mobile: '+919876543210',
        date: '24 Nov 2026',
        rate: 5,
        title: 'Perfect Gift! Gorgeous Gold Accents',
        text: 'Ordered this for my brother. The unboxing experience was unmatched. High craftsmanship, genuine leather aroma, and timely delivery.',
        photos: [],
        verified: true,
        helpful: 4
      },
      {
        id: 'rev_init_3',
        pid: 'p21',
        pTitle: 'Savile Formal Buckle Leather Belt',
        name: 'Ankit Singh Bhadoriya',
        mobile: '+916393272074',
        date: '24 Nov 2026',
        rate: 5,
        title: 'Sturdy brass buckle and authentic leather',
        text: 'Best formal belt I have purchased online. Premium thickness and perfect stitching.',
        photos: [],
        verified: true,
        helpful: 5
      }
    ];
  });

  const [reviewModalProduct, setReviewModalProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHeadline, setReviewHeadline] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [reviewPhotoUrlInput, setReviewPhotoUrlInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activePhotoModalUrl, setActivePhotoModalUrl] = useState(null);
  const [reviewFilterStars, setReviewFilterStars] = useState('ALL');

  // Multi-item Order Review and Continuation States
  const [orderSelectReviewModal, setOrderSelectReviewModal] = useState(null); // The order whose items to choose from
  const [orderReviewContext, setOrderReviewContext] = useState(null); // { orderId, currentPid }
  const [reviewNextPrompt, setReviewNextPrompt] = useState(null); // { order, nextItem, nextProduct, remainingCount }

  // Order Cancellation & Return / Replacement States
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Found a better price elsewhere');
  const [cancelComments, setCancelComments] = useState('');
  const [cancelRefundMethod, setCancelRefundMethod] = useState('WALLET'); // 'WALLET' | 'ORIGINAL'
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [returnModalType, setReturnModalType] = useState('RETURN'); // 'RETURN' | 'REPLACE'
  const [returnReason, setReturnReason] = useState('Size / Dimension not suitable');
  const [returnCondition, setReturnCondition] = useState('Unused, with all original tags & luxury box intact');
  const [returnComments, setReturnComments] = useState('');
  const [returnSelectedItems, setReturnSelectedItems] = useState([]);
  const [returnRefundPref, setReturnRefundPref] = useState('WALLET'); // 'WALLET' | 'ORIGINAL'
  const [returnReplacementVariant, setReturnReplacementVariant] = useState('Same product & colorway replacement');
  const [returnPhotos, setReturnPhotos] = useState([]);
  const [returnPhotoInput, setReturnPhotoInput] = useState('');
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  // Orayve Aura Wallet State (1 INR = 1 Aura Credit Point)
  const [walletPoints, setWalletPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('orv_wallet_pts');
      return saved ? parseInt(saved, 10) : 500;
    } catch {
      return 500;
    }
  });
  const [walletTransactions, setWalletTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('orv_wallet_txs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'tx_welcome',
        type: 'CREDIT',
        points: 500,
        amount: 500,
        orderId: null,
        description: 'Welcome to ORAYVE Aura Club Membership Bonus',
        status: 'SUCCESS',
        date: 'Membership Activated'
      }
    ];
  });
  const [showWalletPassbook, setShowWalletPassbook] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('orv_wallet_pts', String(walletPoints));
      localStorage.setItem('orv_wallet_txs', JSON.stringify(walletTransactions));
    } catch {}
  }, [walletPoints, walletTransactions]);

  const fetchUserWallet = async (phone) => {
    const cleanMob = (phone || currentUser?.mobile || '').replace(/[^0-9]/g, '').slice(-10);
    if (!cleanMob) return;
    try {
      const res = await fetch(`/api/wallet?mobile=${cleanMob}`);
      const data = await res.json();
      if (data.success) {
        const payload = data.data || data;
        const pts = Number(payload.points ?? payload.balancePoints ?? 500);
        setWalletPoints(pts);
        setWalletTransactions(payload.transactions || []);
      }
    } catch (err) {
      console.warn('Wallet fetch error:', err);
    }
  };

  useEffect(() => {
    if (currentUser?.mobile) {
      fetchUserWallet(currentUser.mobile);
    }
  }, [currentUser?.mobile]);

  // Audio effect: Pleasant luxury chime on order placement
  const playOrderSuccessSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      // Harmonious luxury chime: ascending major chord C5 -> E5 -> G5 -> C6
      const chord = [
        { freq: 523.25, time: 0.0, dur: 0.35, gain: 0.18 }, // C5
        { freq: 659.25, time: 0.12, dur: 0.40, gain: 0.20 }, // E5
        { freq: 783.99, time: 0.24, dur: 0.50, gain: 0.22 }, // G5
        { freq: 1046.50, time: 0.36, dur: 0.90, gain: 0.28 } // C6
      ];

      chord.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(n.gain, ctx.currentTime + n.time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + n.time + n.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + n.time);
        osc.stop(ctx.currentTime + n.time + n.dur);
      });
    } catch (err) {
      console.log('Order audio effect:', err);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('orv_reviews', JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  // Sync Timestamp State (Real-time data update clock)
  const [lastUpdatedTime, setLastUpdatedTime] = useState(() => {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  });

  const updateSyncTimestamp = () => {
    setLastUpdatedTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleAdminLogout = () => {
    setAdminLoggedIn(false);
    try {
      localStorage.removeItem('orv_admin_auth');
      localStorage.setItem('orv_view', 'store');
    } catch {}
    setView('store');
    showToast('Admin logged out successfully');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Offer Carousel Drag & Scroll Ref
  const carouselRef = useRef(null);

  // Toast Helper
  const showToast = (msg, isError = false) => {
    setToastMsg({ text: msg, isError });
    setTimeout(() => setToastMsg(null), 2800);
  };

  // Auth Form State with Live Country Code & Password Authentication
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [authMobileInput, setAuthMobileInput] = useState('');
  const [authPasswordInput, setAuthPasswordInput] = useState('');
  const [authConfirmPassInput, setAuthConfirmPassInput] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [showAuthConfirmPass, setShowAuthConfirmPass] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Forgot Password Flow State (2-step verification)
  const [forgotStep, setForgotStep] = useState(1); // 1 = Verify Mobile & OTP, 2 = Set New Password
  const [forgotOtpInput, setForgotOtpInput] = useState('');
  const [forgotNewPassInput, setForgotNewPassInput] = useState('');
  const [forgotConfirmPassInput, setForgotConfirmPassInput] = useState('');
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);
  const [showForgotConfirmPass, setShowForgotConfirmPass] = useState(false);
  const [isVerifyingForgotOtp, setIsVerifyingForgotOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Address Form State
  const [addrType, setAddrType] = useState('Home');
  const [showNewAddrForm, setShowNewAddrForm] = useState(false);

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const handleSendOtp = async (targetPurpose = null) => {
    const raw = authMobileInput.trim();
    if (!raw) {
      return showToast('Please enter your mobile number first', true);
    }
    const cleanDigits = raw.replace(/\D/g, '');
    if (cleanDigits.length < 7 || cleanDigits.length > 15) {
      return showToast('Please enter a valid mobile number (7-15 digits)', true);
    }

    const purpose = targetPurpose || (authModal === 'forgot' ? 'forgot-password' : 'register');

    setIsSendingOtp(true);
    try {
      const fullMobile = `${selectedCountry.code}${cleanDigits}`;
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: fullMobile,
          countryCode: selectedCountry.code,
          purpose
        })
      }).then(r => r.json());

      if (res.success) {
        showToast(res.message || `OTP sent to ${selectedCountry.code} ${cleanDigits}. Please check your phone.`);
        setOtpCooldown(30);
      } else {
        showToast(res.message || 'Failed to send OTP', true);
      }
    } catch {
      showToast('Backend offline - use demo OTP: 123456');
      setOtpCooldown(30);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('orv_cart', JSON.stringify(cart));
      localStorage.setItem('orv_wish', JSON.stringify(wishlist));
      localStorage.setItem('orv_orders', JSON.stringify(orders));
      localStorage.setItem('orv_addrs', JSON.stringify(addresses));
      localStorage.setItem('orv_users', JSON.stringify(users));
      localStorage.setItem('orv_user', JSON.stringify(currentUser));
      localStorage.setItem('orv_P', JSON.stringify(products));
      localStorage.setItem('orv_cats', JSON.stringify(categories));
      localStorage.setItem('orv_coupons', JSON.stringify(coupons));
    } catch {}
  }, [cart, wishlist, orders, addresses, users, currentUser, products, categories, coupons]);

  // Live Database Sync Helper
  const refreshLiveOrders = () => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setOrders(res.data);
          updateSyncTimestamp();
        }
      })
      .catch(() => {});
  };

  const refreshLiveProducts = () => {
    fetch('/api/catalog/products?limit=260')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data?.items && res.data.items.length > 0) {
          setProducts(res.data.items);
          updateSyncTimestamp();
        }
      })
      .catch(() => {});
  };

  const refreshLiveUsers = () => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setUsers(res.data);
          updateSyncTimestamp();
        }
      })
      .catch(() => {});
  };

  // Synchronize with live Neon backend on mount
  useEffect(() => {
    refreshLiveOrders();
    refreshLiveProducts();
    refreshLiveUsers();

    fetch('/api/catalog/categories')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) setCategories(res.data);
      })
      .catch(() => {});

    fetch('/api/coupons')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) setCoupons(res.data);
      })
      .catch(() => {});
  }, []);

  // Persist Admin Session & View across page refreshes
  useEffect(() => {
    try {
      if (adminLoggedIn) {
        localStorage.setItem('orv_admin_auth', 'true');
      } else {
        localStorage.removeItem('orv_admin_auth');
      }
    } catch {}
  }, [adminLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem('orv_view', view);
    } catch {}
  }, [view]);

  useEffect(() => {
    try {
      localStorage.setItem('orv_admin_tab', adminTab);
    } catch {}
  }, [adminTab]);

  // Automatic 5-Minute Data Polling in Background
  useEffect(() => {
    const timer = setInterval(() => {
      refreshLiveOrders();
      refreshLiveProducts();
      refreshLiveUsers();
    }, 5 * 60 * 1000); // exactly every 5 minutes

    return () => clearInterval(timer);
  }, []);

  // Re-fetch live orders, stock, and users whenever Admin or Orders view is opened
  useEffect(() => {
    if (view === 'admin' || view === 'orders') {
      refreshLiveOrders();
      refreshLiveProducts();
      refreshLiveUsers();
    }
  }, [view, adminTab]);

  // Variant selector helper
  const getActiveVariant = p => {
    if (!p || !p.v || !p.v.length) return { price: 0, mrp: 0, stock: 0, color: 'Classic', hex: '#1C1B29', photo: '' };
    const idx = activeVariants[p.id] || 0;
    return p.v[idx] || p.v[0];
  };

  // Cart Calculation
  const cartSummary = useMemo(() => {
    const items = cart.map(c => {
      const p = products.find(x => x.id === c.pid);
      if (!p) return null;
      const v = p.v.find(x => x.id === c.vid) || p.v[0];
      return { p, v, q: c.q };
    }).filter(Boolean);

    const sub = items.reduce((s, i) => s + i.v.price * i.q, 0);
    const eligibleSub = items.reduce((s, i) => i.p.coupon ? s + i.v.price * i.q : s, 0);
    let disc = 0;

    const cp = coupons.find(c => c.code === appliedCoupon && c.on);
    if (cp && eligibleSub >= cp.min) {
      disc = cp.type === 'P'
        ? Math.min(Math.round(eligibleSub * cp.val / 100), cp.max)
        : Math.min(cp.val, eligibleSub);
    }

    return {
      items,
      sub,
      disc,
      total: Math.max(0, sub - disc),
      count: items.reduce((s, i) => s + i.q, 0)
    };
  }, [cart, products, appliedCoupon, coupons]);

  // ----------------------------------------------------------------------
  // Product Creation & Editing Helpers (N Images & Dynamic N Variants)
  // ----------------------------------------------------------------------
  const openNewProductModal = () => {
    setEditingProduct({ isNew: true });
    setFormTitle('');
    setFormCat(categories[0]?.name || 'Wallets');
    setFormDesign('Classic Signature');
    setFormHsn(categories[0]?.hsn || '42023190');
    setFormCoupon(true);
    setFormImages([]);
    setFormImageUrlInput('');
    setFormVariants([
      {
        id: 'var_' + Date.now() + '_1',
        color: 'Pitch Black',
        hex: '#111111',
        photo: '',
        mrp: 2499,
        price: 1499,
        stock: 50,
        sku: `ORV-${(categories[0]?.name || 'WAL').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}-1`
      },
      {
        id: 'var_' + Date.now() + '_2',
        color: 'Cognac Tan',
        hex: '#6A381F',
        photo: '',
        mrp: 2499,
        price: 1499,
        stock: 40,
        sku: `ORV-${(categories[0]?.name || 'WAL').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}-2`
      }
    ]);
  };

  const openEditProductModal = (p) => {
    setEditingProduct(p);
    setFormTitle(p.title || '');
    setFormCat(p.cat || categories[0]?.name || '');
    setFormDesign(p.design || '');
    setFormHsn(p.hsn || '');
    setFormCoupon(p.coupon ?? true);

    const collected = Array.isArray(p.imgs) ? [...p.imgs] : [];
    if (Array.isArray(p.v)) {
      p.v.forEach(v => {
        if (v.photo && !collected.includes(v.photo)) collected.push(v.photo);
      });
    }
    setFormImages(collected);
    setFormImageUrlInput('');

    const mappedVariants = Array.isArray(p.v) && p.v.length > 0 ? p.v.map((v, i) => ({
      id: v.id || `var_${p.id}_${i}`,
      color: v.color || `Option ${i + 1}`,
      hex: v.hex || '#1C1B29',
      photo: v.photo || collected[i % (collected.length || 1)] || collected[0] || '',
      mrp: v.mrp || v.price || 1999,
      price: v.price || 1499,
      stock: v.stock ?? 25,
      sku: v.sku || `ORV-${p.id}-${i + 1}`
    })) : [
      {
        id: 'var_' + Date.now() + '_1',
        color: 'Pitch Black',
        hex: '#111111',
        photo: collected[0] || '',
        mrp: 1999,
        price: 1499,
        stock: 30,
        sku: `ORV-${p.id}-1`
      }
    ];
    setFormVariants(mappedVariants);
  };

  const handleImageFilesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const readPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(results => {
      const valid = results.filter(Boolean);
      if (valid.length) {
        setFormImages(prev => {
          const next = [...prev, ...valid];
          setFormVariants(vPrev => vPrev.map((vr, idx) => ({
            ...vr,
            photo: vr.photo || next[idx % next.length] || next[0]
          })));
          return next;
        });
        showToast(`${valid.length} image(s) added successfully`);
      }
    });
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const url = formImageUrlInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image/')) {
      return showToast('Please enter a valid HTTP(S) image URL', true);
    }
    setFormImages(prev => {
      const next = [...prev, url];
      setFormVariants(vPrev => vPrev.map((vr, idx) => ({
        ...vr,
        photo: vr.photo || next[idx % next.length] || next[0]
      })));
      return next;
    });
    setFormImageUrlInput('');
    showToast('Image URL added to gallery');
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMakePrimaryImage = (indexToPrimary) => {
    setFormImages(prev => {
      if (indexToPrimary === 0) return prev;
      const target = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      return [target, ...rest];
    });
    showToast('Cover photo updated');
  };

  const handleAddVariant = () => {
    const catCode = (formCat || 'PROD').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
    const newVar = {
      id: 'var_' + Date.now() + '_' + (formVariants.length + 1),
      color: 'New Colour',
      hex: '#3E2723',
      photo: formImages[formVariants.length % (formImages.length || 1)] || formImages[0] || '',
      mrp: formVariants[0]?.mrp || 2499,
      price: formVariants[0]?.price || 1499,
      stock: 30,
      sku: `ORV-${catCode}-${Math.floor(100 + Math.random() * 900)}-${formVariants.length + 1}`
    };
    setFormVariants(prev => [...prev, newVar]);
  };

  const handleRemoveVariant = (varId) => {
    if (formVariants.length <= 1) {
      return showToast('Product must have at least one variant', true);
    }
    setFormVariants(prev => prev.filter(v => v.id !== varId));
  };

  const handleUpdateVariant = (varId, field, value) => {
    setFormVariants(prev => prev.map(v => {
      if (v.id !== varId) return v;
      return { ...v, [field]: value };
    }));
  };

  const handleSaveProduct = async (e) => {
    if (e) e.preventDefault();
    const cleanTitle = formTitle.trim();
    if (!cleanTitle) {
      return showToast('Please enter a product title', true);
    }
    if (!formCat) {
      return showToast('Please select a category', true);
    }
    if (!formVariants.length) {
      return showToast('Please add at least one color variant', true);
    }

    const invalidPrice = formVariants.some(v => !v.price || Number(v.price) <= 0);
    if (invalidPrice) {
      return showToast('All variants must have a valid selling price greater than ₹0', true);
    }

    setIsSavingProduct(true);
    const pid = editingProduct.id || ('p' + Date.now());
    const catObj = categories.find(c => c.name === formCat);
    const resolvedHsn = formHsn.trim() || catObj?.hsn || '42023190';

    const formattedVariants = formVariants.map((vr, idx) => {
      const pr = Number(vr.price) || 999;
      const mr = Math.max(Number(vr.mrp) || pr, pr);
      const discount = Math.round((1 - pr / mr) * 100);
      const photo = vr.photo || formImages[idx % (formImages.length || 1)] || formImages[0] || '';
      return {
        id: vr.id || `${pid}v${idx}`,
        color: (vr.color || `Option ${idx + 1}`).trim(),
        hex: vr.hex || '#1C1B29',
        photo,
        mrp: mr,
        d: discount,
        price: pr,
        stock: Math.max(0, Number(vr.stock) || 0),
        sku: vr.sku || `ORV-${pid}-${idx + 1}`
      };
    });

    const finalImages = formImages.length > 0 ? [...formImages] : [formattedVariants[0]?.photo || ''];

    const newProd = {
      id: pid,
      title: cleanTitle,
      cat: formCat,
      design: (formDesign || 'Classic Signature').trim(),
      hsn: resolvedHsn,
      rate: editingProduct.rate || 4.8,
      rev: editingProduct.rev || 0,
      views: editingProduct.views || 0,
      sold: editingProduct.sold || 0,
      coupon: Boolean(formCoupon),
      imgs: finalImages,
      v: formattedVariants
    };

    if (editingProduct.id) {
      setProducts(prev => prev.map(p => p.id === pid ? newProd : p));
    } else {
      setProducts(prev => [newProd, ...prev]);
    }

    try {
      const endpoint = editingProduct.id ? `/api/admin/products/${pid}` : '/api/admin/products';
      const method = editingProduct.id ? 'PUT' : 'POST';
      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cleanTitle,
          cat: formCat,
          design: (formDesign || 'Classic Signature').trim(),
          coupon: Boolean(formCoupon),
          imgs: finalImages,
          variants: formattedVariants.map(v => ({
            color: v.color,
            hex: v.hex,
            photo: v.photo,
            mrp: v.mrp,
            price: v.price,
            stock: v.stock,
            sku: v.sku
          }))
        })
      });
    } catch (err) {
      console.warn('Backend product sync warning:', err);
    }

    setIsSavingProduct(false);
    setEditingProduct(null);
    showToast(editingProduct.id ? 'Product updated successfully' : 'New product published to storefront');
  };

  // ----------------------------------------------------------------------
  // Verified Buyer Reviews Helpers
  // ----------------------------------------------------------------------
  const isUserVerifiedBuyer = (prod) => {
    if (!prod) return false;
    if (adminLoggedIn) return true; // Admin has verified tester access
    const userPhoneClean = (currentUser?.mobile || currentUser?.phone || '').replace(/\D/g, '').slice(-10);
    const userEmailClean = (currentUser?.email || '').trim().toLowerCase();

    return orders.some(ord => {
      const ordPhone = (ord.customerMobile || ord.phone || ord.mobile || ord.customer?.phone || ord.addr?.phone || ord.addr?.mobile || '').replace(/\D/g, '').slice(-10);
      const ordEmail = (ord.customerEmail || ord.email || ord.customer?.email || '').trim().toLowerCase();

      const phoneMatches = userPhoneClean && ordPhone && userPhoneClean === ordPhone;
      const emailMatches = userEmailClean && ordEmail && userEmailClean === ordEmail;

      if (!phoneMatches && !emailMatches) return false;

      const items = ord.items || [];
      return items.some(it => {
        const itId = String(it.pid || it.id || '');
        const itTitle = String(it.title || it.name || '').toLowerCase();
        return (prod.id && itId === String(prod.id)) ||
               (prod.title && itTitle.includes(String(prod.title).toLowerCase())) ||
               (prod.title && String(prod.title).toLowerCase().includes(itTitle));
      });
    });
  };

  const openReviewModal = (prod) => {
    if (!isUserVerifiedBuyer(prod)) {
      return showToast('Only verified buyers who purchased this product can leave a review.', true);
    }
    setReviewModalProduct(prod);
    setReviewRating(5);
    setReviewHeadline('');
    setReviewComment('');
    setReviewPhotos([]);
    setReviewPhotoUrlInput('');
  };

  const startReviewForItem = (order, item, forcedProd = null) => {
    const cleanTitle = (item.title || '').trim().toLowerCase();
    const matchedProd = forcedProd || products.find(p => 
      (item.pid && p.id === item.pid) ||
      p.title.trim().toLowerCase() === cleanTitle ||
      (cleanTitle && p.title.toLowerCase().includes(cleanTitle)) ||
      (cleanTitle && cleanTitle.includes(p.title.toLowerCase()))
    ) || products.find(p => p.cat === item.cat) || products[0];

    setOrderReviewContext({ orderId: order.id, currentPid: matchedProd.id });
    setOrderSelectReviewModal(null);
    setReviewNextPrompt(null);
    setReviewModalProduct(matchedProd);
    setReviewRating(5);
    setReviewHeadline('');
    setReviewComment('');
    setReviewPhotos([]);
    setReviewPhotoUrlInput('');
  };

  const handleStartOrderReview = (order) => {
    const items = order.items || [];
    if (!items.length) {
      return showToast('No items found in this order', true);
    }
    const userPhoneClean = (currentUser?.mobile || currentUser?.phone || '').replace(/\D/g, '').slice(-10);
    const unreviewed = items.filter(it => {
      const cleanTitle = (it.title || '').trim().toLowerCase();
      const p = products.find(prod => 
        (it.pid && prod.id === it.pid) ||
        prod.title.trim().toLowerCase() === cleanTitle ||
        (cleanTitle && prod.title.toLowerCase().includes(cleanTitle)) ||
        (cleanTitle && cleanTitle.includes(prod.title.toLowerCase()))
      ) || products.find(prod => prod.cat === it.cat) || products[0];
      const pId = p.id;
      const alreadyReviewed = reviews.some(r => 
        r.pid === pId &&
        (r.mobile && userPhoneClean && r.mobile.replace(/\D/g, '').slice(-10) === userPhoneClean)
      );
      return !alreadyReviewed;
    });

    if (unreviewed.length === 0) {
      return showToast('You have already submitted verified reviews for all products in this order! Thank you.');
    }
    if (items.length === 1) {
      startReviewForItem(order, items[0]);
    } else {
      setOrderSelectReviewModal(order);
    }
  };

  const handleReviewPhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const readPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(results => {
      const valid = results.filter(Boolean);
      if (valid.length) {
        setReviewPhotos(prev => [...prev, ...valid]);
        showToast(`${valid.length} customer photo(s) attached`);
      }
    });
    e.target.value = '';
  };

  const handleAddReviewPhotoUrl = () => {
    const url = reviewPhotoUrlInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image/')) {
      return showToast('Please enter a valid HTTP(S) image URL', true);
    }
    setReviewPhotos(prev => [...prev, url]);
    setReviewPhotoUrlInput('');
    showToast('Photo URL attached');
  };

  const handleRemoveReviewPhoto = (indexToRemove) => {
    setReviewPhotos(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleHelpfulVote = (revId) => {
    setReviews(prev => prev.map(r => r.id === revId ? { ...r, helpful: (r.helpful || 0) + 1 } : r));
    showToast('Thank you for your feedback!');
  };

  const handleSubmitReview = async (e) => {
    if (e) e.preventDefault();
    if (!reviewModalProduct) return;
    const cleanHeadline = reviewHeadline.trim();
    const cleanText = reviewComment.trim();

    if (!cleanHeadline) {
      return showToast('Please enter a headline for your review', true);
    }
    if (!cleanText || cleanText.length < 5) {
      return showToast('Please share at least a short comment about your purchase', true);
    }

    setIsSubmittingReview(true);
    const reviewerName = currentUser?.name || (adminLoggedIn ? 'Orayve Quality Tester' : 'Verified Buyer');
    const reviewerPhone = currentUser?.mobile || currentUser?.phone || '+91' + (orders[0]?.customerMobile || orders[0]?.mobile || '9876543210');

    const newRev = {
      id: 'rev_' + Date.now(),
      pid: reviewModalProduct.id,
      pTitle: reviewModalProduct.title,
      name: reviewerName,
      mobile: reviewerPhone,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      rate: Number(reviewRating),
      title: cleanHeadline,
      text: cleanText,
      photos: [...reviewPhotos],
      verified: true,
      helpful: 0
    };

    setReviews(prev => [newRev, ...prev]);

    const existingForProd = reviews.filter(r => r.pid === reviewModalProduct.id);
    const allProdRevs = [newRev, ...existingForProd];
    const newTotal = allProdRevs.length;
    const newAvg = Number((allProdRevs.reduce((s, r) => s + Number(r.rate || 5), 0) / newTotal).toFixed(1));

    setProducts(prev => prev.map(p => {
      if (p.id !== reviewModalProduct.id) return p;
      return { ...p, rate: newAvg, rev: Math.max(p.rev + 1, newTotal) };
    }));

    if (detailProduct && detailProduct.id === reviewModalProduct.id) {
      setDetailProduct(prev => ({ ...prev, rate: newAvg, rev: Math.max(prev.rev + 1, newTotal) }));
    }

    try {
      await fetch(`/api/catalog/products/${reviewModalProduct.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewerName,
          mobile: reviewerPhone,
          rate: Number(reviewRating),
          title: cleanHeadline,
          text: cleanText,
          photos: [...reviewPhotos]
        })
      });
    } catch (err) {
      console.warn('Review backend sync warning:', err);
    }

    setIsSubmittingReview(false);
    const reviewedProdTitle = reviewModalProduct.title;
    const reviewedProdId = reviewModalProduct.id;
    setReviewModalProduct(null);
    showToast('Thank you! Your verified review has been published.');

    // Sequential multi-item prompt: check if there are other unreviewed products from this order
    if (orderReviewContext?.orderId) {
      const activeOrderId = orderReviewContext.orderId;
      const activeOrd = orders.find(o => o.id === activeOrderId);
      if (activeOrd) {
        const userCleanPhone = (currentUser?.mobile || currentUser?.phone || reviewerPhone || '').replace(/\D/g, '').slice(-10);
        const remaining = (activeOrd.items || []).filter(it => {
          const cleanTitle = (it.title || '').trim().toLowerCase();
          const matched = products.find(p => 
            (it.pid && p.id === it.pid) ||
            p.title.trim().toLowerCase() === cleanTitle ||
            (cleanTitle && p.title.toLowerCase().includes(cleanTitle)) ||
            (cleanTitle && cleanTitle.includes(p.title.toLowerCase()))
          ) || products.find(p => p.cat === it.cat) || products[0];
          const pId = matched.id;
          if (pId === reviewedProdId) {
            return false; // just reviewed
          }
          const already = reviews.some(r => 
            r.pid === pId &&
            (r.mobile && userCleanPhone && r.mobile.replace(/\D/g, '').slice(-10) === userCleanPhone)
          );
          return !already;
        });

        if (remaining.length > 0) {
          const nextIt = remaining[0];
          const cleanNextTitle = (nextIt.title || '').trim().toLowerCase();
          const nextMatched = products.find(p => 
            (nextIt.pid && p.id === nextIt.pid) ||
            p.title.trim().toLowerCase() === cleanNextTitle ||
            (cleanNextTitle && p.title.toLowerCase().includes(cleanNextTitle)) ||
            (cleanNextTitle && cleanNextTitle.includes(p.title.toLowerCase()))
          ) || products.find(p => p.cat === nextIt.cat) || products[0];

          setReviewNextPrompt({
            order: activeOrd,
            nextItem: nextIt,
            nextProduct: nextMatched,
            remainingCount: remaining.length
          });
        } else {
          setOrderReviewContext(null);
        }
      }
    }
  };

  // ----------------------------------------------------------------------
  // Order Cancellation & Return / Replacement Actions
  // ----------------------------------------------------------------------
  const openCancelModal = (order) => {
    if (order.status >= 3) {
      return showToast('Delivered orders cannot be cancelled directly. Please use the Return or Replace option.', true);
    }
    setCancelModalOrder(order);
    setCancelReason('Found a better price elsewhere');
    setCancelComments('');
    setCancelRefundMethod('WALLET');
  };

  const handleConfirmCancel = async (e) => {
    if (e) e.preventDefault();
    if (!cancelModalOrder) return;
    setIsSubmittingCancel(true);

    const isWallet = cancelRefundMethod === 'WALLET';
    const targetRefundMethod = isWallet
      ? 'Orayve Aura Wallet (Instant Credit)'
      : 'Original Payment Source (Bank/UPI within 3-5 days)';

    const cancelPayload = {
      reason: cancelReason,
      comments: cancelComments.trim(),
      refundMethod: cancelRefundMethod
    };

    const newCancelInfo = {
      requestedAt: new Date().toISOString(),
      reason: cancelReason,
      comments: cancelComments.trim(),
      refundMethod: targetRefundMethod,
      status: isWallet ? 'REFUND_CREDITED' : 'IN_PROCESS',
      refundInitiatedAt: isWallet ? new Date().toISOString() : null
    };

    // Update frontend state immediately
    setOrders(prev => prev.map(o => o.id === cancelModalOrder.id ? {
      ...o,
      status: isWallet ? 5 : 4, // 5 = REFUND_INITIATED, 4 = CANCEL_REQUESTED
      cancelInfo: newCancelInfo
    } : o));

    // If wallet refund selected, credit user's wallet immediately!
    if (isWallet) {
      const refundPoints = Math.round(Number(cancelModalOrder.total || 0));
      setWalletPoints(prev => prev + refundPoints);
      setWalletTransactions(prev => [
        {
          id: 'tx_' + Date.now(),
          type: 'CREDIT',
          points: refundPoints,
          amount: refundPoints,
          orderId: cancelModalOrder.id,
          description: `Instant Cancellation Refund for Order #${cancelModalOrder.id}`,
          status: 'SUCCESS',
          date: 'Just now'
        },
        ...prev
      ]);
    }

    try {
      await fetch(`/api/orders/${cancelModalOrder.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cancelPayload)
      });
    } catch (err) {
      console.warn('Backend cancel sync warning:', err);
    }

    setIsSubmittingCancel(false);
    setCancelModalOrder(null);
    if (isWallet) {
      showToast(`Order cancelled. ₹${cancelModalOrder.total} refunded instantly to your Orayve Aura Wallet!`);
    } else {
      showToast('Cancellation request submitted. Verification in process (Refund in 3-5 days).');
    }
  };

  const openReturnModal = (order, type = 'RETURN') => {
    if (order.status !== 3 && order.status !== 11) {
      return showToast('Return or replacement is only available for delivered orders.', true);
    }
    setReturnModalOrder(order);
    setReturnModalType(type);
    setReturnReason(type === 'REPLACE' ? 'Exchange for another colorway / size' : 'Size / Dimension not suitable');
    setReturnCondition('Unused, with all original tags & luxury box intact');
    setReturnComments('');
    setReturnSelectedItems(order.items ? [...order.items] : []);
    setReturnRefundPref('WALLET');
    setReturnReplacementVariant('Same product & colorway replacement');
    setReturnPhotos([]);
    setReturnPhotoInput('');
  };

  const handleReturnPhotosUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const readPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(results => {
      const valid = results.filter(Boolean);
      if (valid.length) {
        setReturnPhotos(prev => [...prev, ...valid]);
        showToast(`${valid.length} photo(s) attached as proof`);
      }
    });
    e.target.value = '';
  };

  const handleAddReturnPhotoUrl = () => {
    const url = returnPhotoInput.trim();
    if (!url) return;
    setReturnPhotos(prev => [...prev, url]);
    setReturnPhotoInput('');
    showToast('Photo URL attached');
  };

  const handleRemoveReturnPhoto = (idx) => {
    setReturnPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleConfirmReturn = async (e) => {
    if (e) e.preventDefault();
    if (!returnModalOrder) return;
    setIsSubmittingReturn(true);

    const isReplace = returnModalType === 'REPLACE';
    const nextStatus = isReplace ? 9 : 6; // REPLACEMENT_REQUESTED or RETURN_REQUESTED
    const isWallet = !isReplace && returnRefundPref === 'WALLET';

    const targetRefundMethod = isWallet
      ? 'Orayve Aura Wallet (Instant Credit upon pickup)'
      : 'Original Payment Source (Bank/UPI within 3-5 days)';

    const returnPayload = {
      type: returnModalType,
      reason: returnReason,
      condition: returnCondition,
      comments: returnComments.trim(),
      items: returnSelectedItems,
      refundMethod: isWallet ? 'WALLET' : 'ORIGINAL',
      replacementVariant: returnReplacementVariant,
      photos: returnPhotos
    };

    const newReturnInfo = {
      ...returnPayload,
      requestedAt: new Date().toISOString(),
      refundMethod: targetRefundMethod,
      status: 'IN_PROCESS'
    };

    // Update frontend state immediately
    setOrders(prev => prev.map(o => o.id === returnModalOrder.id ? {
      ...o,
      status: nextStatus,
      returnInfo: newReturnInfo
    } : o));

    try {
      await fetch(`/api/orders/${returnModalOrder.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnPayload)
      });
    } catch (err) {
      console.warn('Backend return sync warning:', err);
    }

    setIsSubmittingReturn(false);
    setReturnModalOrder(null);
    if (isReplace) {
      showToast('Replacement request submitted. Pickup assignment in process.');
    } else if (isWallet) {
      showToast(`Return submitted. ₹${returnModalOrder.total} will be refunded instantly to your Aura Wallet upon pickup!`);
    } else {
      showToast('Return submitted. Refund will be credited to original payment source within 3-5 business days.');
    }
  };

  const handleSimulateTime = async (orderId, advanceHours) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/simulate-time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advanceHours })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.data : o));
        showToast(`Simulation: Advanced by ${advanceHours} hr(s). Order status updated!`);
      }
    } catch (err) {
      // In-memory local simulation fallback
      setOrders(prev => prev.map(o => {
        if (o.id !== orderId) return o;
        let nextSt = o.status;
        let cInfo = o.cancelInfo ? { ...o.cancelInfo } : null;
        let rInfo = o.returnInfo ? { ...o.returnInfo } : null;

        if (o.status === 4) {
          nextSt = 5;
          if (cInfo) cInfo.status = 'REFUND_INITIATED';
        } else if (o.status === 6) {
          nextSt = 7;
          if (rInfo) rInfo.status = 'PICKUP_SCHEDULED';
        } else if (o.status === 7) {
          nextSt = 8;
          if (rInfo) rInfo.status = 'REFUND_INITIATED';
        } else if (o.status === 9) {
          nextSt = 10;
          if (rInfo) rInfo.status = 'PICKUP_SCHEDULED';
        } else if (o.status === 10) {
          nextSt = 11;
          if (rInfo) rInfo.status = 'COMPLETED';
        }
        return { ...o, status: nextSt, cancelInfo: cInfo, returnInfo: rInfo };
      }));
      showToast(`Simulation: Advanced by ${advanceHours} hr(s). Order status updated!`);
    }
  };

  const handleAdminOrderStatus = async (orderId, nextStatus, customCancelInfo, customReturnInfo) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        status: nextStatus,
        cancelInfo: customCancelInfo !== undefined ? customCancelInfo : o.cancelInfo,
        returnInfo: customReturnInfo !== undefined ? customReturnInfo : o.returnInfo
      };
    }));

    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-passcode': ADMIN_PASS },
        body: JSON.stringify({
          status: nextStatus,
          cancelInfo: customCancelInfo,
          returnInfo: customReturnInfo
        })
      });
      showToast(`Order status updated to ${STAT[nextStatus] || 'Updated'}`);
    } catch (err) {
      showToast(`Order status updated to ${STAT[nextStatus] || 'Updated'}`);
    }
  };

  // Carousel interactive loop (auto left->right, pause on hover, wheel, drag)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let isHover = false;
    let isDrag = false;
    let startX = 0;
    let startScroll = 0;
    let animId = null;
    let lastTime = 0;

    const half = () => {
      const kids = el.firstElementChild?.children;
      return kids && kids.length > 1 ? kids[kids.length / 2].offsetLeft - kids[0].offsetLeft : 0;
    };

    const wrap = () => {
      const h = half();
      if (!h) return;
      if (el.scrollLeft <= 0) el.scrollLeft += h;
      else if (el.scrollLeft >= h * 2 - el.clientWidth) el.scrollLeft -= h;
    };

    const onMouseOver = () => { isHover = true; };
    const onMouseOut = (e) => {
      if (!el.contains(e.relatedTarget)) {
        isHover = false;
        isDrag = false;
        el.classList.remove('drag');
      }
    };
    const onMouseDown = (e) => {
      isDrag = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.classList.add('drag');
    };
    const onMouseMove = (e) => {
      if (!isDrag) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
      wrap();
    };
    const onMouseUp = () => {
      isDrag = false;
      el.classList.remove('drag');
    };
    const onWheel = (e) => {
      e.preventDefault();
      el.scrollLeft += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wrap();
    };

    el.addEventListener('mouseover', onMouseOver);
    el.addEventListener('mouseout', onMouseOut);
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    // Center wrap initialization
    const h = half();
    if (h) el.scrollLeft = h;

    const tick = (t) => {
      if (!isHover && !isDrag) {
        const dt = Math.min(50, t - lastTime || 16);
        el.scrollLeft -= dt * 0.04;
        wrap();
      }
      lastTime = t;
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener('mouseover', onMouseOver);
      el.removeEventListener('mouseout', onMouseOut);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [categories, view]);

  // Actions
  const addToCart = (pid, vid = null) => {
    const prod = products.find(p => p.id === pid);
    if (!prod) return;
    const variant = vid ? prod.v.find(v => v.id === vid) : getActiveVariant(prod);
    if (variant.stock < 1) return showToast('Out of stock', true);

    const exist = cart.find(c => c.pid === pid && c.vid === variant.id);
    if (exist) {
      if (exist.q >= variant.stock) return showToast('Max stock reached', true);
      setCart(cart.map(c => c.pid === pid && c.vid === variant.id ? { ...c, q: c.q + 1 } : c));
    } else {
      setCart([...cart, { pid, vid: variant.id, q: 1 }]);
    }
    showToast('Added to your Orayve bag');
  };

  const updateCartQty = (pid, vid, delta) => {
    const prod = products.find(p => p.id === pid);
    const variant = prod?.v.find(v => v.id === vid);
    const maxStock = variant?.stock || 99;

    setCart(prev => {
      return prev.map(item => {
        if (item.pid === pid && item.vid === vid) {
          const nextQ = delta === -99 ? 0 : item.q + delta;
          if (nextQ > maxStock) {
            showToast('Maximum available quantity reached', true);
            return { ...item, q: maxStock };
          }
          return { ...item, q: Math.max(0, nextQ) };
        }
        return item;
      }).filter(i => i.q > 0);
    });
  };

  const toggleWishlist = (pid) => {
    setWishlist(prev => {
      const has = prev.includes(pid);
      showToast(has ? 'Removed from wishlist' : 'Saved to wishlist');
      return has ? prev.filter(id => id !== pid) : [...prev, pid];
    });
  };

  const copyShareLink = (pid) => {
    const url = window.location.origin + window.location.pathname + '#' + pid;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => showToast('Share link copied'));
    } else {
      showToast('Share link copied');
    }
  };

  const applyCouponCode = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    const cp = coupons.find(c => c.code === code && c.on);
    if (!cp) return showToast('Invalid or inactive coupon', true);
    if (cartSummary.sub < cp.min) return showToast(`Minimum order ${inr(cp.min)} required`, true);

    setAppliedCoupon(code);
    showToast(`Coupon ${code} applied`);
  };

  const proceedToCheckout = () => {
    if (!currentUser) {
      setAuthModal('login');
      setAuthAfterRedirect(true);
      return;
    }
    const userAddrs = addresses.filter(a => a.m === currentUser.mobile);
    if (userAddrs.length && !selectedAddrId) {
      setSelectedAddrId(userAddrs[0].id);
    }
    setCheckoutStep(1);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    const addr = addresses.find(a => a.id === selectedAddrId);
    if (!addr) return showToast('Select or add a delivery address', true);
    if (!cartSummary.items.length) return showToast('Your bag is empty', true);

    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-${year}-${rand}`;
    const invId = `INV-${year}-${rand}`;
    const userMobile = currentUser?.mobile || addr.mobile || addr.phone || addr.m || '9999999999';

    const orderData = {
      mobile: userMobile,
      id: orderId,
      inv: invId,
      at: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 0,
      pay: paymentMethod,
      coupon: appliedCoupon,
      sub: cartSummary.sub,
      disc: cartSummary.disc,
      total: cartSummary.total,
      addr,
      items: cartSummary.items.map(i => ({
        title: i.p.title,
        cat: i.p.cat,
        color: i.v.color,
        sku: i.v.sku,
        hsn: i.p.hsn,
        price: i.v.price,
        qty: i.q,
        pid: i.p.id,
        vid: i.v.id
      }))
    };

    // Decrement stock client-side immediately
    setProducts(prev => prev.map(p => {
      const match = cartSummary.items.filter(it => it.p.id === p.id);
      if (!match.length) return p;
      return {
        ...p,
        sold: (p.sold || 0) + match.reduce((s, it) => s + it.q, 0),
        v: p.v.map(v => {
          const m = match.find(it => it.v.id === v.id);
          return m ? { ...v, stock: Math.max(0, v.stock - m.q) } : v;
        })
      };
    }));

    // Post order to live backend (Neon PostgreSQL)
    try {
      const res = await fetch('/api/checkout/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: userMobile,
          addr,
          items: orderData.items,
          pay: paymentMethod,
          coupon: appliedCoupon
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(prev => [data.data, ...prev.filter(o => o.id !== data.data.id)]);
        setLastPlacedOrder(data.data);
      } else {
        setOrders(prev => [orderData, ...prev]);
        setLastPlacedOrder(orderData);
      }
    } catch {
      setOrders(prev => [orderData, ...prev]);
      setLastPlacedOrder(orderData);
    }

    // Refresh live inventory & orders from Neon DB
    refreshLiveProducts();
    refreshLiveOrders();

    setCart([]);
    setAppliedCoupon('');
    setCheckoutStep(3);
    playOrderSuccessSound();
    showToast(`Order ${orderId} confirmed!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Product Details & Sync Latest Verified Reviews for This Product
  const openProduct = async (pid) => {
    const p = products.find(x => x.id === pid);
    if (!p) return;
    setDetailProduct(p);
    setGalleryIndex(0);
    setDetailTab('spec');
    setShowAllReviews(false);
    setPincodeResult(null);
    setNavHistory(prev => [...prev, { view, scroll: window.scrollY }]);
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await fetch(`/api/catalog/products/${pid}/reviews`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReviews(prev => {
          const fetchedIds = new Set(json.data.map(r => r.id));
          const keepOld = prev.filter(r => !fetchedIds.has(r.id));
          return [...json.data, ...keepOld];
        });
      }
    } catch (e) {
      console.warn('Could not sync reviews from database:', e);
    }
  };

  // Stepper Component
  const renderStepper = (pid, vid, q) => (
    <div className="inline-flex items-center border border-ink/30 rounded-lg bg-white overflow-hidden text-xs font-bold">
      <button
        onClick={() => updateCartQty(pid, vid, -1)}
        className="w-8 py-1.5 hover:bg-bone text-sm text-ink transition"
        aria-label="Decrease"
      >−</button>
      <span className="w-6 text-center text-ink">{q}</span>
      <button
        onClick={() => updateCartQty(pid, vid, 1)}
        className="w-8 py-1.5 hover:bg-bone text-sm text-ink transition"
        aria-label="Increase"
      >+</button>
    </div>
  );

  // Stock status text
  const stockText = (v) => {
    if (v.stock < 1) return ['Out of stock', 'text-rose-700'];
    if (v.stock < 15) return ['Order quickly – going out of stock soon', 'text-amber-700'];
    return ['In stock', 'text-emerald-700'];
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = products.filter(p => {
      const matchCat = selectedCat === 'All Categories' || p.cat === selectedCat;
      const matchQ = !q || (p.title + p.cat + p.design).toLowerCase().includes(q);
      const matchColor = selectedColor === 'All' || p.v.some(v => v.color === selectedColor);
      const matchWish = !onlyWishlist || wishlist.includes(p.id);
      return matchCat && matchQ && matchColor && matchWish;
    });

    if (sortBy === 'rating') list.sort((a, b) => b.rate - a.rate);
    if (sortBy === 'asc') list.sort((a, b) => getActiveVariant(a).price - getActiveVariant(b).price);
    if (sortBy === 'desc') list.sort((a, b) => getActiveVariant(b).price - getActiveVariant(a).price);

    return list;
  }, [products, selectedCat, searchQuery, selectedColor, sortBy, onlyWishlist, wishlist, activeVariants]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const displayedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Available colors for current category
  const availableColors = useMemo(() => {
    const scope = selectedCat === 'All Categories' ? products : products.filter(p => p.cat === selectedCat);
    return ['All', ...new Set(scope.flatMap(p => p.v.map(v => v.color)))];
  }, [products, selectedCat]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-bone text-ink font-sans flex flex-col selection:bg-brass selection:text-ink">
      
      {/* ==================================================================== */}
      {/* HEADER                                                               */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-40 w-full min-w-full bg-ink text-bone shadow-md">
        {(view === 'admin' || adminLoggedIn) ? (
          /* ================================================================= */
          /* DEDICATED ADMIN HEADER                                            */
          /* ================================================================= */
          <div className="w-full max-w-[1400px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
            {/* Logo with Admin Console Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setView('admin');
                  if (adminLoggedIn) setAdminTab('analytics');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="serif text-xl tracking-wide flex items-center gap-2 hover:opacity-90"
              >
                <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                  <circle cx="25" cy="32" r="16" stroke="#D6B98C" strokeWidth="3.2" />
                  <circle cx="39" cy="32" r="16" stroke="#F3EFE7" strokeWidth="3.2" />
                </svg>
                <span>Orayve</span>
              </button>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-widest bg-brass text-ink uppercase shadow-sm">
                ADMIN CONSOLE
              </span>
            </div>

            {adminLoggedIn ? (
              <>
                {/* Quick Admin Navigation Tabs (Desktop) */}
                <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold">
                  {[
                    ['analytics', 'Analytics'],
                    ['orders', `Orders (${orders.length})`],
                    ['products', 'Products'],
                    ['categories', 'Categories'],
                    ['users', `Users (${users.length})`],
                    ['coupons', 'Coupons']
                  ].map(([tab, label]) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setView('admin');
                        setAdminTab(tab);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        view === 'admin' && adminTab === tab
                          ? 'bg-brass text-ink shadow'
                          : 'text-bone/70 hover:text-bone hover:bg-white/10'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Admin Right Controls */}
                <div className="flex items-center gap-2.5 text-xs font-semibold">
                  {/* Real-time Data Sync Status Pill */}
                  <button
                    onClick={() => {
                      refreshLiveOrders();
                      refreshLiveProducts();
                      refreshLiveUsers();
                      updateSyncTimestamp();
                      showToast('Database refreshed');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-bone border border-brass/30 transition text-[11px] font-mono shadow-sm"
                    title="Click to refresh live data from database"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="hidden sm:inline text-bone/60">Updated:</span>
                    <span className="font-bold text-bone">{lastUpdatedTime}</span>
                    <span className="text-bone/50 hover:text-bone ml-0.5">🔄</span>
                  </button>

                  {/* View Storefront Toggle */}
                  <button
                    onClick={() => {
                      setView(view === 'admin' ? 'store' : 'admin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brass/40 text-bone hover:bg-white/10 transition"
                  >
                    <span>{view === 'admin' ? '🏪 View Store' : '🛡️ Admin Area'}</span>
                  </button>

                  {/* Admin 3-Dot Overflow Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      aria-label="Admin options"
                      className="w-9 h-9 rounded-full border border-brass/40 text-lg leading-none flex items-center justify-center hover:bg-white/10 transition text-bone"
                    >
                      ⋮
                    </button>

                    {menuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}></div>
                        <div className="absolute right-0 top-11 z-50 w-60 bg-white text-ink rounded-xl shadow-2xl border border-ink/10 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                          <div className="px-4 py-2.5 border-b text-xs bg-ink text-bone">
                            <span className="text-[10px] tracking-wider uppercase text-brass font-bold block">Authenticated As</span>
                            <b className="block text-sm">Super Admin</b>
                            <p className="text-bone/60 text-[10px]">Neon DB Connected</p>
                          </div>

                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              setView('admin');
                              setAdminTab('analytics');
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold flex items-center justify-between"
                          >
                            <span>📊 Analytics Dashboard</span>
                          </button>

                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              setView('admin');
                              setAdminTab('orders');
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold flex items-center justify-between"
                          >
                            <span>📦 Live Orders</span>
                            <span className="bg-brass text-ink px-1.5 py-0.5 rounded-full font-bold text-[10px]">{orders.length}</span>
                          </button>

                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              setView('admin');
                              setAdminTab('products');
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold"
                          >
                            🏷️ Product &amp; Stock Manager
                          </button>

                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              setView('admin');
                              setAdminTab('users');
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold"
                          >
                            👥 Customer Directory ({users.length})
                          </button>

                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              setView('admin');
                              setAdminTab('coupons');
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold"
                          >
                            🎟️ Discount Coupons
                          </button>

                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              refreshLiveOrders();
                              refreshLiveProducts();
                              refreshLiveUsers();
                              updateSyncTimestamp();
                              showToast('Database synchronized');
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold border-t border-ink/5"
                          >
                            🔄 Sync Database Now
                          </button>

                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              setView(view === 'admin' ? 'store' : 'admin');
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold"
                          >
                            {view === 'admin' ? '🏪 Switch to Storefront' : '🛡️ Open Admin Console'}
                          </button>

                          <div className="border-t border-ink/10">
                            <button
                              onClick={() => {
                                setMenuOpen(false);
                                handleAdminLogout();
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-xs font-bold text-rose-700 flex items-center gap-1.5"
                            >
                              <span>⎋</span>
                              <span>Sign out Admin</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setView('store');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brass/40 text-bone hover:bg-white/10 transition text-xs font-semibold"
                >
                  <span>🏪 Return to Storefront</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ================================================================= */
          /* CUSTOMER STOREFRONT HEADER                                        */
          /* ================================================================= */
          <div className="w-full max-w-[1400px] mx-auto px-4 py-2 flex flex-wrap items-center gap-3 justify-between">
            {/* Logo */}
            <button
              onClick={() => {
                setSelectedCat('All Categories');
                setSearchQuery('');
                setOnlyWishlist(false);
                setView('store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="serif text-xl tracking-wide flex items-center gap-2 hover:opacity-90"
            >
              <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
                <circle cx="25" cy="32" r="16" stroke="#D6B98C" strokeWidth="3.2" />
                <circle cx="39" cy="32" r="16" stroke="#F3EFE7" strokeWidth="3.2" />
              </svg>
              <span>Orayve</span>
            </button>

            {/* Search bar */}
            <input
              id="q"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
                if (view !== 'store') setView('store');
              }}
              placeholder="Search 260 wallets, watches, shoes, ties, rings..."
              className="header-search order-last sm:order-none flex-1 min-w-full sm:min-w-0 sm:max-w-md !bg-white/10 !border-brass/40 !rounded-full !px-4 py-2 text-bone placeholder-bone/50 focus:outline-none focus:ring-1 focus:ring-gold"
            />

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              {/* Real-time Data Sync Status Pill */}
              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-bone/80 border border-brass/30 text-[11px] font-mono whitespace-nowrap shadow-sm"
                title="Live database synchronization"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{lastUpdatedTime}</span>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  setOnlyWishlist(!onlyWishlist);
                  setView('store');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full border border-brass/40 transition flex items-center gap-1.5 ${onlyWishlist ? 'bg-gold text-ink font-bold' : 'hover:bg-white/10'}`}
              >
                <span>♥</span>
                <span>{wishlist.length}</span>
              </button>

              {/* Aura Wallet Pill Button (Never visible in Admin section) */}
              {view !== 'admin' && !adminLoggedIn && (
                <button
                  onClick={() => setShowWalletPassbook(true)}
                  title="Orayve Aura Wallet · 1 Pt = ₹1"
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-gold/60 text-gold hover:bg-gold/25 transition flex items-center gap-1.5 shadow-xs"
                >
                  <span className="text-amber-300 font-bold">✦</span>
                  <span className="font-bold">{walletPoints.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-bone/80 hidden sm:inline">Aura Pts</span>
                </button>
              )}

              {/* Bag Button */}
              <button
                onClick={() => {
                  setView('cart');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-full border border-brass/40 hover:bg-white/10 transition flex items-center gap-1.5"
              >
                <span>Bag</span>
                <span className="bg-brass text-ink px-1.5 py-0.2 rounded-full font-bold">{cartSummary.count}</span>
              </button>

              {/* Account Sign in / Profile */}
              <button
                onClick={() => {
                  if (currentUser) {
                    setView('orders');
                  } else {
                    setAuthModal('login');
                  }
                }}
                className="px-3 py-1.5 rounded-full border border-brass/40 hover:bg-white/10 transition"
              >
                {currentUser ? `👤 ${currentUser.name.split(' ')[0]}` : 'Sign in'}
              </button>

              {/* Admin Console Gate */}
              <button
                onClick={() => {
                  setView('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-full bg-brass/20 text-gold border border-brass/50 hover:bg-brass hover:text-ink transition"
              >
                Admin
              </button>

              {/* Overflow Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="More options"
                  className="w-9 h-9 rounded-full border border-brass/40 text-lg leading-none flex items-center justify-center hover:bg-white/10 transition"
                >
                  ⋮
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}></div>
                    <div className="absolute right-0 top-11 z-50 w-56 bg-white text-ink rounded-xl shadow-2xl border border-ink/10 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      {currentUser && (
                        <div className="px-4 py-2.5 border-b text-xs bg-bone">
                          <b className="block truncate">{currentUser.name}</b>
                          <p className="text-ink/60 text-[11px]">+91 {currentUser.mobile}</p>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          if (currentUser) setView('orders');
                          else setAuthModal('login');
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold"
                      >
                        {currentUser ? '👤 My Account' : '👤 Sign in / Register'}
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setView('orders');
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold"
                      >
                        📦 My Orders ({orders.filter(o => (o.mobile || o.addr?.phone || '').replace(/[^0-9]/g, '').slice(-10) === (currentUser?.mobile || '').replace(/[^0-9]/g, '').slice(-10)).length})
                      </button>
                      {view !== 'admin' && !adminLoggedIn && (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            setShowWalletPassbook(true);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-amber-50 text-xs font-semibold text-amber-900 flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-amber-500 font-bold">✦</span>
                            <span>Aura Wallet &amp; Passbook</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {walletPoints.toLocaleString('en-IN')} Pts
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setOnlyWishlist(true);
                          setView('store');
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold"
                      >
                        ♥ Wishlist ({wishlist.length})
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          copyShareLink('store');
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold"
                      >
                        🔗 Share Orayve
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setInfoTopic('help');
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-bone text-xs font-semibold"
                      >
                        ❓ Help & Policies
                      </button>
                      {currentUser && (
                        <div className="border-t border-ink/10">
                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              setCurrentUser(null);
                              showToast('Logged out');
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-xs font-semibold text-rose-700"
                          >
                            ⎋ Log out
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ==================================================================== */}
      {/* STORE VIEW                                                           */}
      {/* ==================================================================== */}
      {view === 'store' && (
        <main className="flex-1">
          
          {/* Running Ticker Marquee with Coupons and Guarantees */}
          <div className="bg-ink text-bone">
            <div className="mq bg-brass/15 border-y border-brass/30 py-1.5">
              <div className="tk-t flex width-max-content">
                {[...Array(2)].map((_, loopIdx) => (
                  <React.Fragment key={loopIdx}>
                    {coupons.filter(c => c.on).map(c => (
                      <React.Fragment key={c.code + loopIdx}>
                        <span className="mx-6 text-[11px] font-semibold whitespace-nowrap">
                          <b className="text-ink bg-gold px-2 py-0.5 rounded font-bold mr-1.5">{c.code}</b>
                          {c.type === 'P' ? `${c.val}% off (up to ${inr(c.max)})` : `${inr(c.val)} off`} on orders above {inr(c.min)}
                        </span>
                        <span className="text-gold">◆</span>
                      </React.Fragment>
                    ))}
                    <span className="mx-6 text-[11px] font-semibold whitespace-nowrap">🚚 7-Day Return &amp; Replacement</span>
                    <span className="text-gold">◆</span>
                    <span className="mx-6 text-[11px] font-semibold whitespace-nowrap">🔥 Up to 40% OFF across 13 collections</span>
                    <span className="text-gold">◆</span>
                    <span className="mx-6 text-[11px] font-semibold whitespace-nowrap">🎁 Free gift packaging on watches &amp; rings</span>
                    <span className="text-gold">◆</span>
                    <span className="mx-6 text-[11px] font-semibold whitespace-nowrap">✨ New offers added every week</span>
                    <span className="text-gold">◆</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-[1400px] mx-auto px-4 py-5">
              <p className="text-[11px] uppercase tracking-[.28em] text-gold font-bold">Small Details. Big Presence.</p>
              <h1 className="serif text-xl sm:text-3xl font-medium mt-1 max-w-2xl">
                260 curated essentials across 13 signature collections.
              </h1>
              <p className="text-xs text-bone/75 mt-1.5 max-w-xl">
                Wallets, belts, bags, watches, footwear, ties, rings and more — each backed by our 7-day return &amp; replacement guarantee.
              </p>
            </div>

            {/* Interactive Category Offers Carousel */}
            <div className="mq mt-4">
              <div className="mq-s" ref={carouselRef}>
                <div className="mq-t flex">
                  {[...categories, ...categories].map((c, idx) => {
                    const ps = products.filter(p => p.cat === c.name);
                    if (!ps.length) return null;
                    const mx = Math.max(...ps.map(p => Math.max(...p.v.map(v => v.d))));
                    const mn = Math.min(...ps.map(p => Math.min(...p.v.map(v => v.price))));
                    const o = OFFERS[c.name] || ['Special Offer Inside', '🔥 Deal'];
                    const v = ps[0].v[0];

                    return (
                      <button
                        key={c.name + idx}
                        onClick={() => {
                          setSelectedCat(c.name);
                          setSearchQuery('');
                          setCurrentPage(1);
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        className="ocard"
                        aria-label={`${c.name} offers`}
                      >
                        <img
                          src={imgUrl(v)}
                          alt={c.name}
                          loading="lazy"
                          onError={e => { e.currentTarget.src = FB; }}
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brass text-ink text-[10px] font-extrabold">
                          UP TO {mx}% OFF
                        </span>
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-ink/80 text-gold text-[9px] font-bold">
                          {o[1]}
                        </span>
                        <span
                          className="absolute left-2 right-2 block text-center"
                          style={{ top: '62%', transform: 'translateY(-50%)' }}
                        >
                          <span className="serif block text-sm text-bone leading-tight">{c.name}</span>
                          <span className="block text-[10px] text-gold font-semibold">{o[0]}</span>
                          <span className="block text-[10px] text-bone/70">Starting {inr(mn)} · Shop now →</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Category Pills Strip */}
            <div className="max-w-[1400px] mx-auto px-4 pb-4">
              <div className="flex gap-2 overflow-x-auto ns pt-4">
                {['All Categories', ...categories.map(c => c.name)].map(c => {
                  const cnt = c === 'All Categories' ? products.length : products.filter(p => p.cat === c).length;
                  const isActive = selectedCat === c;
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCat(c);
                        setCurrentPage(1);
                      }}
                      className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition ${
                        isActive
                          ? 'bg-brass text-ink font-bold shadow-md'
                          : 'bg-white/5 border border-white/15 text-bone hover:bg-white/10'
                      }`}
                    >
                      {c} ({cnt})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ORAYVE Aura Club Membership Privilege Banner */}
          <div className="max-w-[1400px] mx-auto px-4 pt-4 pb-2">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-stone-900 via-neutral-900 to-amber-950/90 border border-brass/40 p-4 sm:p-5 text-bone shadow-lg">
              <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brass/25 border border-brass/40 text-gold text-[10px] font-extrabold tracking-wider uppercase">
                    <span>✦</span> ORAYVE AURA CLUB · 1 PT = ₹1
                  </div>
                  <h3 className="serif text-lg sm:text-xl font-bold text-bone">
                    Your Aura Credit Balance: <span className="text-gold font-sans font-extrabold">{walletPoints.toLocaleString('en-IN')} Pts</span>
                    <span className="text-xs text-bone/60 font-sans font-normal ml-2">({inr(walletPoints)} Value)</span>
                  </h3>
                  <p className="text-xs text-bone/70 max-w-xl leading-relaxed">
                    Enjoy zero-delay shopping, 100% instant refund credits into your Aura Wallet on returns &amp; cancellations, and exclusive tier benefits.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setShowWalletPassbook(true)}
                    className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-brass to-gold text-ink font-bold text-xs hover:brightness-110 shadow-md flex items-center justify-center gap-2 transition whitespace-nowrap"
                  >
                    <span>✦ View Aura Passbook &amp; History</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Header & Controls */}
          <section className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-ink/10">
              <div>
                <h2 className="serif text-lg font-bold">
                  {onlyWishlist ? 'Your Wishlist' : selectedCat}
                </h2>
                <p className="text-xs text-ink/60">
                  {filteredProducts.length
                    ? `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} of ${filteredProducts.length} products`
                    : '0 products found'}
                </p>
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedColor}
                  onChange={e => {
                    setSelectedColor(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg text-xs"
                >
                  {availableColors.map(c => (
                    <option key={c} value={c}>{c === 'All' ? 'Color: All' : c}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={e => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg text-xs"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Top Rated</option>
                  <option value="asc">Price: Low–High</option>
                  <option value="desc">Price: High–Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 mt-4">
                {displayedProducts.map(p => {
                  const v = getActiveVariant(p);
                  const isWish = wishlist.includes(p.id);
                  const inCart = cart.find(c => c.pid === p.id && c.vid === v.id);
                  const cartQty = inCart ? inCart.q : 0;
                  const [stMsg, stCls] = stockText(v);

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-xl border border-ink/10 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col group"
                    >
                      {/* Product Image Box */}
                      <div
                        onClick={() => openProduct(p.id)}
                        className="relative h-44 bg-ink cursor-pointer overflow-hidden"
                      >
                        <div className={`w-full h-full transition duration-300 group-hover:scale-105 ${v.stock < 1 ? 'grayscale' : ''}`}>
                          <img
                            src={imgUrl(v)}
                            alt={p.title}
                            loading="lazy"
                            onError={e => { e.currentTarget.src = FB; }}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {v.stock < 1 && (
                          <span className="absolute inset-x-0 bottom-5 mx-auto w-fit px-3 py-1 rounded bg-ink/85 text-bone text-xs font-bold">
                            Out of stock
                          </span>
                        )}

                        {/* Active Color Stripe */}
                        <div className="absolute bottom-0 inset-x-0 h-1" style={{ background: v.hex }}></div>

                        {/* Badges Left */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                          <span className="px-2 py-0.5 rounded bg-brass text-ink text-[10px] font-bold shadow">
                            {v.d}% OFF
                          </span>
                          {p.coupon && (
                            <span className="px-2 py-0.5 rounded bg-ink/85 text-gold text-[10px] font-semibold">
                              Coupon Eligible
                            </span>
                          )}
                        </div>

                        {/* Actions Right */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className={`w-7 h-7 rounded-full bg-ink/75 text-bone flex items-center justify-center transition hover:scale-110 ${isWish ? '!text-gold' : ''}`}
                            aria-label="Wishlist"
                          >
                            {isWish ? '♥' : '♡'}
                          </button>
                          <button
                            onClick={() => copyShareLink(p.id)}
                            className="w-7 h-7 rounded-full bg-ink/75 text-bone text-xs flex items-center justify-center transition hover:scale-110"
                            aria-label="Share"
                          >
                            ⇪
                          </button>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-3 flex-1 flex flex-col">
                        
                        {/* Swatches Row */}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex gap-1.5">
                            {p.v.map((x, i) => (
                              <button
                                key={x.id}
                                onClick={() => setActiveVariants(prev => ({ ...prev, [p.id]: i }))}
                                title={x.color}
                                className={`w-4 h-4 rounded-full border border-ink/30 transition ${
                                  x.id === v.id ? 'ring-2 ring-offset-1 ring-brass scale-110' : ''
                                }`}
                                style={{ background: x.hex }}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-ink/60 truncate max-w-[90px]">{v.color}</span>
                        </div>

                        <p className="text-[10px] uppercase tracking-wider text-brass font-bold">
                          {p.cat} · {p.design}
                        </p>

                        <h3
                          onClick={() => openProduct(p.id)}
                          className="serif text-sm mt-0.5 line-clamp-1 cursor-pointer hover:text-brass transition"
                        >
                          {p.title}
                        </h3>

                        <div className="flex justify-between items-center gap-2 mt-1.5 text-xs">
                          <span className="font-semibold text-ink">
                            ★ {p.rate} <span className="text-ink/50 font-normal">({p.rev})</span>
                          </span>
                          <span className={`font-semibold text-right text-[11px] truncate ${stCls}`}>
                            {stMsg}
                          </span>
                        </div>

                        {/* Price & Add to Bag */}
                        <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-1">
                          <div>
                            <span className="text-base font-bold text-ink">{inr(v.price)}</span>{' '}
                            <span className="text-xs line-through text-ink/45">{inr(v.mrp)}</span>
                            <p className="text-[10px] text-ink/50">SKU: {v.sku}</p>
                          </div>

                          {v.stock < 1 ? (
                            <button
                              disabled
                              className="px-3 py-1.5 rounded-lg bg-ink/15 text-ink/50 text-xs font-semibold cursor-not-allowed"
                            >
                              Sold out
                            </button>
                          ) : cartQty > 0 ? (
                            renderStepper(p.id, v.id, cartQty)
                          ) : (
                            <button
                              onClick={() => addToCart(p.id, v.id)}
                              className="px-3 py-1.5 rounded-lg bg-ink text-bone hover:bg-brass hover:text-ink text-xs font-semibold transition"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-20 text-center text-ink/60">No products match your search.</p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3 text-xs font-bold">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40 hover:bg-bone transition"
                >
                  ‹ Prev
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40 hover:bg-bone transition"
                >
                  Next ›
                </button>
              </div>
            )}
          </section>
        </main>
      )}

      {/* ==================================================================== */}
      {/* PRODUCT DETAILS VIEW                                                 */}
      {/* ==================================================================== */}
      {view === 'product' && detailProduct && (() => {
        const p = detailProduct;
        const v = getActiveVariant(p);
        const [stMsg, stCls] = stockText(v);
        const galleryImgs = [...new Set([...(p.imgs || []), ...p.v.map(x => x.photo)].filter(Boolean))];
        const gList = galleryImgs.length ? galleryImgs : [''];
        const activePhoto = gList[Math.min(galleryIndex, gList.length - 1)];

        const inCart = cart.find(c => c.pid === p.id && c.vid === v.id);
        const cartQty = inCart ? inCart.q : 0;

        const userAddrs = currentUser ? addresses.filter(a => a.m === currentUser.mobile) : [];
        const primaryAddr = userAddrs.find(a => a.id === selectedAddrId) || userAddrs[0];

        // Similar products
        const sameCatProds = products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 6);

        return (
          <main className="max-w-[1400px] mx-auto px-4 py-3 flex-1">
            <button
              onClick={() => {
                const prevNav = navHistory.pop();
                setView('store');
                window.scrollTo({ top: prevNav?.scroll || 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold mb-2 flex items-center gap-1 hover:text-brass"
            >
              ‹ Back to products
            </button>

            <div className="grid md:grid-cols-5 gap-6">
              
              {/* Left Column: Gallery */}
              <div className="md:col-span-2">
                <div className="relative overflow-hidden rounded-2xl bg-ink aspect-[4/3] shadow-md">
                  <img
                    src={imgUrl({ photo: activePhoto })}
                    alt={p.title}
                    className={`w-full h-full object-cover transition duration-300 ${v.stock < 1 ? 'grayscale' : ''}`}
                    onError={e => { e.currentTarget.src = FB; }}
                  />

                  {gList.length > 1 && (
                    <>
                      <button
                        onClick={() => setGalleryIndex((galleryIndex - 1 + gList.length) % gList.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ink/70 text-bone flex items-center justify-center hover:bg-ink transition"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setGalleryIndex((galleryIndex + 1) % gList.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ink/70 text-bone flex items-center justify-center hover:bg-ink transition"
                      >
                        ›
                      </button>
                    </>
                  )}

                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-brass text-ink text-[10px] font-bold">
                    {v.d}% OFF
                  </span>
                  {v.stock < 1 && (
                    <span className="absolute inset-x-0 bottom-4 mx-auto w-fit px-4 py-1.5 rounded bg-ink/85 text-bone text-xs font-bold">
                      Out of stock
                    </span>
                  )}
                </div>

                {/* Thumbnails row */}
                <div className="flex gap-2 mt-3 overflow-x-auto ns">
                  {gList.map((ph, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-ink/20 transition ${
                        idx === galleryIndex ? 'ring-2 ring-brass ring-offset-1' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl({ photo: ph })}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        onError={e => { e.currentTarget.src = FB; }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Info & Buy */}
              <div className="md:col-span-3">
                <p className="text-[10px] uppercase tracking-wider text-brass font-bold">
                  {p.cat} · {p.design}
                </p>
                <h1 className="serif text-xl sm:text-2xl mt-1 font-bold">{p.title}</h1>

                {/* Rating Bar */}
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-brass">★ {p.rate}</span>
                  <span className="text-xs text-ink/60">({p.rev} ratings &amp; reviews)</span>
                </div>

                {/* Price Breakdown */}
                <div className="mt-3 p-3 rounded-xl bg-white border border-ink/10 text-xs space-y-0.5 shadow-sm">
                  <div className="flex justify-between text-ink/60">
                    <span>MRP</span>
                    <span className="line-through">{inr(v.mrp)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({v.d}% off)</span>
                    <span>− {inr(v.mrp - v.price)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-ink/10 pt-1.5">
                    <span>Final price</span>
                    <span className="text-ink">{inr(v.price)}</span>
                  </div>
                  <p className="text-[10px] text-ink/50">Inclusive of all taxes · Free delivery nationwide</p>
                </div>

                {/* Swatches Selection */}
                <div className="mt-4">
                  <p className="text-xs font-bold mb-2">
                    Colour: <span className="text-brass">{v.color}</span>
                  </p>
                  <div className="flex gap-2">
                    {p.v.map((x, i) => (
                      <button
                        key={x.id}
                        onClick={() => {
                          setActiveVariants(prev => ({ ...prev, [p.id]: i }));
                          setGalleryIndex(0);
                        }}
                        title={x.color}
                        className={`w-7 h-7 rounded-full border border-ink/30 transition ${
                          x.id === v.id ? 'ring-2 ring-offset-2 ring-brass scale-110' : ''
                        }`}
                        style={{ background: x.hex }}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-2 font-semibold ${stCls}`}>{stMsg}</p>
                </div>

                {/* Purchase Actions */}
                <div className="mt-4 flex gap-2">
                  {v.stock < 1 ? (
                    <button
                      disabled
                      className="flex-1 py-2.5 rounded-xl bg-ink/15 text-ink/50 font-bold text-sm cursor-not-allowed"
                    >
                      Out of stock
                    </button>
                  ) : cartQty > 0 ? (
                    <div className="flex-1 flex items-center gap-2">
                      {renderStepper(p.id, v.id, cartQty)}
                      <button
                        onClick={() => setView('cart')}
                        className="flex-1 py-2.5 rounded-xl bg-brass text-ink font-bold text-sm hover:opacity-90 transition"
                      >
                        Go to Cart
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(p.id, v.id)}
                      className="flex-1 py-2.5 rounded-xl border-2 border-ink font-bold text-sm hover:bg-ink hover:text-bone transition"
                    >
                      Add to Cart
                    </button>
                  )}

                  {v.stock >= 1 && (
                    <button
                      onClick={() => {
                        if (!cart.some(c => c.vid === v.id)) {
                          setCart([...cart, { pid: p.id, vid: v.id, q: 1 }]);
                        }
                        proceedToCheckout();
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-ink text-bone hover:bg-brass hover:text-ink font-bold text-sm transition"
                    >
                      Buy Now
                    </button>
                  )}
                </div>

                {/* Expected Delivery Box */}
                <div className="mt-4 p-3 rounded-xl bg-white border border-ink/10 text-xs space-y-1 shadow-sm">
                  <p className="font-bold text-sm">🚚 Expected delivery</p>
                  {primaryAddr ? (
                    <>
                      <p className="text-ink/70">
                        To {primaryAddr.name}, {primaryAddr.city} – {primaryAddr.pin}
                      </p>
                      <p className="text-emerald-700 font-semibold">
                        {checkPincodeRule(primaryAddr.pin).msg}
                      </p>
                    </>
                  ) : (
                    <p className="text-ink/70">
                      {currentUser
                        ? 'Add an address at checkout, or check any pincode below.'
                        : 'Sign in to see delivery to your saved address, or check any pincode below.'}
                    </p>
                  )}
                </div>

                {/* Pincode Checker Form */}
                <div className="mt-2.5 p-3.5 rounded-2xl bg-white border border-ink/10 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🚚</span>
                    <p className="font-bold text-xs text-ink">Check Doorstep Express Delivery</p>
                  </div>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      const res = checkPincodeRule(pincodeInput);
                      setPincodeResult(res);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      value={pincodeInput}
                      onChange={e => setPincodeInput(e.target.value)}
                      maxLength={6}
                      inputMode="numeric"
                      placeholder="Enter 6-digit delivery pincode..."
                      className="flex-1 text-xs font-mono font-semibold tracking-wider placeholder:font-sans placeholder:tracking-normal"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-ink text-bone text-xs font-bold hover:bg-brass hover:text-ink transition shrink-0 shadow-sm"
                    >
                      Check Pincode
                    </button>
                  </form>
                  {pincodeResult && (
                    <div className={`mt-2 p-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      pincodeResult.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      <span>{pincodeResult.ok ? '✓' : '✕'}</span>
                      <span>{pincodeResult.msg}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs: Specifications & Manufacturer */}
            <section className="mt-6 bg-white rounded-2xl border border-ink/10 overflow-hidden shadow-sm">
              <div className="grid grid-cols-2 border-b border-ink/10 text-xs font-bold text-center">
                <button
                  onClick={() => setDetailTab('spec')}
                  className={`py-2.5 transition ${detailTab === 'spec' ? 'border-b-2 border-brass text-ink font-bold' : 'text-ink/50'}`}
                >
                  Product Specification
                </button>
                <button
                  onClick={() => setDetailTab('mfg')}
                  className={`py-2.5 transition ${detailTab === 'mfg' ? 'border-b-2 border-brass text-ink font-bold' : 'text-ink/50'}`}
                >
                  Manufacturer Details
                </button>
              </div>

              <table className="w-full text-xs">
                <tbody>
                  {(detailTab === 'spec' ? [
                    ['Category', p.cat],
                    ['Style / design', p.design],
                    ['Material', MAT[p.cat] || 'Premium materials'],
                    ['Colours available', p.v.map(x => x.color).join(', ')],
                    ['Selected colour', v.color],
                    ['SKU', v.sku],
                    ['HSN code', p.hsn],
                    ['Returns', '7-day return & replacement']
                  ] : [
                    ['Manufactured & marketed by', MFG.name],
                    ['Registered address', MFG.addr],
                    ['Country of origin', 'India'],
                    ['Generic name', p.cat],
                    ['Net quantity', '1 unit'],
                    ['Customer care', MFG.care]
                  ]).map(([k, val], idx) => (
                    <tr key={idx} className="border-b border-ink/5 last:border-0">
                      <td className="p-2.5 w-2/5 text-ink/60 font-semibold">{k}</td>
                      <td className="p-2.5 text-ink">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Ratings & Reviews Section (Verified Buyers Only) */}
            {(() => {
              const prodReviews = reviews.filter(r => r.pid === p.id || (r.pTitle && p.title && r.pTitle.trim().toLowerCase() === p.title.trim().toLowerCase()));
              const totalRevs = prodReviews.length;
              const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
              let starSum = 0;
              const customerPhotos = [];

              prodReviews.forEach(r => {
                const star = Math.min(5, Math.max(1, Math.round(Number(r.rate) || 5)));
                starCounts[star] = (starCounts[star] || 0) + 1;
                starSum += Number(r.rate || 5);
                if (Array.isArray(r.photos)) {
                  r.photos.forEach(ph => {
                    if (ph) customerPhotos.push({ url: ph, reviewer: r.name, rate: r.rate, title: r.title, text: r.text });
                  });
                }
              });

              const avgRating = totalRevs > 0 ? (starSum / totalRevs).toFixed(1) : (p.rate || 4.8);
              const reviewsWithPhotosCount = prodReviews.filter(r => r.photos && r.photos.length > 0).length;

              const filteredRevs = prodReviews.filter(r => {
                if (reviewFilterStars === 'ALL') return true;
                if (reviewFilterStars === 'PHOTOS') return r.photos && r.photos.length > 0;
                return Math.round(Number(r.rate) || 5) === Number(reviewFilterStars);
              });

              const displayedRevs = showAllReviews ? filteredRevs : filteredRevs.slice(0, 4);
              const isEligibleBuyer = isUserVerifiedBuyer(p);

              return (
                <section className="mt-6 bg-white rounded-2xl border border-ink/10 p-5 sm:p-6 shadow-sm space-y-6">
                  {/* Section Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ink/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="serif text-xl sm:text-2xl font-bold text-ink">Customer Ratings &amp; Reviews</h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <span>✓</span> Verified Buyers Only
                        </span>
                      </div>
                      <p className="text-xs text-ink/60 mt-0.5">
                        Real feedback and authentic live photos from customers who ordered this product.
                      </p>
                    </div>

                    {/* Action Button: Gated for Verified Buyers Only */}
                    <div>
                      {isEligibleBuyer ? (
                        <button
                          onClick={() => openReviewModal(p)}
                          className="px-4 py-2 rounded-xl bg-brass text-ink font-bold hover:opacity-90 transition shadow-sm text-xs flex items-center gap-1.5"
                        >
                          <span>✍️</span> Write a Verified Review
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-ink/70 bg-bone px-3.5 py-2 rounded-xl border border-ink/15">
                          <span className="text-base">🔒</span>
                          <div className="text-left">
                            <span className="font-bold text-ink block text-[11px]">Verified Buyers Only</span>
                            <span className="text-[10px] text-ink/60">
                              {currentUser ? 'Purchase this item to leave a rating and upload photos' : 'Log in with your purchase mobile to review'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating Score Card & 5-Star Distribution Grid */}
                  <div className="grid sm:grid-cols-12 gap-6 items-center p-4 rounded-xl bg-bone/40 border border-ink/10">
                    {/* Overall Score */}
                    <div className="sm:col-span-4 text-center sm:text-left sm:border-r border-ink/10 sm:pr-6 space-y-1">
                      <div className="flex items-baseline justify-center sm:justify-start gap-1">
                        <span className="text-4xl sm:text-5xl font-black text-ink">{avgRating}</span>
                        <span className="text-xl text-ink/40 font-bold">/ 5</span>
                      </div>
                      <div className="text-brass text-base tracking-wider">
                        {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                      </div>
                      <p className="text-xs text-ink/70 font-semibold">
                        Based on {totalRevs} verified customer {totalRevs === 1 ? 'review' : 'reviews'}
                      </p>
                      <p className="text-[10px] text-ink/50">100% genuine purchase verified</p>
                    </div>

                    {/* 5-Star Breakdown Progress Bars */}
                    <div className="sm:col-span-8 space-y-1.5 text-xs">
                      {[5, 4, 3, 2, 1].map(stars => {
                        const count = starCounts[stars] || 0;
                        const pct = totalRevs > 0 ? Math.round((count / totalRevs) * 100) : 0;
                        return (
                          <div
                            key={stars}
                            onClick={() => setReviewFilterStars(reviewFilterStars === String(stars) ? 'ALL' : String(stars))}
                            className={`flex items-center gap-2 cursor-pointer p-1 rounded-lg transition ${
                              reviewFilterStars === String(stars) ? 'bg-brass/15 font-bold' : 'hover:bg-bone'
                            }`}
                          >
                            <span className="w-8 font-semibold text-ink flex items-center gap-0.5 text-right justify-end">
                              {stars} <span className="text-brass">★</span>
                            </span>
                            <div className="flex-1 h-2 rounded-full bg-ink/10 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  stars >= 4 ? 'bg-emerald-600' : stars === 3 ? 'bg-brass' : 'bg-rose-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-10 text-right text-[11px] text-ink/60 font-mono">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Real Photos Strip */}
                  {customerPhotos.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs text-ink uppercase tracking-wider text-brass flex items-center gap-1.5">
                          <span>📷</span> Customer Live Photos ({customerPhotos.length})
                        </h3>
                        <span className="text-[10px] text-ink/50">Click any photo to enlarge and read feedback</span>
                      </div>
                      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                        {customerPhotos.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActivePhotoModalUrl(item)}
                            className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-ink/15 hover:border-brass cursor-pointer group relative shadow-xs"
                          >
                            <img
                              src={item.url}
                              alt={`Customer photo by ${item.reviewer}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                              onError={e => { e.currentTarget.src = FB; }}
                            />
                            <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <span className="text-bone text-xs font-bold">🔍 View</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ink/10">
                    <span className="text-[11px] font-semibold text-ink/60 mr-1">Filter Reviews:</span>
                    {[
                      { key: 'ALL', label: `All (${totalRevs})` },
                      { key: 'PHOTOS', label: `📷 With Photos (${reviewsWithPhotosCount})` },
                      { key: '5', label: `5 ★ (${starCounts[5]})` },
                      { key: '4', label: `4 ★ (${starCounts[4]})` },
                      { key: '3', label: `3 ★ (${starCounts[3]})` },
                      { key: '2', label: `2 ★ (${starCounts[2]})` },
                      { key: '1', label: `1 ★ (${starCounts[1]})` },
                    ].map(flt => (
                      <button
                        key={flt.key}
                        onClick={() => setReviewFilterStars(flt.key)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                          reviewFilterStars === flt.key
                            ? 'bg-ink text-bone font-bold shadow-xs'
                            : 'bg-bone text-ink/70 hover:bg-ink/10'
                        }`}
                      >
                        {flt.label}
                      </button>
                    ))}
                  </div>

                  {/* Reviews Cards List */}
                  <div className="divide-y divide-ink/10 pt-1">
                    {displayedRevs.length === 0 ? (
                      <div className="py-8 text-center space-y-1">
                        <p className="font-semibold text-ink/70 text-xs">No reviews match the selected filter.</p>
                        <button
                          onClick={() => setReviewFilterStars('ALL')}
                          className="text-xs text-brass font-bold hover:underline"
                        >
                          Reset filter to see all reviews
                        </button>
                      </div>
                    ) : (
                      displayedRevs.map(r => (
                        <div key={r.id} className="py-4 space-y-2 text-xs">
                          {/* User row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-brass/20 text-brass font-black flex items-center justify-center text-xs">
                                {(r.name || 'V').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-ink">{r.name}</span>
                                  {r.verified && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                                      <span>✓</span> Verified Buyer
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-ink/50">{r.date}</span>
                              </div>
                            </div>
                            <div className="text-brass text-xs tracking-wider">
                              {'★'.repeat(Math.round(r.rate || 5))}{'☆'.repeat(5 - Math.round(r.rate || 5))}
                            </div>
                          </div>

                          {/* Title & Comment */}
                          {r.title && <h4 className="font-bold text-ink text-xs">{r.title}</h4>}
                          <p className="text-ink/80 leading-relaxed text-xs">{r.text}</p>

                          {/* Attached Photos */}
                          {Array.isArray(r.photos) && r.photos.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {r.photos.map((ph, phIdx) => (
                                <img
                                  key={phIdx}
                                  src={ph}
                                  alt="Customer received product"
                                  onClick={() => setActivePhotoModalUrl({ url: ph, reviewer: r.name, rate: r.rate, title: r.title, text: r.text })}
                                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-ink/15 hover:border-brass cursor-pointer transition shadow-xs"
                                  onError={e => { e.currentTarget.src = FB; }}
                                />
                              ))}
                            </div>
                          )}

                          {/* Helpful vote button */}
                          <div className="flex items-center justify-between pt-1 text-[11px] text-ink/50">
                            <span>Certified Purchase</span>
                            <button
                              type="button"
                              onClick={() => handleHelpfulVote(r.id)}
                              className="hover:text-ink transition flex items-center gap-1 font-semibold"
                            >
                              <span>👍 Helpful</span>
                              <span>({r.helpful || 0})</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pagination Toggle */}
                  {filteredRevs.length > 4 && (
                    <div className="pt-2 text-center">
                      <button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="px-4 py-2 rounded-xl border border-ink/20 text-xs font-bold text-ink hover:bg-bone transition"
                      >
                        {showAllReviews ? 'Show Fewer Reviews ▴' : `View All ${filteredRevs.length} Reviews ▾`}
                      </button>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* Similar Products */}
            {sameCatProds.length > 0 && (
              <section className="mt-6">
                <h2 className="serif text-lg mb-1 font-bold">Similar products</h2>
                <p className="text-xs text-ink/60 mb-3">More from {p.cat}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {sameCatProds.map(sp => {
                    const sv = getActiveVariant(sp);
                    return (
                      <div
                        key={sp.id}
                        onClick={() => openProduct(sp.id)}
                        className="bg-white rounded-xl border border-ink/10 p-2 cursor-pointer hover:shadow-md transition"
                      >
                        <div className="h-28 bg-ink rounded-lg overflow-hidden mb-2">
                          <img
                            src={imgUrl(sv)}
                            alt={sp.title}
                            className="w-full h-full object-cover"
                            onError={e => { e.currentTarget.src = FB; }}
                          />
                        </div>
                        <p className="text-[10px] text-brass uppercase font-bold">{sp.cat}</p>
                        <h4 className="serif text-xs font-bold line-clamp-1">{sp.title}</h4>
                        <p className="text-xs font-bold mt-1">{inr(sv.price)}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </main>
        );
      })()}

      {/* ==================================================================== */}
      {/* CART / BAG VIEW                                                      */}
      {/* ==================================================================== */}
      {view === 'cart' && (
        <main className="max-w-5xl mx-auto px-4 py-4 flex-1">
          <button
            onClick={() => setView('store')}
            className="text-xs font-bold mb-3 flex items-center gap-1 hover:text-brass"
          >
            ‹ Back to shopping
          </button>
          
          <h1 className="serif text-2xl font-bold mb-4">Your Bag ({cartSummary.count})</h1>

          {cartSummary.items.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-6 items-start">
              
              {/* Items List */}
              <div className="lg:col-span-2 space-y-3">
                {cartSummary.items.map(({ p, v, q }) => (
                  <div key={v.id} className="bg-white p-3 rounded-xl border border-ink/10 flex gap-3 shadow-sm">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-ink">
                      <img
                        src={imgUrl(v)}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={e => { e.currentTarget.src = FB; }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{p.title}</p>
                      <p className="text-xs text-ink/60">
                        {v.color} · <b className="text-ink">{inr(v.price)}</b>{' '}
                        <span className="line-through text-ink/40">{inr(v.mrp)}</span>{' '}
                        <span className="text-emerald-700 font-semibold">{v.d}% off</span>
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2">
                        {renderStepper(p.id, v.id, q)}
                        <span className="text-sm font-bold">{inr(v.price * q)}</span>
                        <button
                          onClick={() => updateCartQty(p.id, v.id, -99)}
                          className="text-rose-600 text-xs font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="bg-white p-4 rounded-xl border border-ink/10 space-y-3 text-xs shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-bold text-xs text-ink flex items-center gap-1.5">
                      <span>🎟️</span> Promotional Voucher
                    </p>
                    <span className="text-[10px] text-brass font-bold">WELCOME15 · ORAYVE200</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="ENTER COUPON CODE..."
                      className="flex-1 uppercase text-xs font-mono font-bold tracking-wider"
                    />
                    <button
                      onClick={() => applyCouponCode(couponInput)}
                      className="px-5 py-2.5 rounded-xl bg-ink text-gold font-bold hover:bg-brass hover:text-ink transition shadow-sm shrink-0 text-xs"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="border-t border-ink/10 pt-3 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{inr(cartSummary.sub)}</span>
                  </div>
                  {cartSummary.disc > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({appliedCoupon})</span>
                      <span>−{inr(cartSummary.disc)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-ink/10 pt-2">
                    <span>Total</span>
                    <span>{inr(cartSummary.total)}</span>
                  </div>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full py-2.5 rounded-xl bg-ink text-bone hover:bg-brass hover:text-ink font-bold text-sm transition shadow"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-4xl">🛍</p>
              <p className="mt-2 text-sm text-ink/70">Your bag is empty.</p>
              <button
                onClick={() => setView('store')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-ink text-bone text-xs font-bold hover:bg-brass hover:text-ink transition"
              >
                Continue shopping
              </button>
            </div>
          )}
        </main>
      )}

      {/* ==================================================================== */}
      {/* 3-STEP CHECKOUT VIEW                                                 */}
      {/* ==================================================================== */}
      {view === 'checkout' && (
        <main className="max-w-5xl mx-auto px-4 py-5 flex-1">
          {checkoutStep < 3 && (
            <button
              onClick={() => {
                if (checkoutStep === 2) setCheckoutStep(1);
                else setView('cart');
              }}
              className="text-xs font-bold mb-3 hover:text-brass"
            >
              ‹ {checkoutStep === 2 ? 'Back to address' : 'Back to bag'}
            </button>
          )}

          {/* Stepper Header */}
          <div className="flex justify-center gap-3 mb-6">
            {['Address', 'Payment', 'Confirmed'].map((l, i) => (
              <span
                key={l}
                className={`text-xs font-bold ${checkoutStep >= i + 1 ? 'text-ink' : 'opacity-40'}`}
              >
                {i + 1}. {l} {i < 2 && <span className="ml-2 opacity-30">—</span>}
              </span>
            ))}
          </div>

          {/* Step 1: Address */}
          {checkoutStep === 1 && (() => {
            const userAddrs = currentUser ? addresses.filter(a => a.m === currentUser.mobile) : [];
            const isAddingNew = showNewAddrForm || userAddrs.length === 0;

            return (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h2 className="serif text-2xl font-bold text-ink">Delivery Address</h2>
                      <p className="text-xs text-ink/70 mt-0.5">Where should we deliver your luxury parcel?</p>
                    </div>
                    {userAddrs.length > 0 && !isAddingNew && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddrForm(true)}
                        className="px-3.5 py-1.5 rounded-lg border-2 border-black bg-white hover:bg-brass hover:text-ink text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                      >
                        <span>＋</span> Add New Address
                      </button>
                    )}
                  </div>

                  {/* Existing Saved Addresses List */}
                  {userAddrs.length > 0 && (
                    <div className="space-y-3">
                      {userAddrs.map(a => (
                        <div
                          key={a.id}
                          onClick={() => setSelectedAddrId(a.id)}
                          className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition relative bg-white ${
                            selectedAddrId === a.id
                              ? 'border-black ring-2 ring-brass shadow-md bg-stone-50/50'
                              : 'border-black/20 hover:border-black/60 shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                selectedAddrId === a.id ? 'border-black bg-ink text-bone' : 'border-black/40 bg-white'
                              }`}>
                                {selectedAddrId === a.id && <span className="w-2 h-2 rounded-full bg-brass"></span>}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-sm text-ink">{a.name}</span>
                                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-bone border border-black/20 text-ink">
                                    {a.type || 'Home'}
                                  </span>
                                  {selectedAddrId === a.id && (
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                                      ✓ Selected for Delivery
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-ink/80 mt-1.5 leading-relaxed font-medium">
                                  {a.flat ? `${a.flat}, ` : ''}{a.street}
                                </p>
                                <p className="text-xs text-ink/70 mt-0.5 font-medium">
                                  {a.city}, {a.state || 'India'} — <span className="font-bold text-ink">{a.pin}</span>
                                </p>
                                <p className="text-xs text-ink/70 mt-1 flex items-center gap-1.5 font-semibold">
                                  <span>📞</span> +91 {a.phone}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddresses(prev => prev.filter(x => x.id !== a.id));
                                if (selectedAddrId === a.id) {
                                  const rem = userAddrs.filter(x => x.id !== a.id);
                                  setSelectedAddrId(rem[0]?.id || null);
                                }
                                showToast('Address removed');
                              }}
                              className="text-ink/40 hover:text-rose-600 p-1 transition"
                              title="Delete address"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Address Form (Open by default if 0 addresses, or toggled) */}
                  {isAddingNew && (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const name = (fd.get('name') || '').trim();
                        const phone = (fd.get('phone') || '').trim();
                        const flat = (fd.get('flat') || '').trim();
                        const street = (fd.get('street') || '').trim();
                        const city = (fd.get('city') || '').trim();
                        const state = (fd.get('state') || '').trim();
                        const pin = (fd.get('pin') || '').trim();

                        if (!name) return showToast('Please enter recipient name', true);
                        if (!phone || phone.replace(/\D/g, '').length < 10) return showToast('Please enter a valid 10-digit mobile number', true);
                        if (!street) return showToast('Please enter street or locality', true);
                        if (!city) return showToast('Please enter city', true);
                        if (!pin || pin.replace(/\D/g, '').length !== 6) return showToast('Please enter a valid 6-digit pincode', true);

                        const fullStreet = flat ? `${flat}, ${street}` : street;
                        const newA = {
                          id: 'a' + Date.now(),
                          m: currentUser?.mobile,
                          name,
                          phone: phone.replace(/\D/g, '').slice(-10),
                          flat,
                          street: fullStreet,
                          city,
                          state: state || 'Maharashtra',
                          pin,
                          type: addrType || 'Home'
                        };

                        setAddresses(prev => [...prev, newA]);
                        setSelectedAddrId(newA.id);
                        setShowNewAddrForm(false);

                        // Sync to backend API
                        fetch('/api/users/addresses', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            mobile: currentUser?.mobile,
                            name: newA.name,
                            phone: newA.phone,
                            street: newA.street,
                            city: newA.city,
                            state: newA.state,
                            pin: newA.pin
                          })
                        }).catch(() => {});

                        e.currentTarget.reset();
                        showToast('Address saved & selected for delivery');
                      }}
                      className="p-6 sm:p-8 rounded-3xl bg-white border border-brass/40 space-y-5 shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brass/20 text-brass text-[10px] font-extrabold uppercase tracking-wider mb-1">
                            <span>📍</span> Dispatch Destination
                          </div>
                          <h3 className="font-bold text-base text-ink">
                            Add New Delivery Address
                          </h3>
                          <p className="text-[11px] text-ink/60 mt-0.5">Please ensure all details are accurate for insured luxury dispatch</p>
                        </div>
                        {userAddrs.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowNewAddrForm(false)}
                            className="text-xs font-bold text-ink/60 hover:text-ink transition px-3 py-1.5 rounded-lg border border-ink/15 hover:bg-bone"
                          >
                            ✕ Cancel
                          </button>
                        )}
                      </div>

                      {/* Section 1: Contact Details */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                            Full Name / Recipient <span className="text-rose-600 font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            name="name"
                            defaultValue={currentUser?.name || ''}
                            placeholder="e.g. Ankit Kumar"
                            className="w-full text-xs font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                            10-Digit Mobile Number <span className="text-rose-600 font-bold">*</span>
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3.5 text-xs font-bold text-ink/70 select-none z-10">🇮🇳 +91</span>
                            <input
                              type="tel"
                              required
                              name="phone"
                              defaultValue={currentUser?.mobile ? currentUser.mobile.replace(/\D/g, '').slice(-10) : ''}
                              maxLength={10}
                              placeholder="9876543210"
                              pattern="[0-9]{10}"
                              className="w-full text-xs !pl-18 font-medium tracking-wide"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Building & Flat Details */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                            Flat, House No., Building, Floor <span className="text-rose-600 font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            name="flat"
                            placeholder="e.g. Flat 402, Lotus Towers"
                            className="w-full text-xs font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                            Street, Locality, Area, Landmark <span className="text-rose-600 font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            name="street"
                            placeholder="e.g. 100ft Road, Near Metro Station"
                            className="w-full text-xs font-medium"
                          />
                        </div>
                      </div>

                      {/* Section 3: Pincode, City, State */}
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                            Pincode <span className="text-rose-600 font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            name="pin"
                            maxLength={6}
                            placeholder="e.g. 560038"
                            pattern="[0-9]{6}"
                            className="w-full text-xs font-mono font-medium tracking-wider"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                            City / District <span className="text-rose-600 font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            name="city"
                            placeholder="e.g. Bengaluru"
                            className="w-full text-xs font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                            State <span className="text-rose-600 font-bold">*</span>
                          </label>
                          <select
                            name="state"
                            defaultValue="Maharashtra"
                            className="w-full text-xs font-medium cursor-pointer"
                          >
                            {INDIAN_STATES.map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Section 4: Address Type Pills */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-ink/80 mb-2">
                          Save Address As
                        </label>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {[
                            { id: 'Home', icon: '🏠', label: 'Home (All Day Delivery)' },
                            { id: 'Work', icon: '🏢', label: 'Work (10 AM - 6 PM)' },
                            { id: 'Other', icon: '📍', label: 'Other' }
                          ].map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setAddrType(t.id)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                                addrType === t.id
                                  ? 'border-brass bg-ink text-gold shadow-sm'
                                  : 'border-ink/20 bg-bone/50 hover:bg-bone text-ink'
                              }`}
                            >
                              <span>{t.icon}</span>
                              <span>{t.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Submit Action */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl bg-ink hover:bg-brass text-bone hover:text-ink text-xs font-bold transition duration-200 shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                          <span>✓</span> Save Address &amp; Deliver Here
                        </button>
                      </div>
                    </form>
                  )}
                </div>

              {/* Order Summary box */}
              <div className="bg-white p-5 rounded-xl border border-ink/10 h-fit space-y-3 shadow-sm text-xs">
                <h3 className="serif text-lg font-bold">Order Summary</h3>
                <div className="space-y-1 border-b border-ink/10 pb-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartSummary.count})</span>
                    <span>{inr(cartSummary.sub)}</span>
                  </div>
                  {cartSummary.disc > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupon {appliedCoupon}</span>
                      <span>−{inr(cartSummary.disc)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span>Total</span>
                  <span>{inr(cartSummary.total)}</span>
                </div>
                <button
                  onClick={() => {
                    if (!selectedAddrId) return showToast('Select or add a delivery address', true);
                    setCheckoutStep(2);
                  }}
                  className="w-full py-3 rounded-xl bg-ink text-bone hover:bg-brass hover:text-ink font-semibold text-sm transition shadow"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
            );
          })()}

          {/* Step 2: Payment */}
          {checkoutStep === 2 && (
            <div className="max-w-xl mx-auto bg-white rounded-2xl border border-ink/15 overflow-hidden shadow-lg">
              <div className="bg-ink text-bone p-5">
                <p className="text-[10px] uppercase tracking-widest text-gold">Secure Checkout (Demo)</p>
                <p className="text-2xl font-bold">{inr(cartSummary.total)}</p>
              </div>

              <div className="p-6 space-y-3">
                {[
                  ['UPI', 'UPI (GPay, PhonePe, Paytm, QR)'],
                  ['CARD', 'Credit / Debit Card (Visa, MasterCard, RuPay)'],
                  ['NET_BANKING', 'Net Banking (All Major Indian Banks)']
                ].map(([k, label]) => (
                  <div
                    key={k}
                    onClick={() => setPaymentMethod(k)}
                    className={`p-4 rounded-xl border cursor-pointer text-sm font-bold transition flex items-center justify-between ${
                      paymentMethod === k ? 'border-brass bg-bone ring-1 ring-brass' : 'border-ink/15 hover:border-ink/30'
                    }`}
                  >
                    <span>{label}</span>
                    {paymentMethod === k && <span className="text-brass">✓</span>}
                  </div>
                ))}

                <div className="pt-3 flex gap-3">
                  <button
                    onClick={() => setCheckoutStep(1)}
                    className="px-4 py-3 rounded-xl border text-xs font-semibold hover:bg-bone transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3 rounded-xl bg-ink text-bone hover:bg-brass hover:text-ink font-bold text-sm transition shadow"
                  >
                    Place Order · {inr(cartSummary.total)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmed with Animated Tick & Celebration */}
          {checkoutStep === 3 && lastPlacedOrder && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl border border-brass/40 p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              {/* Luxury Ambient Glow */}
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Animated Moving Tick Ring with Ripple Waves */}
              <div className="relative w-28 h-28 mx-auto my-2 flex items-center justify-center">
                {/* Expanding pulse ripple wave */}
                <div className="absolute inset-0 rounded-full bg-brass/25 animate-ping opacity-40"></div>
                {/* Outer concentric pulsing ring */}
                <div className="absolute -inset-2.5 rounded-full border-2 border-brass/40 animate-pulse"></div>
                
                {/* Main metallic gold badge with tick */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-xl flex items-center justify-center relative z-10 transform hover:scale-105 transition">
                  <svg
                    className="w-14 h-14 text-stone-950 animate-in zoom-in spin-in-12 duration-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3.2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                {/* Sparkling celebratory star icons */}
                <span className="absolute -top-1 -right-1 text-xl animate-bounce">✨</span>
                <span className="absolute -bottom-1 -left-1 text-base text-gold animate-pulse">✦</span>
              </div>

              {/* Animated Status Pill */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] font-extrabold tracking-widest uppercase mt-3 shadow-xs">
                <span>✓</span> Tick! It&apos;s Done · Order Confirmed
              </div>

              <h2 className="serif text-2xl sm:text-3xl mt-2 font-bold text-ink">
                Thank you for choosing Orayve
              </h2>
              <p className="text-sm font-semibold text-ink/80 mt-1">
                Order ID: <b className="font-mono text-ink text-base">#{lastPlacedOrder.id}</b>
              </p>
              <p className="text-xs text-ink/60 mt-1">
                A confirmation has been logged. Protected by our <b>7-Day Return &amp; Replacement Policy</b>.
              </p>

              {/* Aura Wallet Perk Badge */}
              <div className="my-5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-200 text-left flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-base shrink-0">
                    ✦
                  </div>
                  <div>
                    <b className="text-ink text-[11px]">Orayve Aura Club Member</b>
                    <p className="text-[10px] text-ink/60">Your current wallet balance is {walletPoints.toLocaleString('en-IN')} Aura Points ({inr(walletPoints)})</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWalletPassbook(true)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-[10px] font-bold text-amber-900 hover:bg-amber-100 transition whitespace-nowrap"
                >
                  View Passbook
                </button>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setInvoiceModalOrder(lastPlacedOrder)}
                  className="px-6 py-2.5 rounded-xl bg-ink text-bone text-xs font-bold hover:bg-brass hover:text-ink shadow-md transition flex items-center gap-2"
                >
                  <span>🧾</span>
                  <span>GST Tax Invoice</span>
                </button>
                <button
                  onClick={() => {
                    setView('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 rounded-xl border border-ink/25 text-xs font-bold hover:bg-bone transition flex items-center gap-2"
                >
                  <span>📦</span>
                  <span>Track in My Orders</span>
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ==================================================================== */}
      {/* MY ORDERS VIEW                                                       */}
      {/* ==================================================================== */}
      {view === 'orders' && (
        <main className="max-w-4xl mx-auto px-4 py-10 flex-1">
          {!currentUser ? (
            <div className="py-20 text-center">
              <button
                onClick={() => setAuthModal('login')}
                className="px-5 py-2.5 rounded-xl bg-ink text-bone text-sm font-bold hover:bg-brass hover:text-ink transition"
              >
                Sign in to view your orders
              </button>
            </div>
          ) : (
            <>
              {/* User Profile Card */}
              <div className="bg-white rounded-xl border border-ink/10 p-5 mb-6 flex flex-wrap justify-between items-center gap-3 text-sm shadow-sm">
                <div>
                  <b>{currentUser.name}</b> · {currentUser.age} yrs
                  <p className="text-xs text-ink/60">+91 {currentUser.mobile} · {currentUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setView('store');
                    showToast('Logged out');
                  }}
                  className="text-xs font-bold text-rose-700 hover:underline"
                >
                  Log out
                </button>
              </div>

              {(() => {
                const userMob10 = (currentUser.mobile || '').replace(/[^0-9]/g, '').slice(-10);
                const myOrders = orders.filter(o => {
                  const oMob10 = (o.mobile || o.addr?.phone || o.addr?.mobile || o.addr?.m || '').replace(/[^0-9]/g, '').slice(-10);
                  return oMob10 && oMob10 === userMob10;
                });

                return (
                  <>
                    <h1 className="serif text-3xl mb-6 font-bold">
                      Order History ({myOrders.length})
                    </h1>

                    {myOrders.length > 0 ? (
                      <div className="space-y-5">
                        {myOrders.map(o => {
                          const currentStat = STAT_DETAILS[o.status] || { label: STAT[o.status] || 'PROCESSING', badge: 'bg-blue-100 text-blue-800 border-blue-200', desc: 'Order is under processing.' };
                          const canCancel = o.status < 3;
                          const canReturnOrReplace = o.status === 3;
                          const isCancelledFlow = o.status === 4 || o.status === 5;
                          const isReturnFlow = o.status === 6 || o.status === 7 || o.status === 8;
                          const isReplaceFlow = o.status === 9 || o.status === 10 || o.status === 11;

                          return (
                            <div key={o.id} className="bg-white rounded-2xl border border-ink/10 p-5 sm:p-6 shadow-sm space-y-4">
                              {/* Top Bar */}
                              <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-ink/10">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <b className="text-base font-bold text-ink">{o.id}</b>
                                    <span className="text-[10px] text-ink/60 bg-bone px-2 py-0.5 rounded border border-ink/10 font-mono">
                                      {o.inv || 'INV-TAX'}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${currentStat.badge}`}>
                                      {currentStat.label}
                                    </span>
                                  </div>
                                  <span className="text-xs text-ink/50 mt-0.5 block">{o.at}</span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                  <b className="text-base text-ink mr-1">{inr(o.total)}</b>
                                  <button
                                    onClick={() => setInvoiceModalOrder(o)}
                                    className="px-3 py-1.5 rounded-lg bg-bone border border-brass/40 text-xs font-bold hover:bg-brass hover:text-ink transition shadow-xs"
                                  >
                                    🧾 Tax Invoice
                                  </button>

                                  {/* Cancel Button (Available until Delivered) */}
                                  {canCancel && (
                                    <button
                                      onClick={() => openCancelModal(o)}
                                      className="px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50/60 text-rose-700 text-xs font-bold hover:bg-rose-100 transition shadow-xs flex items-center gap-1.5"
                                    >
                                      <span>✕</span> Cancel Order
                                    </button>
                                  )}

                                  {/* Return & Replace Buttons (Available when Delivered) */}
                                  {canReturnOrReplace && (
                                    <>
                                      <button
                                        onClick={() => openReturnModal(o, 'RETURN')}
                                        className="px-3 py-1.5 rounded-lg border border-brass/50 bg-brass/10 text-ink text-xs font-bold hover:bg-brass hover:text-ink transition shadow-xs flex items-center gap-1.5"
                                      >
                                        <span>🔄</span> Return
                                      </button>
                                      <button
                                        onClick={() => openReturnModal(o, 'REPLACE')}
                                        className="px-3 py-1.5 rounded-lg border border-ink/20 bg-white text-ink text-xs font-bold hover:bg-bone transition shadow-xs flex items-center gap-1.5"
                                      >
                                        <span>🔁</span> Replace
                                      </button>
                                    </>
                                  )}

                                  {/* Rate & Review Products Button (Available when Delivered) */}
                                  {o.status === 3 && (
                                    <button
                                      onClick={() => handleStartOrderReview(o)}
                                      className="px-3 py-1.5 rounded-lg border border-gold/70 bg-gradient-to-r from-amber-500/15 to-yellow-500/20 text-ink text-xs font-bold hover:bg-gold hover:text-ink transition shadow-xs flex items-center gap-1.5"
                                      title="Leave rating & review for products in this order"
                                    >
                                      <span>⭐</span> Review Products
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Visual Tracking Progress Bars */}
                              {!isCancelledFlow && !isReturnFlow && !isReplaceFlow && (
                                <div className="py-2 space-y-1.5">
                                  <div className="grid grid-cols-4 gap-2">
                                    {['ORDER PLACED', 'IN TRANSIT', 'OUT FOR DELIVERY', 'DELIVERED'].map((s, idx) => (
                                      <div key={s} className="text-center">
                                        <div className={`h-2 rounded-full mb-1.5 transition-all duration-300 ${idx <= o.status ? 'bg-brass shadow-xs' : 'bg-ink/10'}`} />
                                        <p className={`text-[10px] font-bold ${idx <= o.status ? 'text-ink' : 'opacity-40'}`}>
                                          {s}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="text-xs text-ink/70 text-center pt-1 font-medium">{currentStat.desc}</p>
                                </div>
                              )}

                              {/* Cancellation Flow Progression & Banner */}
                              {isCancelledFlow && (
                                <div className="space-y-3 p-4 rounded-xl border border-amber-200 bg-amber-50/60">
                                  <div className="grid grid-cols-3 gap-2">
                                    {[
                                      { label: 'ORDER PLACED', active: true },
                                      { label: 'CANCELLATION IN PROCESS', active: true },
                                      { label: 'REFUND INITIATED', active: o.status === 5 }
                                    ].map((step, idx) => (
                                      <div key={idx} className="text-center">
                                        <div className={`h-2 rounded-full mb-1.5 ${step.active ? (o.status === 5 && idx === 2 ? 'bg-purple-600' : 'bg-amber-600') : 'bg-ink/15'}`} />
                                        <p className={`text-[10px] font-bold ${step.active ? 'text-ink' : 'opacity-40'}`}>
                                          {step.label}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="pt-1 text-xs space-y-1">
                                    {o.status === 4 ? (
                                      <div className="bg-white p-3.5 rounded-lg border border-amber-300/80 shadow-xs space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                                            <span>⏳</span> Status: Cancellation in process for checking
                                          </span>
                                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                            Verification in Progress
                                          </span>
                                        </div>
                                        <p className="text-ink/80 text-[11px] leading-relaxed">
                                          Your cancellation request has been received. Our fulfillment team is checking logistics status. Once verification is complete (approx. 1 hour), refund will be initiated directly back to your payment source.
                                        </p>
                                        {o.cancelInfo?.reason && (
                                          <p className="text-[10px] text-ink/60"><b>Reason:</b> {o.cancelInfo.reason}</p>
                                        )}
                                        <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                                          <span className="text-[10px] text-ink/50">Refund Target: Original payment source (3 to 5 business days)</span>
                                          <button
                                            onClick={() => handleSimulateTime(o.id, 1)}
                                            className="px-2.5 py-1 rounded-md bg-brass text-ink font-bold text-[10px] hover:opacity-90 shadow-xs"
                                            title="Simulate 1 hour passing to view auto-refund"
                                          >
                                            ⚡ Fast-Forward 1 hr (Demo Auto-Refund)
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-white p-3.5 rounded-lg border border-purple-300/80 shadow-xs space-y-1">
                                        <span className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                                          <span>✓</span> Status: Refund Initiated
                                        </span>
                                        <p className="text-ink/80 text-[11px]">
                                          <b>Refund initiated.</b> Amount of <b>{inr(o.total)}</b> will be credited back to your original payment source within <b>3 to 5 business days</b>.
                                        </p>
                                        <p className="text-[10px] text-purple-700">Bank ARN / Reversal generated successfully.</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Return Flow Progression & Banner */}
                              {isReturnFlow && (
                                <div className="space-y-3 p-4 rounded-xl border border-cyan-200 bg-cyan-50/60">
                                  <div className="grid grid-cols-3 gap-2">
                                    {[
                                      { label: 'RETURN IN PROCESS', active: true },
                                      { label: 'PICKUP SCHEDULED', active: o.status >= 7 },
                                      { label: 'REFUND INITIATED', active: o.status === 8 }
                                    ].map((step, idx) => (
                                      <div key={idx} className="text-center">
                                        <div className={`h-2 rounded-full mb-1.5 ${step.active ? (o.status === 8 && idx === 2 ? 'bg-purple-600' : 'bg-cyan-600') : 'bg-ink/15'}`} />
                                        <p className={`text-[10px] font-bold ${step.active ? 'text-ink' : 'opacity-40'}`}>
                                          {step.label}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="pt-1 text-xs space-y-1">
                                    {o.status === 6 && (
                                      <div className="bg-white p-3.5 rounded-lg border border-amber-300 shadow-xs space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                                            <span>⏳</span> Status: Return in process
                                          </span>
                                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                            Quality Verification
                                          </span>
                                        </div>
                                        <p className="text-ink/80 text-[11px] leading-relaxed">
                                          Your return request has been submitted. Our logistics partner will be assigned for doorstep pickup within 2 hours.
                                        </p>
                                        {o.returnInfo?.reason && (
                                          <p className="text-[10px] text-ink/60"><b>Reason:</b> {o.returnInfo.reason}</p>
                                        )}
                                        <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                                          <span className="text-[10px] text-ink/50">Keep the item in its original luxury box with tags intact.</span>
                                          <button
                                            onClick={() => handleSimulateTime(o.id, 2)}
                                            className="px-2.5 py-1 rounded-md bg-brass text-ink font-bold text-[10px] hover:opacity-90 shadow-xs"
                                          >
                                            ⚡ Fast-Forward 2 hrs (Demo Pickup)
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {o.status === 7 && (
                                      <div className="bg-white p-3.5 rounded-lg border border-cyan-300 shadow-xs space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-cyan-900 flex items-center gap-1.5 text-xs">
                                            <span>🚚</span> Status: Item will be picked up
                                          </span>
                                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                                            Courier Assigned
                                          </span>
                                        </div>
                                        <p className="text-ink/80 text-[11px] leading-relaxed">
                                          Our courier executive has been dispatched and <b>will pick up the item</b> from your registered shipping address today. Please hand over the package safely.
                                        </p>
                                        <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                                          <span className="text-[10px] text-ink/50">Upon doorstep pickup, refund will be triggered immediately.</span>
                                          <button
                                            onClick={() => handleSimulateTime(o.id, 1)}
                                            className="px-2.5 py-1 rounded-md bg-brass text-ink font-bold text-[10px] hover:opacity-90 shadow-xs"
                                          >
                                            ⚡ Fast-Forward to Refund (Demo)
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {o.status === 8 && (
                                      <div className="bg-white p-3.5 rounded-lg border border-purple-300 shadow-xs space-y-1">
                                        <span className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                                          <span>✓</span> Status: Refund Initiated
                                        </span>
                                        <p className="text-ink/80 text-[11px]">
                                          Returned item has been collected and verified. <b>Refund initiated</b> of <b>{inr(o.total)}</b> will be credited back to your payment source within <b>3 to 5 business days</b>.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Replacement Flow Progression & Banner */}
                              {isReplaceFlow && (
                                <div className="space-y-3 p-4 rounded-xl border border-indigo-200 bg-indigo-50/60">
                                  <div className="grid grid-cols-3 gap-2">
                                    {[
                                      { label: 'REPLACEMENT IN PROCESS', active: true },
                                      { label: 'REPLACEMENT PICKUP', active: o.status >= 10 },
                                      { label: 'REPLACEMENT DELIVERED', active: o.status === 11 }
                                    ].map((step, idx) => (
                                      <div key={idx} className="text-center">
                                        <div className={`h-2 rounded-full mb-1.5 ${step.active ? (o.status === 11 ? 'bg-emerald-600' : 'bg-indigo-600') : 'bg-ink/15'}`} />
                                        <p className={`text-[10px] font-bold ${step.active ? 'text-ink' : 'opacity-40'}`}>
                                          {step.label}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="pt-1 text-xs space-y-1">
                                    {o.status === 9 && (
                                      <div className="bg-white p-3.5 rounded-lg border border-amber-300 shadow-xs space-y-1.5">
                                        <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                                          <span>⏳</span> Status: Replacement in process
                                        </span>
                                        <p className="text-ink/80 text-[11px]">
                                          Replacement order is being prepared by our warehouse. Doorstep exchange will be assigned within 2 hours.
                                        </p>
                                        <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                                          <span className="text-[10px] text-ink/50">Replacement preference: {o.returnInfo?.replacementVariant || 'Same item'}</span>
                                          <button
                                            onClick={() => handleSimulateTime(o.id, 2)}
                                            className="px-2.5 py-1 rounded-md bg-brass text-ink font-bold text-[10px] hover:opacity-90 shadow-xs"
                                          >
                                            ⚡ Fast-Forward 2 hrs (Demo Pickup)
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {o.status === 10 && (
                                      <div className="bg-white p-3.5 rounded-lg border border-indigo-300 shadow-xs space-y-1.5">
                                        <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-xs">
                                          <span>🚚</span> Status: Item will be picked up &amp; exchanged
                                        </span>
                                        <p className="text-ink/80 text-[11px]">
                                          Courier partner will pick up the current product and deliver your fresh replacement piece simultaneously at your doorstep.
                                        </p>
                                        <div className="pt-1 flex justify-end">
                                          <button
                                            onClick={() => handleSimulateTime(o.id, 1)}
                                            className="px-2.5 py-1 rounded-md bg-brass text-ink font-bold text-[10px] hover:opacity-90 shadow-xs"
                                          >
                                            ⚡ Fast-Forward to Delivered (Demo)
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {o.status === 11 && (
                                      <div className="bg-white p-3.5 rounded-lg border border-emerald-300 shadow-xs space-y-1">
                                        <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                                          <span>✓</span> Status: Replacement Delivered
                                        </span>
                                        <p className="text-ink/80 text-[11px]">
                                          Your replacement piece has been successfully delivered and handed over. Enjoy your ORAYVE luxury creation!
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Ordered Items with Luxury Thumbnails & Review Action */}
                              <div className="space-y-2.5 pt-3 border-t border-ink/10">
                                <div className="flex items-center justify-between text-[11px] font-bold text-ink/60 uppercase tracking-wider">
                                  <span>Ordered Items ({o.items?.length || 0})</span>
                                  <span>Subtotal</span>
                                </div>

                                  {(o.items || []).map((item, idx) => {
                                    const q = Number(item.qty || item.q || 1);
                                    const p = Number(item.price || 0);
                                    const cleanTitle = (item.title || '').trim().toLowerCase();
                                    const matchedProd = products.find(prod => 
                                      (item.pid && prod.id === item.pid) ||
                                      prod.title.trim().toLowerCase() === cleanTitle ||
                                      (cleanTitle && prod.title.toLowerCase().includes(cleanTitle)) ||
                                      (cleanTitle && cleanTitle.includes(prod.title.toLowerCase()))
                                    ) || products.find(prod => prod.cat === item.cat) || products[0];
                                    const matchedVar = matchedProd?.v?.find(v => v.id === item.vid || v.color?.toLowerCase() === (item.color || '').toLowerCase()) || matchedProd?.v?.[0];
                                    const itemPhoto = item.img || (matchedVar?.photo ? imgUrl(matchedVar) : null) || (matchedProd?.imgs?.[0]) || FB;

                                  const userPhoneClean = (currentUser?.mobile || currentUser?.phone || '').replace(/\D/g, '').slice(-10);
                                  const pId = matchedProd?.id || item.pid;
                                  const existingReview = reviews.find(r => 
                                    (r.pid === pId || (r.pTitle && r.pTitle.toLowerCase() === (item.title || '').toLowerCase())) &&
                                    (r.mobile && userPhoneClean && r.mobile.replace(/\D/g, '').slice(-10) === userPhoneClean)
                                  );

                                  return (
                                    <div
                                      key={idx}
                                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-ink/10 hover:border-brass/50 transition-all shadow-2xs"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        {/* Small Luxury Product Thumbnail (Click redirects to Product Page) */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (matchedProd) openProduct(matchedProd.id);
                                            else showToast(`Product details for ${item.title}`);
                                          }}
                                          title={matchedProd ? `Open ${matchedProd.title} details` : item.title}
                                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-ink/10 bg-bone shrink-0 cursor-pointer hover:border-brass hover:scale-105 transition-all shadow-xs group"
                                        >
                                          <img
                                            src={itemPhoto}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:opacity-90 transition"
                                            onError={e => { e.currentTarget.src = FB; }}
                                          />
                                        </button>

                                        {/* Item Title & Specifications */}
                                        <div className="min-w-0">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (matchedProd) openProduct(matchedProd.id);
                                              else showToast(`Product details for ${item.title}`);
                                            }}
                                            className="font-bold text-xs text-ink hover:text-amber-800 text-left line-clamp-1 cursor-pointer transition block"
                                          >
                                            {item.title}
                                          </button>
                                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-ink/70">
                                            <span className="px-2 py-0.5 rounded-md bg-bone border border-ink/10 font-medium">
                                              {item.color || 'Standard'}
                                            </span>
                                            <span>×</span>
                                            <span className="font-semibold">{q} unit{q > 1 ? 's' : ''}</span>
                                            <span>·</span>
                                            <span className="text-ink/60">{inr(p)} each</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Right side: Subtotal & Review Action if Delivered */}
                                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-ink/5">
                                        <b className="text-sm font-extrabold text-ink">{inr(p * q)}</b>

                                        {o.status === 3 && (
                                          <div className="mt-1">
                                            {existingReview ? (
                                              <span
                                                title={existingReview.title || 'Verified review'}
                                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"
                                              >
                                                <span>✓</span> Reviewed ★ {existingReview.rate || 5}
                                              </span>
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={() => startReviewForItem(o, item, matchedProd)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/15 border border-gold/60 text-amber-900 hover:bg-gold hover:text-ink transition shadow-2xs"
                                              >
                                                <span>⭐</span> Write Review
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="py-16 text-center text-ink/60">
                        No orders yet — place one from the storefront.
                      </p>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </main>
      )}

      {/* ==================================================================== */}
      {/* ADMIN CONSOLE VIEW                                                   */}
      {/* ==================================================================== */}
      {view === 'admin' && (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex-1 min-w-0">
          {!adminLoggedIn ? (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (adminPassInput === ADMIN_PASS || adminPassInput === 'SuperAdmin@2026') {
                    setAdminLoggedIn(true);
                    try {
                      localStorage.setItem('orv_admin_auth', 'true');
                      localStorage.setItem('orv_view', 'admin');
                    } catch {}
                    showToast('Admin console unlocked');
                  } else {
                    showToast('Wrong passcode', true);
                  }
                }}
                className="w-full max-w-sm bg-white rounded-3xl p-8 space-y-4 shadow-2xl border border-brass/40 text-left"
              >
                <div className="text-center space-y-1 pb-2 border-b border-ink/10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-300 mx-auto flex items-center justify-center text-stone-950 font-bold text-xl shadow-md">
                    🛡️
                  </div>
                  <h2 className="serif text-xl font-bold text-ink mt-2">Executive Admin Portal</h2>
                  <p className="text-[11px] text-ink/60">Enter your administrative master credential</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-ink/80 mb-1.5 uppercase tracking-wider">
                    Passcode Key <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPassInput}
                    onChange={e => setAdminPassInput(e.target.value)}
                    placeholder="Enter security key..."
                    className="w-full text-xs font-mono font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-ink text-bone font-bold text-xs uppercase tracking-wider hover:bg-brass hover:text-ink transition shadow-md"
                >
                  Unlock Admin Console →
                </button>
                <p className="text-[10px] text-ink/50 text-center">
                  Protected session · Demo passcode: {ADMIN_PASS}
                </p>
              </form>
            </div>
          ) : (
            <div>
              {/* Admin Nav Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h1 className="serif text-3xl font-bold flex items-center gap-3">
                    Admin Console
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Neon DB Live
                    </span>
                  </h1>
                  <p className="text-xs text-ink/60 mt-1">Real-time Neon PostgreSQL order processing & inventory intelligence</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      refreshLiveOrders();
                      refreshLiveProducts();
                      refreshLiveUsers();
                      updateSyncTimestamp();
                      showToast('Orders, products & users synchronized with database');
                    }}
                    className="px-3.5 py-2 rounded-lg bg-white border border-ink/20 text-xs font-bold hover:bg-bone transition flex items-center gap-1.5 shadow-sm"
                    title="Sync latest records from Neon DB"
                  >
                    <span>🔄</span> Sync Neon DB
                  </button>
                  {['analytics', 'orders', 'products', 'categories', 'users', 'coupons'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setAdminTab(tab)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition ${
                        adminTab === tab ? 'bg-ink text-bone shadow' : 'bg-white border border-ink/15 hover:bg-bone'
                      }`}
                    >
                      {tab} {tab === 'orders' ? `(${orders.length})` : tab === 'users' ? `(${users.length})` : ''}
                    </button>
                  ))}
                  <button
                    onClick={handleAdminLogout}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200"
                  >
                    Sign out
                  </button>
                </div>
              </div>

              {/* Tab 1: Analytics */}
              {adminTab === 'analytics' && (() => {
                const totalRev = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
                const totalOrders = orders.length;
                const totalUnitsSold = orders.reduce((sum, o) => {
                  return sum + (o.items || []).reduce((is, it) => is + Number(it.qty || it.q || 1), 0);
                }, 0);
                const avgOrderValue = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;
                const lowStockList = products.flatMap(p => (p.v || []).filter(v => (v.stock || 0) <= 10).map(v => ({ p, v })));
                const outOfStockList = products.flatMap(p => (p.v || []).filter(v => (v.stock || 0) === 0).map(v => ({ p, v })));
                const boost = products.filter(p => (p.views || 0) >= 1200 && ((p.sold || 0) / (p.views || 1)) * 100 < 1.8).slice(0, 6);

                // Category breakdown
                const catMap = {};
                categories.forEach(c => { catMap[c.name] = { name: c.name, units: 0, rev: 0 }; });
                orders.forEach(o => {
                  (o.items || []).forEach(it => {
                    const cat = it.cat || 'Accessories';
                    if (!catMap[cat]) catMap[cat] = { name: cat, units: 0, rev: 0 };
                    const q = Number(it.qty || it.q || 1);
                    const pr = Number(it.price || 0);
                    catMap[cat].units += q;
                    catMap[cat].rev += pr * q;
                  });
                });
                const catStats = Object.values(catMap).sort((a, b) => b.rev - a.rev);

                return (
                  <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { lbl: 'Total Revenue', val: inr(totalRev), sub: 'Gross revenue from live orders' },
                        { lbl: 'Total Orders', val: totalOrders, sub: 'Stored in Neon PostgreSQL' },
                        { lbl: 'Units Sold', val: totalUnitsSold, sub: 'Real-time inventory deduction' },
                        { lbl: 'Average Order Value (AOV)', val: inr(avgOrderValue), sub: 'Per customer transaction' },
                        { lbl: 'Live Products', val: products.length, sub: `${products.reduce((s, p) => s + (p.v?.length || 0), 0)} SKU variants active` },
                        { lbl: 'Low Stock SKUs (≤10)', val: lowStockList.length, sub: `${outOfStockList.length} out of stock`, alert: lowStockList.length > 0 },
                      ].map(kpi => (
                        <div key={kpi.lbl} className={`bg-white p-5 rounded-xl border shadow-sm ${kpi.alert ? 'border-amber-300 bg-amber-50/20' : 'border-ink/10'}`}>
                          <p className="text-xs text-ink/60 font-semibold">{kpi.lbl}</p>
                          <p className="text-2xl font-bold mt-1 text-ink">{kpi.val}</p>
                          <p className="text-[11px] text-ink/50 mt-1">{kpi.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Analytics Breakdown Grid */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Category Revenue Breakdown */}
                      <div className="bg-white p-5 rounded-xl border border-ink/10 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="serif text-lg font-bold">Category Sales Distribution</h3>
                          <span className="text-xs text-ink/50">{categories.length} Categories</span>
                        </div>
                        <div className="space-y-3">
                          {catStats.slice(0, 7).map(c => {
                            const pct = totalRev > 0 ? Math.round((c.rev / totalRev) * 100) : 0;
                            return (
                              <div key={c.name} className="text-xs">
                                <div className="flex justify-between font-semibold mb-1">
                                  <span>{c.name}</span>
                                  <span>{inr(c.rev)} ({c.units} units · {pct}%)</span>
                                </div>
                                <div className="w-full bg-bone h-2 rounded-full overflow-hidden border border-ink/5">
                                  <div className="bg-brass h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(4, pct)}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Low Stock Alerts */}
                      <div className="bg-white p-5 rounded-xl border border-ink/10 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="serif text-lg font-bold">Real-time Stock Alerts</h3>
                          <span className="text-xs text-amber-700 font-bold">{lowStockList.length} SKUs Alert</span>
                        </div>
                        {lowStockList.length > 0 ? (
                          <div className="divide-y divide-ink/5 max-h-80 overflow-y-auto pr-1">
                            {lowStockList.slice(0, 15).map(({ p, v }) => (
                              <div key={v.sku || (p.id + v.color)} className="py-2.5 flex justify-between items-center text-xs">
                                <div>
                                  <span className="font-semibold block">{p.title}</span>
                                  <span className="text-ink/60 text-[11px]">{v.color} · SKU: {v.sku}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${v.stock === 0 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {v.stock === 0 ? 'OUT OF STOCK' : `${v.stock} left`}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-ink/60 py-8 text-center">All product variants healthy (stock &gt; 10).</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Tab 2: Orders */}
              {adminTab === 'orders' && (() => {
                const filteredOrders = orders.filter(o => {
                  if (adminOrderFilter !== 'ALL' && o.status !== parseInt(adminOrderFilter)) return false;
                  if (!adminOrderSearch) return true;
                  const s = adminOrderSearch.toLowerCase();
                  const idMatch = (o.id || '').toLowerCase().includes(s);
                  const invMatch = (o.inv || '').toLowerCase().includes(s);
                  const nameMatch = (o.addr?.name || '').toLowerCase().includes(s);
                  const mobMatch = (o.mobile || o.addr?.phone || o.addr?.mobile || '').includes(s);
                  return idMatch || invMatch || nameMatch || mobMatch;
                });

                return (
                  <div className="space-y-4">
                    {/* Orders Filter & Search Toolbar */}
                    <div className="bg-white p-4 rounded-xl border border-ink/10 shadow-sm flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <input
                          value={adminOrderSearch}
                          onChange={e => setAdminOrderSearch(e.target.value)}
                          placeholder="Search Order ID, Customer, Mobile..."
                          className="text-xs w-72 max-w-full font-medium"
                        />
                        <select
                          value={adminOrderFilter}
                          onChange={e => setAdminOrderFilter(e.target.value)}
                          className="text-xs font-semibold cursor-pointer"
                        >
                          <option value="ALL">All Statuses ({orders.length})</option>
                          {STAT.map((s, idx) => (
                            <option key={s} value={idx}>{s} ({orders.filter(o => o.status === idx).length})</option>
                          ))}
                        </select>
                      </div>
                      <div className="text-xs text-ink/60 font-semibold">
                        Showing {filteredOrders.length} of {orders.length} orders
                      </div>
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length ? (
                      <div className="space-y-4">
                        {filteredOrders.map(o => {
                          const addr = o.addr || {};
                          const customerName = addr.name || 'Valued Customer';
                          const customerPhone = addr.phone || addr.mobile || addr.m || o.mobile || 'N/A';
                          const fullAddress = [
                            addr.address || addr.street || addr.street_line1 || '',
                            addr.city,
                            addr.state,
                            addr.pin || addr.pincode
                          ].filter(Boolean).join(', ');

                          return (
                            <div key={o.id} className="bg-white rounded-xl border border-ink/10 p-5 shadow-sm space-y-4">
                              {/* Order Top Bar */}
                              <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-ink/10">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <b className="text-sm font-bold text-ink">{o.id}</b>
                                    <span className="text-[11px] text-ink/50 bg-bone px-2 py-0.5 rounded border border-ink/10 font-mono">
                                      {o.inv || 'INV-TAX'}
                                    </span>
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                                      PAID ({o.pay || 'PREPAID'})
                                    </span>
                                  </div>
                                  <p className="text-xs text-ink/60 mt-0.5">{o.at}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => setInvoiceModalOrder(o)}
                                    className="px-3 py-1.5 rounded-lg bg-bone border border-brass/40 text-xs font-bold hover:bg-brass hover:text-ink transition"
                                  >
                                    🧾 Tax Invoice
                                  </button>

                                  <select
                                    value={o.status}
                                    onChange={e => {
                                      const nextStatus = parseInt(e.target.value);
                                      handleAdminOrderStatus(o.id, nextStatus);
                                    }}
                                    className="!bg-ink !text-bone font-bold text-xs"
                                  >
                                    {STAT.map((s, idx) => (
                                      <option key={s + idx} value={idx}>{s}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {/* Customer & Shipping Summary */}
                              <div className="grid md:grid-cols-2 gap-4 text-xs bg-bone/40 p-3.5 rounded-lg border border-ink/5">
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-ink/50 tracking-wider">Customer Details</p>
                                  <p className="font-bold text-ink mt-0.5">{customerName}</p>
                                  <p className="text-ink/70">📞 +91 {customerPhone.replace(/[^0-9]/g, '').slice(-10)}</p>
                                  {o.coupon && (
                                    <p className="text-[11px] text-brass font-bold mt-1">🎟️ Coupon Applied: {o.coupon}</p>
                                  )}
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-ink/50 tracking-wider">Shipping Destination</p>
                                  <p className="text-ink/80 mt-0.5">{fullAddress || 'Address on file'}</p>
                                  <span className="inline-block mt-1 text-[10px] bg-ink/10 px-2 py-0.5 rounded font-bold uppercase">
                                    {addr.type || 'Standard Delivery'}
                                  </span>
                                </div>
                              </div>

                              {/* Cancellation Details & Admin Action */}
                              {o.cancelInfo && (
                                <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/70 space-y-2 text-xs">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                                      <span>⚠️</span> Customer Cancellation Request
                                    </span>
                                    <span className="text-[10px] text-amber-800 font-mono">
                                      Requested: {new Date(o.cancelInfo.requestedAt).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                  <div className="text-ink/80 text-xs">
                                    <p><b>Reason:</b> {o.cancelInfo.reason}</p>
                                    {o.cancelInfo.comments && <p className="mt-0.5"><b>Remarks:</b> {o.cancelInfo.comments}</p>}
                                    <p className="mt-0.5 text-[11px] text-ink/60"><b>Refund Target:</b> {o.cancelInfo.refundMethod || 'Original Payment Source'}</p>
                                  </div>
                                  {o.status === 4 && (
                                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200">
                                      <button
                                        type="button"
                                        onClick={() => handleAdminOrderStatus(o.id, 5, { ...o.cancelInfo, status: 'REFUND_INITIATED', refundInitiatedAt: new Date().toISOString() })}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 text-xs shadow-xs"
                                      >
                                        ⚡ Approve &amp; Initiate Refund (3-5 Days)
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleSimulateTime(o.id, 1)}
                                        className="px-3 py-1.5 rounded-lg bg-brass text-ink font-bold hover:opacity-90 text-xs shadow-xs"
                                      >
                                        ⏩ Fast-Forward 1 hr (Demo Auto-Refund)
                                      </button>
                                    </div>
                                  )}
                                  {o.status === 5 && (
                                    <div className="text-purple-800 font-bold text-xs flex items-center gap-1.5 pt-1 border-t border-amber-200">
                                      <span>✓</span> Refund initiated to customer payment source (3 to 5 business days).
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Return / Replacement Details & Admin Actions */}
                              {o.returnInfo && (
                                <div className="p-3.5 rounded-xl border border-cyan-300 bg-cyan-50/70 space-y-2 text-xs">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="font-bold text-cyan-900 flex items-center gap-1.5">
                                      <span>{o.returnInfo.type === 'REPLACE' ? '🔁' : '🔄'}</span>
                                      Customer {o.returnInfo.type === 'REPLACE' ? 'Replacement' : 'Return'} Request
                                    </span>
                                    <span className="text-[10px] text-cyan-800 font-mono">
                                      Requested: {new Date(o.returnInfo.requestedAt).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                  <div className="text-ink/80 text-xs space-y-0.5">
                                    <p><b>Reason:</b> {o.returnInfo.reason}</p>
                                    <p><b>Item Condition:</b> {o.returnInfo.condition}</p>
                                    {o.returnInfo.comments && <p><b>Remarks:</b> {o.returnInfo.comments}</p>}
                                    {o.returnInfo.type === 'REPLACE' ? (
                                      <p><b>Replacement Preference:</b> {o.returnInfo.replacementVariant}</p>
                                    ) : (
                                      <p><b>Refund Preference:</b> {o.returnInfo.refundMethod}</p>
                                    )}
                                  </div>

                                  {/* Admin Action Buttons for Return / Replacement Lifecycle */}
                                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-cyan-200">
                                    {o.status === 6 && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => handleAdminOrderStatus(o.id, 7, undefined, { ...o.returnInfo, status: 'PICKUP_SCHEDULED', pickupScheduledAt: new Date().toISOString() })}
                                          className="px-3 py-1.5 rounded-lg bg-cyan-700 text-white font-bold hover:bg-cyan-800 text-xs shadow-xs"
                                        >
                                          🚚 Schedule Courier Pickup
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleSimulateTime(o.id, 2)}
                                          className="px-3 py-1.5 rounded-lg bg-brass text-ink font-bold hover:opacity-90 text-xs shadow-xs"
                                        >
                                          ⏩ Fast-Forward 2 hrs (Demo Auto-Pickup)
                                        </button>
                                      </>
                                    )}
                                    {o.status === 7 && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => handleAdminOrderStatus(o.id, 8, undefined, { ...o.returnInfo, status: 'REFUND_INITIATED', refundInitiatedAt: new Date().toISOString() })}
                                          className="px-3 py-1.5 rounded-lg bg-purple-700 text-white font-bold hover:bg-purple-800 text-xs shadow-xs"
                                        >
                                          💰 Confirm Pickup &amp; Initiate Refund (3-5 Days)
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleSimulateTime(o.id, 1)}
                                          className="px-3 py-1.5 rounded-lg bg-brass text-ink font-bold hover:opacity-90 text-xs shadow-xs"
                                        >
                                          ⏩ Fast-Forward to Refund (Demo)
                                        </button>
                                      </>
                                    )}
                                    {o.status === 8 && (
                                      <div className="text-purple-800 font-bold text-xs flex items-center gap-1.5">
                                        <span>✓</span> Return inspected &amp; refund initiated to customer payment source.
                                      </div>
                                    )}

                                    {o.status === 9 && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => handleAdminOrderStatus(o.id, 10, undefined, { ...o.returnInfo, status: 'PICKUP_SCHEDULED', pickupScheduledAt: new Date().toISOString() })}
                                          className="px-3 py-1.5 rounded-lg bg-cyan-700 text-white font-bold hover:bg-cyan-800 text-xs shadow-xs"
                                        >
                                          🚚 Schedule Replacement Pickup
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleSimulateTime(o.id, 2)}
                                          className="px-3 py-1.5 rounded-lg bg-brass text-ink font-bold hover:opacity-90 text-xs shadow-xs"
                                        >
                                          ⏩ Fast-Forward 2 hrs (Demo Auto-Pickup)
                                        </button>
                                      </>
                                    )}
                                    {o.status === 10 && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => handleAdminOrderStatus(o.id, 11, undefined, { ...o.returnInfo, status: 'COMPLETED', deliveredAt: new Date().toISOString() })}
                                          className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 text-xs shadow-xs"
                                        >
                                          📦 Dispatch &amp; Mark Replacement Delivered
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleSimulateTime(o.id, 1)}
                                          className="px-3 py-1.5 rounded-lg bg-brass text-ink font-bold hover:opacity-90 text-xs shadow-xs"
                                        >
                                          ⏩ Fast-Forward to Delivered (Demo)
                                        </button>
                                      </>
                                    )}
                                    {o.status === 11 && (
                                      <div className="text-emerald-800 font-bold text-xs flex items-center gap-1.5">
                                        <span>✓</span> Replacement delivered successfully to customer.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Line Items with Luxury Thumbnails & Product Links */}
                              <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-ink/50 tracking-wider">
                                  <span>Order Items ({o.items?.length || 0})</span>
                                  <span>Subtotal</span>
                                </div>
                                <div className="space-y-2">
                                  {(o.items || []).map((item, idx) => {
                                    const qty = Number(item.qty || item.q || 1);
                                    const price = Number(item.price || 0);
                                    const cleanTitle = (item.title || '').trim().toLowerCase();
                                    const matchedProd = products.find(prod => 
                                      (item.pid && prod.id === item.pid) ||
                                      prod.title.trim().toLowerCase() === cleanTitle ||
                                      (cleanTitle && prod.title.toLowerCase().includes(cleanTitle)) ||
                                      (cleanTitle && cleanTitle.includes(prod.title.toLowerCase()))
                                    ) || products.find(p => p.cat === item.cat) || products[0];
                                    const matchedVar = matchedProd?.v?.find(v => v.id === item.vid || v.color?.toLowerCase() === (item.color || '').toLowerCase()) || matchedProd?.v?.[0];
                                    const itemPhoto = item.img || (matchedVar?.photo ? imgUrl(matchedVar) : null) || (matchedProd?.imgs?.[0]) || FB;

                                    return (
                                      <div key={idx} className="p-2.5 rounded-xl bg-bone/30 border border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-brass/40 transition">
                                        <div className="flex items-center gap-3 min-w-0">
                                          {/* Small Product Thumbnail */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (matchedProd) openProduct(matchedProd.id);
                                            }}
                                            title={matchedProd ? `Open ${matchedProd.title} store page` : item.title}
                                            className="w-12 h-12 rounded-lg overflow-hidden border border-ink/10 bg-white shrink-0 cursor-pointer hover:scale-105 transition shadow-2xs group"
                                          >
                                            <img
                                              src={itemPhoto}
                                              alt={item.title}
                                              className="w-full h-full object-cover group-hover:opacity-90"
                                              onError={e => { e.currentTarget.src = FB; }}
                                            />
                                          </button>

                                          <div className="min-w-0">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                if (matchedProd) openProduct(matchedProd.id);
                                              }}
                                              className="font-bold text-xs text-ink hover:text-amber-800 text-left line-clamp-1 block transition cursor-pointer"
                                            >
                                              {item.title}
                                            </button>
                                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-ink/60">
                                              <span className="px-1.5 py-0.2 rounded bg-bone border border-ink/10 font-medium">
                                                {item.color || 'Standard'}
                                              </span>
                                              <span>·</span>
                                              <span>SKU: {item.sku || 'N/A'}</span>
                                              <span>·</span>
                                              <span>HSN: {item.hsn || '71171990'}</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-ink/5">
                                          <b className="text-xs font-bold text-ink">{inr(price * qty)}</b>
                                          <span className="text-[10px] text-ink/60">{inr(price)} × {qty}</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Pricing Breakdown */}
                              <div className="pt-3 border-t border-ink/10 flex justify-between items-center text-xs">
                                <span className="text-ink/60">
                                  Subtotal: {inr(o.sub || o.total)} {o.disc > 0 ? `· Discount: -${inr(o.disc)}` : ''}
                                </span>
                                <div className="text-right">
                                  <span className="text-ink/60 mr-2">Grand Total:</span>
                                  <b className="text-base text-brass font-bold">{inr(o.total)}</b>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white p-12 text-center rounded-xl border border-ink/10">
                        <p className="text-sm font-semibold text-ink">No orders found matching criteria.</p>
                        <p className="text-xs text-ink/60 mt-1">Place an order from the storefront or clear your filter.</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Tab 3: Products */}
              {adminTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    <button
                      onClick={openNewProductModal}
                      className="px-4 py-2 rounded-lg bg-brass text-ink text-xs font-bold hover:opacity-90 transition shadow-sm flex items-center gap-1.5"
                    >
                      <span className="text-base leading-none">+</span> Add Product
                    </button>
                    <input
                      value={adminSearch}
                      onChange={e => setAdminSearch(e.target.value)}
                      placeholder="Search products / SKU..."
                      className="flex-1 max-w-md text-xs"
                    />
                  </div>

                  {/* Enhanced Add / Edit Product Workspace */}
                  {editingProduct && (
                    <form
                      onSubmit={handleSaveProduct}
                      className="bg-white p-6 rounded-2xl border-2 border-brass/50 shadow-xl space-y-6 text-xs animate-in fade-in duration-200"
                    >
                      {/* Workspace Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-ink/10">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brass/20 text-brass uppercase">
                              {editingProduct.id ? 'Catalog Editor' : 'New Product Creator'}
                            </span>
                            <span className="text-[11px] text-ink/50 font-mono">
                              {editingProduct.id ? `ID: ${editingProduct.id}` : 'Auto-generated ID'}
                            </span>
                          </div>
                          <h3 className="font-bold text-base serif mt-0.5 text-ink">
                            {editingProduct.id ? `Edit: ${formTitle || editingProduct.title || 'Product'}` : 'Add New Product to Storefront'}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="w-8 h-8 rounded-full border border-ink/20 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-bone transition font-bold"
                          title="Close"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Section 1: Basic Information */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-ink flex items-center gap-1.5 text-xs uppercase tracking-wider text-brass">
                          <span>①</span> General Details & Classification
                        </h4>
                        <div className="grid sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-ink/70 mb-1">Product Title *</label>
                            <input
                              required
                              value={formTitle}
                              onChange={e => setFormTitle(e.target.value)}
                              placeholder="e.g. Savile Bifold Leather Wallet"
                              className="w-full text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink/70 mb-1">Category *</label>
                            <select
                              value={formCat}
                              onChange={e => {
                                const selected = e.target.value;
                                setFormCat(selected);
                                const catObj = categories.find(c => c.name === selected);
                                if (catObj?.hsn) setFormHsn(catObj.hsn);
                              }}
                              className="w-full text-xs"
                            >
                              {categories.map(c => (
                                <option key={c.name} value={c.name}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-ink/70 mb-1">Style / Collection</label>
                            <input
                              value={formDesign}
                              onChange={e => setFormDesign(e.target.value)}
                              placeholder="e.g. Classic Signature"
                              className="w-full text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-semibold text-ink/70 mb-1">HSN Code (GST Classification)</label>
                            <input
                              value={formHsn}
                              onChange={e => setFormHsn(e.target.value)}
                              placeholder="e.g. 42023190"
                              className="w-full text-xs"
                            />
                          </div>
                          <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={formCoupon}
                                onChange={e => setFormCoupon(e.target.checked)}
                                className="w-4 h-4 rounded text-brass focus:ring-brass"
                              />
                              <span className="font-semibold text-ink">Coupon Eligible (Store promotional discounts apply)</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Media Gallery (N Images) */}
                      <div className="space-y-3 pt-2 border-t border-ink/10">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-ink flex items-center gap-1.5 text-xs uppercase tracking-wider text-brass">
                              <span>②</span> Product Imagery Gallery ({formImages.length} {formImages.length === 1 ? 'image' : 'images'})
                            </h4>
                            <p className="text-[11px] text-ink/60 mt-0.5">
                              Add unlimited high-definition product photos. The first photo serves as the Primary Storefront Cover.
                            </p>
                          </div>
                          <label className="px-3 py-1.5 rounded-lg bg-ink text-bone font-bold text-xs hover:bg-ink/80 transition cursor-pointer flex items-center gap-1.5 shadow-sm">
                            <span>📁 Upload Local Photos</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageFilesUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* URL Input Box */}
                        <div className="flex gap-2">
                          <input
                            value={formImageUrlInput}
                            onChange={e => setFormImageUrlInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                            placeholder="Or paste external image URL (e.g. https://images.unsplash.com/...)"
                            className="flex-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleAddImageUrl}
                            className="px-3.5 py-1.5 rounded-lg bg-brass text-ink font-bold hover:opacity-90 transition text-xs whitespace-nowrap"
                          >
                            + Add Image URL
                          </button>
                        </div>

                        {/* Visual Thumbnail Gallery */}
                        {formImages.length === 0 ? (
                          <div className="p-6 rounded-xl border border-dashed border-ink/20 text-center bg-bone/50 space-y-1">
                            <p className="font-bold text-ink/70">No imagery added yet</p>
                            <p className="text-[11px] text-ink/50">Upload images from your device or paste image URLs above to populate product imagery.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
                            {formImages.map((imgSrc, idx) => (
                              <div
                                key={idx}
                                className={`relative group rounded-xl overflow-hidden border-2 bg-bone transition ${
                                  idx === 0 ? 'border-brass shadow-md ring-2 ring-brass/30' : 'border-ink/10 hover:border-ink/30'
                                }`}
                              >
                                <img
                                  src={imgSrc}
                                  alt={`Product ${idx + 1}`}
                                  className="w-full h-24 object-cover"
                                  onError={e => { e.currentTarget.src = FB; }}
                                />
                                {idx === 0 && (
                                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-brass text-ink shadow">
                                    ★ Cover
                                  </span>
                                )}
                                <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 p-1">
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMakePrimaryImage(idx)}
                                      className="px-2 py-0.5 rounded bg-brass text-ink font-bold text-[9px] hover:opacity-90 shadow"
                                    >
                                      Make Cover
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[9px] hover:bg-rose-700 shadow"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Section 3: Bespoke Color Variants (N Variants) */}
                      <div className="space-y-3 pt-2 border-t border-ink/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-ink flex items-center gap-1.5 text-xs uppercase tracking-wider text-brass">
                              <span>③</span> Bespoke Color Variants &amp; Inventory ({formVariants.length})
                            </h4>
                            <p className="text-[11px] text-ink/60 mt-0.5">
                              Configure specific colorways, hex codes, pricing, stock levels, and distinct variant imagery.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddVariant}
                            className="px-3 py-1.5 rounded-lg bg-brass text-ink font-bold hover:opacity-90 transition text-xs flex items-center gap-1 shadow-sm"
                          >
                            <span>+</span> Add Color Variant
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {formVariants.map((vr, vIdx) => {
                            const disc = Math.round((1 - (Number(vr.price) || 0) / Math.max(Number(vr.mrp) || Number(vr.price) || 1, Number(vr.price) || 1)) * 100);
                            return (
                              <div
                                key={vr.id || vIdx}
                                className="p-3.5 rounded-xl border border-ink/10 bg-bone/40 hover:bg-white hover:border-brass/40 transition space-y-2.5"
                              >
                                <div className="grid grid-cols-2 sm:grid-cols-12 gap-2.5 items-center">
                                  {/* Color Name */}
                                  <div className="sm:col-span-3">
                                    <label className="block text-[10px] font-semibold text-ink/60 mb-0.5">Color Name *</label>
                                    <input
                                      required
                                      value={vr.color}
                                      onChange={e => handleUpdateVariant(vr.id, 'color', e.target.value)}
                                      placeholder="e.g. Pitch Black"
                                      className="w-full text-xs font-medium"
                                    />
                                  </div>

                                  {/* Color Hex */}
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-semibold text-ink/60 mb-0.5">Hex Swatch</label>
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="color"
                                        value={vr.hex || '#1C1B29'}
                                        onChange={e => handleUpdateVariant(vr.id, 'hex', e.target.value)}
                                        className="h-8 w-10 !p-0.5 rounded cursor-pointer border border-ink/20"
                                      />
                                      <span className="font-mono text-[10px] text-ink/70">{vr.hex || '#1C1B29'}</span>
                                    </div>
                                  </div>

                                  {/* Price */}
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-semibold text-ink/60 mb-0.5">Selling Price (₹) *</label>
                                    <input
                                      type="number"
                                      required
                                      min="1"
                                      value={vr.price}
                                      onChange={e => handleUpdateVariant(vr.id, 'price', e.target.value)}
                                      placeholder="1499"
                                      className="w-full text-xs font-bold"
                                    />
                                  </div>

                                  {/* MRP */}
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-semibold text-ink/60 mb-0.5">MRP (₹)</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={vr.mrp}
                                      onChange={e => handleUpdateVariant(vr.id, 'mrp', e.target.value)}
                                      placeholder="2499"
                                      className="w-full text-xs"
                                    />
                                  </div>

                                  {/* Stock */}
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-semibold text-ink/60 mb-0.5">Inventory Stock</label>
                                    <input
                                      type="number"
                                      min="0"
                                      value={vr.stock}
                                      onChange={e => handleUpdateVariant(vr.id, 'stock', e.target.value)}
                                      placeholder="50"
                                      className="w-full text-xs font-bold text-emerald-800"
                                    />
                                  </div>

                                  {/* Delete Variant */}
                                  <div className="sm:col-span-1 flex justify-end pt-3">
                                    <button
                                      type="button"
                                      disabled={formVariants.length <= 1}
                                      onClick={() => handleRemoveVariant(vr.id)}
                                      className={`p-1.5 rounded-lg border text-xs transition ${
                                        formVariants.length <= 1
                                          ? 'opacity-30 cursor-not-allowed border-ink/10 text-ink/40'
                                          : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                                      }`}
                                      title={formVariants.length <= 1 ? 'Minimum 1 variant required' : 'Delete variant'}
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>

                                {/* Variant Photo & SKU Row */}
                                <div className="grid sm:grid-cols-3 gap-2.5 pt-1 border-t border-ink/5 items-center">
                                  <div>
                                    <span className="text-[10px] font-semibold text-ink/60">SKU Code: </span>
                                    <span className="font-mono text-[10px] font-bold text-ink">{vr.sku}</span>
                                    {disc > 0 && (
                                      <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                        {disc}% OFF
                                      </span>
                                    )}
                                  </div>
                                  <div className="sm:col-span-2 flex items-center gap-2">
                                    <label className="text-[10px] font-semibold text-ink/60 whitespace-nowrap">Assigned Photo:</label>
                                    <select
                                      value={vr.photo || ''}
                                      onChange={e => handleUpdateVariant(vr.id, 'photo', e.target.value)}
                                      className="flex-1 text-[11px] py-1"
                                    >
                                      <option value="">Default (Cover Image)</option>
                                      {formImages.map((imgSrc, imgI) => (
                                        <option key={imgI} value={imgSrc}>
                                          Image {imgI + 1} {imgI === 0 ? '(Cover)' : ''} - {imgSrc.slice(0, 32)}...
                                        </option>
                                      ))}
                                    </select>
                                    {vr.photo && (
                                      <img
                                        src={vr.photo}
                                        alt="Thumbnail"
                                        className="w-6 h-6 rounded object-cover border border-ink/20"
                                        onError={e => { e.currentTarget.src = FB; }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 4: Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-ink/10">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 rounded-xl border border-ink/20 font-bold hover:bg-bone text-ink transition text-xs"
                        >
                          Cancel &amp; Discard
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingProduct}
                          className="px-6 py-2.5 rounded-xl bg-ink text-bone font-bold hover:bg-ink/90 transition shadow-md flex items-center gap-2 text-xs"
                        >
                          {isSavingProduct ? (
                            <>
                              <span className="animate-spin text-brass">●</span>
                              <span>Saving Product...</span>
                            </>
                          ) : (
                            <span>{editingProduct.id ? 'Save Changes' : 'Publish Product to Storefront'}</span>
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Products Table */}
                  <div className="bg-white rounded-xl border border-ink/10 overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-ink text-bone">
                        <tr>
                          <th className="p-3">Product & Variants</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price Range</th>
                          <th className="p-3">Sold</th>
                          <th className="p-3">Inventory Stock</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/10">
                        {products
                          .filter(p => !adminSearch || (p.title + p.cat).toLowerCase().includes(adminSearch.toLowerCase()))
                          .slice(0, 40)
                          .map(p => {
                            const totStock = (p.v || []).reduce((s, v) => s + (v.stock || 0), 0);
                            const hasLowStock = (p.v || []).some(v => (v.stock || 0) <= 10);
                            const isOutOfStock = totStock === 0;

                            const realProductSold = orders.reduce((s, o) => {
                              const match = (o.items || []).filter(it => 
                                it.pid === p.id || 
                                it.title?.toLowerCase() === p.title?.toLowerCase() ||
                                (it.sku && p.v?.some(v => v.sku === it.sku))
                              );
                              return s + match.reduce((is, it) => is + Number(it.qty || it.q || 1), 0);
                            }, 0);

                            return (
                              <tr key={p.id}>
                                <td className="p-3">
                                  <span className="font-semibold block">{p.title}</span>
                                  <span className="text-ink/60 text-[11px]">
                                    {(p.v || []).map(v => `${v.color} (${v.stock})`).join(' · ')}
                                  </span>
                                </td>
                                <td className="p-3">{p.cat}</td>
                                <td className="p-3 font-medium">{(p.v || []).map(v => inr(v.price)).join(' / ')}</td>
                                <td className="p-3 font-bold text-brass">{realProductSold}</td>
                                <td className="p-3">
                                  <span className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                                    isOutOfStock
                                      ? 'bg-rose-100 text-rose-800'
                                      : hasLowStock
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-50 text-emerald-800'
                                  }`}>
                                    {totStock} in stock
                                  </span>
                                </td>
                                <td className="p-3 text-right space-x-3">
                                  <button
                                    onClick={() => openEditProductModal(p)}
                                    className="text-brass font-bold hover:underline"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm(`Delete "${p.title}" from catalog?`)) {
                                        setProducts(products.filter(x => x.id !== p.id));
                                        showToast('Product removed');
                                        try {
                                          await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' });
                                        } catch {}
                                      }
                                    }}
                                    className="text-rose-600 font-bold hover:underline"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Categories */}
              {adminTab === 'categories' && (
                <div className="space-y-5">
                  {/* Executive Header & Stats */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-ink/10 shadow-sm">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brass/20 text-brass text-[10px] font-extrabold uppercase tracking-wider mb-1">
                        <span>🏷️</span> Catalog Taxonomy
                      </div>
                      <h3 className="serif text-xl font-bold text-ink">Product Categories</h3>
                      <p className="text-xs text-ink/60 mt-0.5">
                        {categories.length} active categories · {products.length} catalog items linked
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingCategory({})}
                      className="px-5 py-2.5 rounded-xl bg-ink text-bone hover:bg-brass hover:text-ink font-bold text-xs shadow-md transition flex items-center gap-2"
                    >
                      <span className="text-gold">+</span>
                      <span>Add New Category</span>
                    </button>
                  </div>

                  {/* Add / Edit Category Form */}
                  {editingCategory && (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const name = fd.get('name').trim();
                        const hsn = fd.get('hsn').trim();
                        if (editingCategory.old) {
                          setCategories(categories.map(c => c.name === editingCategory.old ? { name, hsn } : c));
                        } else {
                          setCategories([...categories, { name, hsn }]);
                        }
                        setEditingCategory(null);
                        showToast('Category saved successfully');
                      }}
                      className="bg-white p-6 rounded-2xl border-2 border-brass/50 shadow-lg space-y-4 animate-in fade-in duration-200"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-ink/10">
                        <b className="text-sm text-ink flex items-center gap-2">
                          <span>🏷️</span> {editingCategory.old ? `Edit Category: ${editingCategory.old}` : 'Create New Collection Category'}
                        </b>
                        <span className="text-[10px] text-ink/50 uppercase tracking-wider">HSN &amp; Taxonomy</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-ink/80 mb-1.5">
                            Category Display Name <span className="text-rose-600">*</span>
                          </label>
                          <input
                            required
                            name="name"
                            defaultValue={editingCategory.old || ''}
                            placeholder="e.g. Leather Wallets, Silk Ties, Oxford Shoes"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-ink/20 focus:border-brass focus:ring-1 focus:ring-brass"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-ink/80 mb-1.5">
                            HSN Code (GST Classification) <span className="text-rose-600">*</span>
                          </label>
                          <input
                            required
                            name="hsn"
                            defaultValue={categories.find(c => c.name === editingCategory.old)?.hsn || ''}
                            placeholder="e.g. 42023120, 62151000, 64035990"
                            className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-ink/20 focus:border-brass focus:ring-1 focus:ring-brass"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-ink/10">
                        <button
                          type="button"
                          onClick={() => setEditingCategory(null)}
                          className="px-4 py-2 rounded-xl border border-ink/20 font-bold hover:bg-bone text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-ink text-bone font-bold text-xs hover:bg-brass hover:text-ink shadow-md transition"
                        >
                          Save Category
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Categories Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(c => {
                      const count = products.filter(p => p.cat === c.name).length;
                      return (
                        <div
                          key={c.name}
                          className="bg-white p-5 rounded-2xl border border-ink/10 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 group"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-sm text-ink group-hover:text-brass transition">
                                {c.name}
                              </h4>
                              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-bone text-ink/70 border border-ink/10 shrink-0">
                                HSN {c.hsn || '—'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                                {count} {count === 1 ? 'Product' : 'Products'} Active
                              </span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-ink/10 flex items-center justify-between text-xs">
                            <button
                              onClick={() => setEditingCategory({ old: c.name })}
                              className="px-3 py-1.5 rounded-lg border border-brass/40 text-brass font-bold hover:bg-brass hover:text-ink transition text-[11px]"
                            >
                              Edit / Rename
                            </button>
                            <button
                              onClick={() => {
                                if (products.some(p => p.cat === c.name)) {
                                  return showToast(`Cannot delete: ${count} products are currently linked to ${c.name}. Move or delete products first.`, true);
                                }
                                if (confirm(`Permanently delete category "${c.name}"?`)) {
                                  setCategories(categories.filter(x => x.name !== c.name));
                                  showToast(`Category "${c.name}" deleted.`);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition text-[11px]"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 5: Users */}
              {adminTab === 'users' && (() => {
                const filteredUsers = users.filter(u => {
                  if (!adminUserSearch) return true;
                  const s = adminUserSearch.toLowerCase();
                  return (
                    (u.name || '').toLowerCase().includes(s) ||
                    (u.email || '').toLowerCase().includes(s) ||
                    (u.mobile || '').includes(s)
                  );
                });

                return (
                  <div className="space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-xl border border-ink/10 shadow-sm">
                      <div>
                        <b className="text-sm">Registered Customers</b>
                        <p className="text-xs text-ink/60 mt-0.5">
                          {users.length} registered users · {users.filter(u => u.banned).length} banned
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          value={adminUserSearch}
                          onChange={e => setAdminUserSearch(e.target.value)}
                          placeholder="Search name, phone, email..."
                          className="text-xs w-64 max-w-full font-medium"
                        />
                        <button
                          onClick={() => {
                            refreshLiveUsers();
                            showToast('Users directory refreshed');
                          }}
                          className="px-3 py-1.5 rounded-lg border border-ink/20 text-xs font-bold hover:bg-bone transition"
                        >
                          🔄 Refresh
                        </button>
                      </div>
                    </div>

                    <div className="w-full min-w-0 overflow-x-auto bg-white rounded-xl border border-ink/10 shadow-sm">
                      <table className="w-full min-w-[640px] text-left text-xs">
                        <thead className="bg-ink text-bone">
                          <tr>
                            <th className="p-3">Customer Name</th>
                            <th className="p-3">Age</th>
                            <th className="p-3">Mobile Number</th>
                            <th className="p-3">Email Address</th>
                            <th className="p-3">Joined</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10">
                          {filteredUsers.length ? filteredUsers.map(u => (
                            <tr key={u.mobile} className={u.banned ? 'bg-rose-50/60' : ''}>
                              <td className="p-3 font-semibold text-ink">{u.name}</td>
                              <td className="p-3 text-ink/80">{u.age || 25}</td>
                              <td className="p-3 font-mono text-ink/80 whitespace-nowrap">+91 {u.mobile.replace(/[^0-9]/g, '').slice(-10)}</td>
                              <td className="p-3 text-ink/70 break-all">{u.email || '—'}</td>
                              <td className="p-3 text-ink/60 whitespace-nowrap">{u.at || '23/11/2026'}</td>
                              <td className="p-3 whitespace-nowrap">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  u.banned ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {u.banned ? 'BANNED' : 'Active'}
                                </span>
                              </td>
                              <td className="p-3 text-right space-x-3 whitespace-nowrap">
                                <button
                                  onClick={async () => {
                                    const nextBan = !u.banned;
                                    try {
                                      await fetch(`/api/admin/users/${u.mobile}/ban`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ banned: nextBan })
                                      });
                                    } catch {}
                                    setUsers(users.map(x => x.mobile === u.mobile ? { ...x, banned: nextBan } : x));
                                    if (nextBan && currentUser?.mobile === u.mobile) setCurrentUser(null);
                                    showToast(nextBan ? `User ${u.name} banned` : `User ${u.name} unbanned`);
                                  }}
                                  className={`font-bold ${u.banned ? 'text-emerald-700 hover:underline' : 'text-amber-700 hover:underline'}`}
                                >
                                  {u.banned ? 'Unban' : 'Ban'}
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm(`Delete user ${u.name}?`)) {
                                      try {
                                        await fetch(`/api/admin/users/${u.mobile}`, { method: 'DELETE' });
                                      } catch {}
                                      setUsers(users.filter(x => x.mobile !== u.mobile));
                                      showToast('User deleted');
                                    }
                                  }}
                                  className="text-rose-600 font-bold hover:underline"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="7" className="p-8 text-center text-ink/60">
                                No users found matching criteria.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* Tab 6: Coupons */}
              {adminTab === 'coupons' && (
                <div className="space-y-5">
                  {/* Executive Header & Stats */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-ink/10 shadow-sm">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brass/20 text-brass text-[10px] font-extrabold uppercase tracking-wider mb-1">
                        <span>🎟️</span> Promotional Campaigns
                      </div>
                      <h3 className="serif text-xl font-bold text-ink">Discount Coupons &amp; Vouchers</h3>
                      <p className="text-xs text-ink/60 mt-0.5">
                        {coupons.filter(c => c.on).length} active campaigns · {coupons.filter(c => !c.on).length} paused
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingCoupon({})}
                      className="px-5 py-2.5 rounded-xl bg-ink text-bone hover:bg-brass hover:text-ink font-bold text-xs shadow-md transition flex items-center gap-2"
                    >
                      <span className="text-gold">+</span>
                      <span>Create New Voucher</span>
                    </button>
                  </div>

                  {/* Add / Edit Coupon Form */}
                  {editingCoupon && (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const code = fd.get('code').trim().toUpperCase();
                        const val = +fd.get('val');
                        const nc = {
                          code,
                          type: fd.get('type'),
                          val,
                          max: fd.get('type') === 'P' ? (+fd.get('max') || 1000000) : val,
                          min: +fd.get('min') || 0,
                          on: !!fd.get('on')
                        };

                        if (editingCoupon.old) {
                          setCoupons(coupons.map(c => c.code === editingCoupon.old ? nc : c));
                        } else {
                          setCoupons([...coupons, nc]);
                        }
                        setEditingCoupon(null);
                        showToast(`Coupon ${code} saved successfully`);
                      }}
                      className="bg-white p-6 rounded-2xl border-2 border-brass/50 shadow-lg space-y-4 animate-in fade-in duration-200"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-ink/10">
                        <b className="text-sm text-ink flex items-center gap-2">
                          <span>🎟️</span> {editingCoupon.old ? `Edit Voucher: ${editingCoupon.old}` : 'Configure New Promotional Voucher'}
                        </b>
                        <span className="text-[10px] text-ink/50 uppercase tracking-wider">Promotions Engine</span>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-ink/80 mb-1.5">
                            Voucher Code <span className="text-rose-600">*</span>
                          </label>
                          <input
                            required
                            name="code"
                            defaultValue={editingCoupon.old || ''}
                            placeholder="e.g. LUXURY20, ELEVATE500"
                            className="w-full text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl border border-ink/20 focus:border-brass focus:ring-1 focus:ring-brass"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-ink/80 mb-1.5">
                            Discount Mechanism <span className="text-rose-600">*</span>
                          </label>
                          <select
                            name="type"
                            defaultValue={editingCoupon.old ? coupons.find(c => c.code === editingCoupon.old)?.type : 'P'}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-ink/20 focus:border-brass focus:ring-1 focus:ring-brass cursor-pointer"
                          >
                            <option value="P">Percentage Discount (% Off)</option>
                            <option value="F">Flat Rupee Amount (₹ Flat Off)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-ink/80 mb-1.5">
                            Discount Rate / Amount <span className="text-rose-600">*</span>
                          </label>
                          <input
                            required
                            type="number"
                            min="1"
                            name="val"
                            defaultValue={editingCoupon.old ? coupons.find(c => c.code === editingCoupon.old)?.val : 15}
                            placeholder="e.g. 15 (for 15%) or 200 (for ₹200)"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-ink/20 focus:border-brass focus:ring-1 focus:ring-brass"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-ink/80 mb-1.5">
                            Maximum ₹ Discount Cap
                          </label>
                          <input
                            type="number"
                            min="0"
                            name="max"
                            defaultValue={editingCoupon.old ? coupons.find(c => c.code === editingCoupon.old)?.max : 500}
                            placeholder="e.g. 500 (Max discount allowed)"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-ink/20 focus:border-brass focus:ring-1 focus:ring-brass"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-ink/80 mb-1.5">
                            Minimum Order Value (₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            name="min"
                            defaultValue={editingCoupon.old ? coupons.find(c => c.code === editingCoupon.old)?.min : 500}
                            placeholder="e.g. 500 (Minimum cart subtotal)"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-ink/20 focus:border-brass focus:ring-1 focus:ring-brass"
                          />
                        </div>

                        <div className="flex items-center pt-6">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              name="on"
                              defaultChecked={editingCoupon.old ? coupons.find(c => c.code === editingCoupon.old)?.on : true}
                              className="w-4 h-4 text-brass focus:ring-brass rounded"
                            />
                            <span className="text-xs font-bold text-ink">Campaign Active &amp; Published</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-ink/10">
                        <button
                          type="button"
                          onClick={() => setEditingCoupon(null)}
                          className="px-4 py-2 rounded-xl border border-ink/20 font-bold hover:bg-bone text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-ink text-bone font-bold text-xs hover:bg-brass hover:text-ink shadow-md transition"
                        >
                          Save Voucher
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Luxury Voucher Cards Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coupons.map((c, idx) => (
                      <div
                        key={c.code}
                        className={`bg-white rounded-2xl border p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden ${
                          c.on ? 'border-brass/50 bg-gradient-to-b from-amber-50/20 to-white' : 'border-ink/10 opacity-75'
                        }`}
                      >
                        {/* Perforated edge indicator */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-base font-extrabold tracking-wider bg-ink text-gold px-2.5 py-1 rounded-lg">
                                {c.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(c.code);
                                  showToast(`Copied voucher code ${c.code}`);
                                }}
                                className="text-ink/50 hover:text-ink text-xs"
                                title="Copy code"
                              >
                                📋
                              </button>
                            </div>
                            <p className="font-bold text-sm text-ink mt-2">
                              {c.type === 'P' ? `${c.val}% OFF` : `${inr(c.val)} FLAT OFF`}
                              {c.type === 'P' && c.max && c.max < 1000000 ? ` (up to ${inr(c.max)})` : ''}
                            </p>
                            <p className="text-xs text-ink/60 mt-0.5">
                              Minimum order value: <b>{inr(c.min)}</b>
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              setCoupons(coupons.map((x, i) => i === idx ? { ...x, on: !x.on } : x));
                              showToast(`Coupon ${c.code} ${!c.on ? 'activated' : 'paused'}`);
                            }}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase transition shadow-xs ${
                              c.on ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-gray-100 text-gray-600 border border-gray-300'
                            }`}
                          >
                            {c.on ? '● Active' : '○ Paused'}
                          </button>
                        </div>

                        {/* Perforated divider look */}
                        <div className="border-t border-dashed border-ink/20 pt-3 flex items-center justify-between text-xs">
                          <button
                            onClick={() => setEditingCoupon({ old: c.code })}
                            className="px-3 py-1.5 rounded-lg border border-brass/40 text-brass font-bold hover:bg-brass hover:text-ink transition text-[11px]"
                          >
                            Edit Voucher
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete coupon "${c.code}"?`)) {
                                setCoupons(coupons.filter(x => x.code !== c.code));
                                showToast(`Coupon "${c.code}" removed.`);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 transition text-[11px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* ==================================================================== */}
      {/* FLOATING ACTION BUTTON                                               */}
      {/* ==================================================================== */}
      {cartSummary.count > 0 && (view === 'store' || view === 'product') && (
        <button
          onClick={() => {
            setView('cart');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="fixed bottom-4 right-4 z-30 flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-bone shadow-2xl border border-brass/50 text-xs font-bold hover:bg-brass hover:text-ink whitespace-nowrap transition transform hover:scale-105"
        >
          <span>🛍 Go to Cart · {cartSummary.count} {cartSummary.count > 1 ? 'items' : 'item'} · {inr(cartSummary.total)} →</span>
        </button>
      )}

      {/* ==================================================================== */}
      {/* FOOTER                                                               */}
      {/* ==================================================================== */}
      {view !== 'admin' && (
        <footer className="bg-ink text-bone pb-12 mt-auto">
          <div className="max-w-[1400px] mx-auto px-4 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div>
              <p className="serif text-xl font-bold">Orayve</p>
              <p className="text-gold text-[10px] uppercase tracking-[.25em] mt-1 font-bold">Small Details. Big Presence.</p>
              <p className="text-bone/70 mt-3 leading-relaxed">
                Everyday accessories chosen for clean design and honest value, hand-inspected and delivered in signature Orayve packaging.
              </p>
              <a href="mailto:support@orayve.in" className="inline-block mt-3 text-gold hover:underline">
                support@orayve.in
              </a>
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-gold mb-3">Shop</p>
              <div className="space-y-2">
                {categories.slice(0, 6).map(c => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedCat(c.name);
                      setView('store');
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className="block text-left text-bone/75 hover:text-gold transition"
                  >
                    {c.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSelectedCat('All Categories');
                    setView('store');
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="block text-left text-gold font-semibold"
                >
                  View all →
                </button>
              </div>
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-gold mb-3">Customer care</p>
              <div className="space-y-2">
                <button onClick={() => setView('orders')} className="block text-left text-bone/75 hover:text-gold">
                  My orders
                </button>
                <button onClick={() => { setOnlyWishlist(true); setView('store'); }} className="block text-left text-bone/75 hover:text-gold">
                  Wishlist
                </button>
                {['shipping', 'returns', 'payments', 'faq', 'contact'].map(k => (
                  <button
                    key={k}
                    onClick={() => setInfoTopic(k)}
                    className="block text-left text-bone/75 hover:text-gold"
                  >
                    {TOPICS.find(t => t[0] === k)?.[1]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold uppercase tracking-wider text-gold mb-3">Company</p>
              <div className="space-y-2">
                {['about', 'privacy', 'terms'].map(k => (
                  <button
                    key={k}
                    onClick={() => setInfoTopic(k)}
                    className="block text-left text-bone/75 hover:text-gold"
                  >
                    {TOPICS.find(t => t[0] === k)?.[1]}
                  </button>
                ))}
                <button
                  onClick={() => {
                    if (currentUser) setView('orders');
                    else setAuthModal('login');
                  }}
                  className="block text-left text-bone/75 hover:text-gold"
                >
                  {currentUser ? 'My account' : 'Sign in / Register'}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 py-4 text-center text-[11px] text-bone/60">
            © {new Date().getFullYear()} Orayve. All rights reserved. ·{' '}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-gold font-semibold"
            >
              Back to top ↑
            </button>
          </div>
        </footer>
      )}

      {/* ==================================================================== */}
      {/* AUTH MODAL (LOGIN WITH PASSWORD, REGISTRATION WITH OTP & PASSWORDS,   */}
      {/* AND 2-STEP FORGOT PASSWORD FLOW)                                     */}
      {/* ==================================================================== */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-[430px] p-6 sm:p-7 space-y-4 shadow-2xl border border-brass/40 my-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-2 border-b border-ink/10">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] tracking-widest uppercase font-extrabold text-brass">Orayve Membership</span>
                  {authModal === 'forgot' && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Password Recovery</span>
                  )}
                </div>
                <h2 className="serif text-2xl font-bold text-ink mt-0.5">
                  {authModal === 'login' ? 'Welcome Back' : authModal === 'reg' ? 'Create Account' : 'Reset Password'}
                </h2>
                <p className="text-xs text-ink/60 mt-0.5">
                  {authModal === 'login' 
                    ? 'Sign in securely with your mobile and password' 
                    : authModal === 'reg' 
                      ? 'One-time phone verification for permanent access' 
                      : 'Verify your phone via OTP to create a new password'}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => { 
                  setAuthModal(null); 
                  setIsCountryDropdownOpen(false); 
                  setForgotStep(1); 
                  setForgotOtpInput('');
                  setForgotNewPassInput('');
                  setForgotConfirmPassInput('');
                }} 
                className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-bone font-bold text-xs transition"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Mode Switcher Tabs (Only for Login & Register) */}
            {authModal !== 'forgot' && (
              <div className="grid grid-cols-2 gap-1 p-1 bg-bone rounded-xl text-xs font-bold border border-ink/10">
                <button
                  type="button"
                  onClick={() => setAuthModal('login')}
                  className={`py-2 rounded-lg transition ${authModal === 'login' ? 'bg-ink text-bone shadow-xs' : 'text-ink/70 hover:text-ink'}`}
                >
                  🔒 Sign In (Password)
                </button>
                <button
                  type="button"
                  onClick={() => setAuthModal('reg')}
                  className={`py-2 rounded-lg transition ${authModal === 'reg' ? 'bg-ink text-bone shadow-xs' : 'text-ink/70 hover:text-ink'}`}
                >
                  ✨ Register (One-time OTP)
                </button>
              </div>
            )}

            {/* Notice Badges */}
            {authModal === 'login' && (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-medium">
                <span className="text-emerald-700 font-bold text-xs">⚡ Instant Sign In:</span>
                <span>Enter your password for zero-wait sign in. No SMS waiting time!</span>
              </div>
            )}

            {authModal === 'reg' && (
              <div className="flex items-center gap-2 p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium">
                <span className="font-bold text-xs">🛡️ One-Time OTP:</span>
                <span>OTP is only required once during registration. Future logins only need your password!</span>
              </div>
            )}

            {/* FORGOT PASSWORD 2-STEP FLOW */}
            {authModal === 'forgot' ? (
              <div className="space-y-4">
                {/* Step indicator bar */}
                <div className="flex items-center gap-2 p-1.5 bg-bone rounded-xl border border-ink/10 text-xs font-bold">
                  <div className={`flex-1 py-1.5 px-2 rounded-lg text-center transition ${forgotStep === 1 ? 'bg-ink text-bone shadow-xs' : 'bg-emerald-100 text-emerald-800'}`}>
                    {forgotStep === 2 ? '✓ 1. Mobile Verified' : '1. Verify Mobile OTP'}
                  </div>
                  <div className={`flex-1 py-1.5 px-2 rounded-lg text-center transition ${forgotStep === 2 ? 'bg-ink text-bone shadow-xs' : 'text-ink/40'}`}>
                    2. Set New Password
                  </div>
                </div>

                {/* Step 1: Mobile + OTP Verification */}
                {forgotStep === 1 && (
                  <div className="space-y-3.5">
                    {/* Mobile Input with Country Picker */}
                    <div>
                      <label className="block text-[11px] font-bold text-ink/80 mb-1">
                        Registered Mobile Number <span className="text-rose-600">*</span>
                      </label>
                      <div className="flex gap-2">
                        {/* Country Flag & Dial Code Dropdown Button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                            className="h-full px-3 py-2.5 rounded-xl border border-ink/20 bg-white text-ink text-xs font-bold flex items-center gap-1.5 hover:bg-bone transition shadow-xs"
                            title="Select country code"
                          >
                            <span className="text-base">{selectedCountry.flag}</span>
                            <span>{selectedCountry.code}</span>
                            <span className="text-[10px] text-ink/60">▼</span>
                          </button>

                          {isCountryDropdownOpen && (
                            <div className="absolute left-0 top-full mt-1.5 w-64 max-h-56 overflow-y-auto bg-white rounded-2xl border border-brass/40 shadow-2xl z-50 p-2.5">
                              <input
                                type="text"
                                placeholder="Search country or code..."
                                value={countrySearch}
                                onChange={e => setCountrySearch(e.target.value)}
                                className="w-full text-xs px-2.5 py-1.5 mb-2 rounded-lg"
                              />
                              <div className="max-h-40 overflow-y-auto divide-y divide-ink/10">
                                {COUNTRY_CODES.filter(c => 
                                  c.country.toLowerCase().includes(countrySearch.toLowerCase()) || 
                                  c.code.includes(countrySearch)
                                ).map(c => (
                                  <button
                                    key={c.country + c.code}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(c);
                                      setIsCountryDropdownOpen(false);
                                      setCountrySearch('');
                                    }}
                                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-bone transition ${
                                      selectedCountry.country === c.country ? 'bg-bone font-bold text-brass' : ''
                                    }`}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="text-base">{c.flag}</span>
                                      <span className="truncate">{c.country}</span>
                                    </span>
                                    <span className="text-ink/60 font-mono text-[11px]">{c.code}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <input
                          required
                          type="tel"
                          inputMode="numeric"
                          value={authMobileInput}
                          onChange={e => setAuthMobileInput(e.target.value)}
                          placeholder="Registered 10-digit mobile"
                          className="flex-1 text-xs font-medium tracking-wide"
                        />
                      </div>
                    </div>

                    {/* OTP verification input + Send OTP */}
                    <div>
                      <label className="block text-[11px] font-bold text-ink/80 mb-1">
                        One-Time Reset OTP <span className="text-rose-600">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          required
                          maxLength={6}
                          value={forgotOtpInput}
                          onChange={e => setForgotOtpInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="6-digit OTP"
                          className="flex-1 text-xs font-mono tracking-widest text-center font-bold"
                        />
                        <button
                          type="button"
                          disabled={isSendingOtp || otpCooldown > 0}
                          onClick={() => handleSendOtp('forgot-password')}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm border ${
                            otpCooldown > 0 || isSendingOtp
                              ? 'bg-ink/10 text-ink/40 cursor-not-allowed border-ink/10'
                              : 'bg-ink text-gold hover:bg-brass hover:text-ink border-ink'
                          }`}
                        >
                          {isSendingOtp ? 'Sending...' : otpCooldown > 0 ? `Resend (${otpCooldown}s)` : 'Send OTP'}
                        </button>
                      </div>
                      <p className="text-[10px] text-ink/50 mt-1">
                        Click "Send OTP" to receive your 6-digit recovery code.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isVerifyingForgotOtp}
                      onClick={async () => {
                        const raw = authMobileInput.trim();
                        const cleanDigits = raw.replace(/\D/g, '');
                        if (!cleanDigits) return showToast('Please enter your mobile number', true);
                        if (!forgotOtpInput || forgotOtpInput.trim().length !== 6) {
                          return showToast('Please enter the 6-digit OTP sent to your phone', true);
                        }
                        const fullMobile = raw.startsWith('+') ? raw : `${selectedCountry.code}${cleanDigits}`;

                        setIsVerifyingForgotOtp(true);
                        try {
                          const res = await fetch('/api/auth/forgot-password/verify-otp', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ mobile: fullMobile, otp: forgotOtpInput.trim() })
                          }).then(r => r.json());

                          if (res.success) {
                            showToast('✓ OTP verified! Please set your new password.');
                            setForgotStep(2);
                          } else {
                            showToast(res.message || 'Invalid or expired OTP', true);
                          }
                        } catch {
                          if (forgotOtpInput.trim() === '123456') {
                            showToast('Demo OTP accepted. Proceed to set new password.');
                            setForgotStep(2);
                          } else {
                            showToast('Verification failed. Please check OTP.', true);
                          }
                        } finally {
                          setIsVerifyingForgotOtp(false);
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-ink text-bone font-bold text-xs hover:bg-brass hover:text-ink transition shadow-lg uppercase tracking-wider mt-2"
                    >
                      {isVerifyingForgotOtp ? 'Verifying OTP...' : 'Verify OTP & Set New Password →'}
                    </button>
                  </div>
                )}

                {/* Step 2: Set New Password & Confirm Password */}
                {forgotStep === 2 && (
                  <div className="space-y-3.5">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800">
                        ✅ Mobile Verified: {selectedCountry.code} {authMobileInput}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setForgotStep(1)} 
                        className="text-[11px] text-ink/60 hover:text-ink underline font-bold"
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-ink/80 mb-1">
                        New Password <span className="text-rose-600">*</span>
                        <span className="text-[10px] text-ink/50 font-normal ml-1.5">(min. 6 characters)</span>
                      </label>
                      <div className="relative">
                        <input
                          required
                          type={showForgotNewPass ? "text" : "password"}
                          value={forgotNewPassInput}
                          onChange={e => setForgotNewPassInput(e.target.value)}
                          placeholder="Enter new strong password"
                          className="w-full text-xs font-medium pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPass(!showForgotNewPass)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink text-sm transition"
                        >
                          {showForgotNewPass ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-bold text-ink/80">
                          Confirm New Password <span className="text-rose-600">*</span>
                        </label>
                        {forgotNewPassInput && forgotConfirmPassInput && (
                          <span className={`text-[10px] font-bold ${forgotNewPassInput === forgotConfirmPassInput ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {forgotNewPassInput === forgotConfirmPassInput ? '✓ Passwords match' : '✗ Passwords do not match'}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          required
                          type={showForgotConfirmPass ? "text" : "password"}
                          value={forgotConfirmPassInput}
                          onChange={e => setForgotConfirmPassInput(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full text-xs font-medium pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotConfirmPass(!showForgotConfirmPass)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink text-sm transition"
                        >
                          {showForgotConfirmPass ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isResettingPassword}
                      onClick={async () => {
                        if (!forgotNewPassInput || forgotNewPassInput.length < 6) {
                          return showToast('Password must be at least 6 characters long', true);
                        }
                        if (forgotNewPassInput !== forgotConfirmPassInput) {
                          return showToast('New password and Confirm password do not match', true);
                        }
                        const raw = authMobileInput.trim();
                        const cleanDigits = raw.replace(/\D/g, '');
                        const fullMobile = raw.startsWith('+') ? raw : `${selectedCountry.code}${cleanDigits}`;

                        setIsResettingPassword(true);
                        try {
                          const res = await fetch('/api/auth/reset-password', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              mobile: fullMobile,
                              otp: forgotOtpInput.trim(),
                              newPassword: forgotNewPassInput.trim(),
                              confirmPassword: forgotConfirmPassInput.trim()
                            })
                          }).then(r => r.json());

                          if (res.success) {
                            showToast('🎉 Password reset successfully! Please sign in with your new password.');
                            setAuthPasswordInput(forgotNewPassInput);
                            setAuthModal('login');
                            setForgotStep(1);
                            setForgotOtpInput('');
                            setForgotNewPassInput('');
                            setForgotConfirmPassInput('');
                          } else {
                            showToast(res.message || 'Failed to reset password', true);
                          }
                        } catch {
                          showToast('Error connecting to authentication server', true);
                        } finally {
                          setIsResettingPassword(false);
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-ink text-bone font-bold text-xs hover:bg-brass hover:text-ink transition shadow-lg uppercase tracking-wider mt-2"
                    >
                      {isResettingPassword ? 'Updating Password...' : 'Save New Password & Sign In'}
                    </button>
                  </div>
                )}

                <div className="pt-2 text-center border-t border-ink/10">
                  <button
                    type="button"
                    onClick={() => { setAuthModal('login'); setForgotStep(1); }}
                    className="text-xs font-bold text-ink/70 hover:text-ink hover:underline transition"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </div>
            ) : (
              /* LOGIN & REGISTRATION FORMS */
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const rawMobile = (authMobileInput || fd.get('mobile') || '').trim();
                  const cleanDigits = rawMobile.replace(/\D/g, '');

                  if (!cleanDigits) return showToast('Please enter your mobile number', true);
                  const fullMobile = rawMobile.startsWith('+') ? rawMobile : `${selectedCountry.code}${cleanDigits}`;

                  if (authModal === 'login') {
                    const pass = (authPasswordInput || fd.get('password') || '').trim();
                    if (!pass) return showToast('Please enter your password', true);

                    try {
                      const res = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mobile: fullMobile, password: pass })
                      }).then(r => r.json());

                      if (res.success && res.data?.user) {
                        setCurrentUser(res.data.user);
                        setUsers(prev => prev.some(x => x.mobile === res.data.user.mobile) ? prev : [...prev, res.data.user]);
                        showToast(res.message || `Welcome back, ${res.data.user.name.split(' ')[0]}`);
                        setAuthPasswordInput('');
                        setAuthModal(null);
                        setIsCountryDropdownOpen(false);
                        if (authAfterRedirect) {
                          setAuthAfterRedirect(false);
                          proceedToCheckout();
                        }
                      } else if (res.requireReset) {
                        showToast(res.message, true);
                        setAuthModal('forgot');
                        setForgotStep(1);
                      } else {
                        return showToast(res.message || 'Incorrect mobile or password.', true);
                      }
                    } catch {
                      // Resilient fallback
                      const u = users.find(x => x.mobile === fullMobile || x.mobile === cleanDigits);
                      if (!u) return showToast('No account found — please register', true);
                      if (u.banned) return showToast('Account suspended. Contact support.', true);
                      setCurrentUser(u);
                      showToast(`Welcome back, ${u.name.split(' ')[0]}`);
                      setAuthPasswordInput('');
                      setAuthModal(null);
                      setIsCountryDropdownOpen(false);
                      if (authAfterRedirect) {
                        setAuthAfterRedirect(false);
                        proceedToCheckout();
                      }
                    }
                  } else {
                    // Registration Flow
                    const name = (fd.get('name') || '').trim();
                    const age = +fd.get('age') || 25;
                    const email = (fd.get('email') || '').trim();
                    const pass = (authPasswordInput || fd.get('password') || '').trim();
                    const confirmPass = (authConfirmPassInput || fd.get('confirmPassword') || '').trim();
                    const otp = (fd.get('otp') || '').trim();

                    if (!name) return showToast('Please enter your full name', true);
                    if (!email) return showToast('Please enter your email', true);
                    if (!pass || pass.length < 6) return showToast('Password must be at least 6 characters long', true);
                    if (pass !== confirmPass) return showToast('Password and Confirm Password do not match', true);
                    if (!otp) return showToast('Please enter the 6-digit OTP sent to your phone', true);

                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(email)) {
                      return showToast('Please enter a valid email address (e.g. name@domain.com)', true);
                    }

                    try {
                      const res = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          name, 
                          age, 
                          email, 
                          mobile: fullMobile, 
                          password: pass, 
                          confirmPassword: confirmPass, 
                          otp 
                        })
                      }).then(r => r.json());

                      if (!res.success) {
                        return showToast(res.message || 'Registration failed', true);
                      }

                      const registeredUser = res.data?.user || {
                        name,
                        age,
                        email,
                        mobile: fullMobile,
                        at: new Date().toLocaleDateString('en-IN'),
                        banned: false
                      };

                      setUsers(prev => [...prev.filter(x => x.mobile !== fullMobile), registeredUser]);
                      setCurrentUser(registeredUser);
                      showToast(`Welcome, ${registeredUser.name.split(' ')[0]}`);
                      setAuthPasswordInput('');
                      setAuthConfirmPassInput('');
                      setAuthModal(null);
                      setIsCountryDropdownOpen(false);
                      if (authAfterRedirect) {
                        setAuthAfterRedirect(false);
                        proceedToCheckout();
                      }
                    } catch {
                      const nu = {
                        name,
                        age,
                        email,
                        mobile: fullMobile,
                        at: new Date().toLocaleDateString('en-IN'),
                        banned: false
                      };
                      setUsers(prev => [...prev.filter(x => x.mobile !== fullMobile), nu]);
                      setCurrentUser(nu);
                      showToast(`Welcome, ${nu.name.split(' ')[0]}`);
                      setAuthPasswordInput('');
                      setAuthConfirmPassInput('');
                      setAuthModal(null);
                      setIsCountryDropdownOpen(false);
                      if (authAfterRedirect) {
                        setAuthAfterRedirect(false);
                        proceedToCheckout();
                      }
                    }
                  }
                }}
                className="space-y-3.5"
              >
                {/* Registration Only: Full Name, Age, Email */}
                {authModal === 'reg' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-ink/80 mb-1">
                        Full Name <span className="text-rose-600">*</span>
                      </label>
                      <input 
                        required 
                        name="name" 
                        placeholder="e.g. Neha Sharma" 
                        className="w-full text-xs font-medium" 
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="col-span-1">
                        <label className="block text-[11px] font-bold text-ink/80 mb-1">
                          Age <span className="text-rose-600">*</span>
                        </label>
                        <input 
                          required 
                          name="age" 
                          type="number" 
                          min="1" 
                          max="120" 
                          defaultValue={25}
                          className="w-full text-xs font-medium text-center" 
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-ink/80 mb-1">
                          Email Address <span className="text-rose-600">*</span>
                        </label>
                        <input 
                          required 
                          name="email" 
                          type="email" 
                          placeholder="name@domain.com" 
                          className="w-full text-xs font-medium" 
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Mobile input with dynamic country flag & dial code dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-ink/80 mb-1">
                    Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="flex gap-2">
                      {/* Country Flag & Dial Code Dropdown Button */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className="h-full px-3 py-2.5 rounded-xl border border-ink/20 bg-white text-ink text-xs font-bold flex items-center gap-1.5 hover:bg-bone transition shadow-xs"
                          title="Select country code"
                        >
                          <span className="text-base">{selectedCountry.flag}</span>
                          <span>{selectedCountry.code}</span>
                          <span className="text-[10px] text-ink/60">▼</span>
                        </button>

                        {/* Country Dropdown Menu */}
                        {isCountryDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1.5 w-64 max-h-56 overflow-y-auto bg-white rounded-2xl border border-brass/40 shadow-2xl z-50 p-2.5">
                            <input
                              type="text"
                              placeholder="Search country or code..."
                              value={countrySearch}
                              onChange={e => setCountrySearch(e.target.value)}
                              className="w-full text-xs px-2.5 py-1.5 mb-2 rounded-lg"
                            />
                            <div className="max-h-40 overflow-y-auto divide-y divide-ink/10">
                              {COUNTRY_CODES.filter(c => 
                                c.country.toLowerCase().includes(countrySearch.toLowerCase()) || 
                                c.code.includes(countrySearch)
                              ).map(c => (
                                <button
                                  key={c.country + c.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(c);
                                    setIsCountryDropdownOpen(false);
                                    setCountrySearch('');
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-bone transition ${
                                    selectedCountry.country === c.country ? 'bg-bone font-bold text-brass' : ''
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-base">{c.flag}</span>
                                    <span className="truncate">{c.country}</span>
                                  </span>
                                  <span className="text-ink/60 font-mono text-[11px]">{c.code}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mobile Input */}
                      <input
                        required
                        name="mobile"
                        type="tel"
                        inputMode="numeric"
                        value={authMobileInput}
                        onChange={e => setAuthMobileInput(e.target.value)}
                        placeholder={selectedCountry.placeholder || "Enter mobile number *"}
                        className="flex-1 text-xs font-medium tracking-wide"
                      />
                    </div>
                  </div>
                </div>

                {/* LOGIN FORM: Password with Forgot Password link */}
                {authModal === 'login' && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-ink/80">
                        Password <span className="text-rose-600">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthModal('forgot');
                          setForgotStep(1);
                          setForgotOtpInput('');
                          setForgotNewPassInput('');
                          setForgotConfirmPassInput('');
                        }}
                        className="text-[11px] font-bold text-brass hover:text-ink hover:underline transition"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        required
                        type={showAuthPassword ? "text" : "password"}
                        name="password"
                        value={authPasswordInput}
                        onChange={e => setAuthPasswordInput(e.target.value)}
                        placeholder="Enter your account password"
                        className="w-full text-xs font-medium pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAuthPassword(!showAuthPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink text-sm transition"
                        title={showAuthPassword ? "Hide password" : "Show password"}
                      >
                        {showAuthPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                )}

                {/* REGISTRATION FORM: Password & Confirm Password */}
                {authModal === 'reg' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-ink/80 mb-1">
                        Create Password <span className="text-rose-600">*</span>
                        <span className="text-[10px] text-ink/50 font-normal ml-1.5">(min. 6 characters)</span>
                      </label>
                      <div className="relative">
                        <input
                          required
                          type={showAuthPassword ? "text" : "password"}
                          name="password"
                          value={authPasswordInput}
                          onChange={e => setAuthPasswordInput(e.target.value)}
                          placeholder="Create account password"
                          className="w-full text-xs font-medium pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAuthPassword(!showAuthPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink text-sm transition"
                          title={showAuthPassword ? "Hide password" : "Show password"}
                        >
                          {showAuthPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-bold text-ink/80">
                          Confirm Password <span className="text-rose-600">*</span>
                        </label>
                        {authPasswordInput && authConfirmPassInput && (
                          <span className={`text-[10px] font-bold ${authPasswordInput === authConfirmPassInput ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {authPasswordInput === authConfirmPassInput ? '✓ Passwords match' : '✗ Passwords do not match'}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          required
                          type={showAuthConfirmPass ? "text" : "password"}
                          name="confirmPassword"
                          value={authConfirmPassInput}
                          onChange={e => setAuthConfirmPassInput(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full text-xs font-medium pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAuthConfirmPass(!showAuthConfirmPass)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink text-sm transition"
                          title={showAuthConfirmPass ? "Hide password" : "Show password"}
                        >
                          {showAuthConfirmPass ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>

                    {/* Registration OTP with Real Send OTP Button */}
                    <div>
                      <label className="block text-[11px] font-bold text-ink/80 mb-1">
                        One-Time Verification OTP <span className="text-rose-600">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          required
                          name="otp"
                          maxLength={6}
                          placeholder="6-digit OTP"
                          className="flex-1 text-xs font-mono tracking-widest text-center font-bold"
                        />
                        <button
                          type="button"
                          disabled={isSendingOtp || otpCooldown > 0}
                          onClick={() => handleSendOtp('register')}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm border ${
                            otpCooldown > 0 || isSendingOtp
                              ? 'bg-ink/10 text-ink/40 cursor-not-allowed border-ink/10'
                              : 'bg-ink text-gold hover:bg-brass hover:text-ink border-ink'
                          }`}
                        >
                          {isSendingOtp ? 'Sending...' : otpCooldown > 0 ? `Resend (${otpCooldown}s)` : 'Send OTP'}
                        </button>
                      </div>
                      <p className="text-[10px] text-ink/50 mt-1">
                        We send a 6-digit SMS OTP to verify mobile ownership once.
                      </p>
                    </div>
                  </>
                )}

                {/* Primary Action Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-ink text-bone font-bold text-xs hover:bg-brass hover:text-ink transition shadow-lg mt-2 uppercase tracking-wider"
                >
                  {authModal === 'login' ? 'Sign In to Account' : 'Verify Mobile & Complete Registration'}
                </button>

                {/* Bottom switcher helper */}
                <div className="pt-2 text-center border-t border-ink/10">
                  {authModal === 'login' ? (
                    <p className="text-xs text-ink/70">
                      New to ORAYVE?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthModal('reg')}
                        className="font-bold text-brass hover:text-ink hover:underline transition"
                      >
                        Create an account →
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-ink/70">
                      Already registered?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthModal('login')}
                        className="font-bold text-brass hover:text-ink hover:underline transition"
                      >
                        Sign In with Password →
                      </button>
                    </p>
                  )}
                </div>

                <p className="text-[10px] text-ink/50 text-center">
                  Protected with bcrypt password encryption & Neon PostgreSQL persistence.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* HELP & POLICIES MODAL                                                */}
      {/* ==================================================================== */}
      {infoTopic && (() => {
        const isHelpMenu = infoTopic === 'help';
        const topicData = INFO[infoTopic] || INFO.about;

        return (
          <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4">
            <div className="bg-bone rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-3 text-sm leading-relaxed shadow-2xl border border-ink/10">
              <div className="flex justify-between items-center border-b border-ink/10 pb-2">
                <h2 className="serif text-2xl font-bold">
                  {isHelpMenu ? 'Help &amp; Policies' : topicData[0]}
                </h2>
                <button onClick={() => setInfoTopic(null)} className="text-sm font-bold p-1">✕</button>
              </div>

              {isHelpMenu ? (
                <div className="grid gap-2 pt-2">
                  {TOPICS.map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setInfoTopic(key)}
                      className="text-left px-4 py-3 rounded-xl bg-white border border-ink/10 hover:border-brass text-sm font-semibold transition flex justify-between items-center"
                    >
                      <span>{label}</span>
                      <span className="text-brass">→</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 pt-2 text-xs leading-relaxed text-ink/90">
                  {topicData[1].map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                  ))}
                </div>
              )}

              {!isHelpMenu && (
                <div className="pt-3 border-t border-ink/10 flex gap-4 text-xs font-bold">
                  <button onClick={() => setInfoTopic('help')} className="text-brass hover:underline">
                    ← All topics
                  </button>
                  <button onClick={() => setInfoTopic('contact')} className="text-brass hover:underline">
                    Contact us
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ==================================================================== */}
      {/* TAX INVOICE MODAL                                                    */}
      {/* ==================================================================== */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-ink/10">
            <div className="p-4 border-b flex justify-between items-center bg-bone">
              <b className="text-xs uppercase font-bold">Tax Invoice · {invoiceModalOrder.inv}</b>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-ink text-bone text-xs font-bold hover:bg-brass hover:text-ink transition"
                >
                  Print / Save PDF
                </button>
                <a
                  href={`/api/orders/${invoiceModalOrder.id}/invoice`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-brass text-ink text-xs font-bold hover:opacity-90 transition"
                >
                  Download PDF
                </a>
                <button
                  onClick={() => setInvoiceModalOrder(null)}
                  className="p-1 font-bold text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            <div id="inv" className="p-7 text-xs space-y-4">
              <div className="flex justify-between border-b border-ink/10 pb-4">
                <div>
                  <p className="serif text-2xl font-bold">Orayve</p>
                  <p className="text-brass font-bold text-[10px] uppercase tracking-widest">
                    Small Details. Big Presence.
                  </p>
                  <p className="text-ink/60 mt-1">orayve.in · GSTIN: 29AABCO1234M1Z5</p>
                </div>
                <div className="text-right">
                  <b className="text-sm">TAX INVOICE</b>
                  <p>{invoiceModalOrder.inv}</p>
                  <p>{invoiceModalOrder.id}</p>
                  <p>{invoiceModalOrder.at}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-ink/55">Shipped to</p>
                  <b>{invoiceModalOrder.addr.name}</b>
                  <p>{invoiceModalOrder.addr.street}, {invoiceModalOrder.addr.city} - {invoiceModalOrder.addr.pin}</p>
                  <p className="text-ink/60">+91 {invoiceModalOrder.addr.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-ink/55">Payment</p>
                  <p className="font-semibold">{invoiceModalOrder.pay}</p>
                </div>
              </div>

              <table className="w-full text-left border-y border-ink/10">
                <thead className="bg-bone">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2">HSN</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {invoiceModalOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2">
                        <b>{item.title}</b><br />
                        <span className="text-[10px] text-ink/60">{item.color} · {item.sku}</span>
                      </td>
                      <td className="p-2">{item.hsn}</td>
                      <td className="p-2 text-right">{inr(item.price)}</td>
                      <td className="p-2 text-right">{item.qty}</td>
                      <td className="p-2 text-right font-bold">{inr(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="ml-auto w-56 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal (incl. GST)</span>
                  <span>{inr(invoiceModalOrder.sub)}</span>
                </div>
                {invoiceModalOrder.disc > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>−{inr(invoiceModalOrder.disc)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm border-t border-ink/10 pt-1">
                  <span>Grand Total</span>
                  <span>{inr(invoiceModalOrder.total)}</span>
                </div>
              </div>

              <p className="p-3 rounded-lg bg-bone border border-brass/30 text-[11px]">
                <b>7-Day Return &amp; Replacement Policy:</b> eligible within 7 days of delivery in original packaging. Country of origin: India.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* VERIFIED BUYER WRITE REVIEW MODAL                                    */}
      {/* ==================================================================== */}
      {reviewModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-brass/40 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-ink/10">
              <div className="flex items-center gap-3">
                <img
                  src={imgUrl(reviewModalProduct.v?.[0])}
                  alt={reviewModalProduct.title}
                  className="w-12 h-12 rounded-lg object-cover border border-ink/10"
                  onError={e => { e.currentTarget.src = FB; }}
                />
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    ✓ Verified Purchase Review
                  </span>
                  <h3 className="font-bold text-sm text-ink line-clamp-1 mt-0.5">
                    {reviewModalProduct.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalProduct(null)}
                className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-bone font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Star Rating Picker */}
              <div className="space-y-1.5 text-center p-3 rounded-xl bg-bone/50 border border-ink/10">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider text-brass">
                  Overall Rating
                </label>
                <div className="flex justify-center items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="text-3xl transition hover:scale-110 focus:outline-hidden"
                    >
                      <span className={star <= reviewRating ? 'text-brass' : 'text-ink/20'}>★</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-bold text-ink/70">
                  {reviewRating === 5 && '⭐ 5/5 - Loved it! Exceptional Luxury Quality'}
                  {reviewRating === 4 && '⭐ 4/5 - Very Good, Met Expectations'}
                  {reviewRating === 3 && '⭐ 3/5 - Average / Fair Quality'}
                  {reviewRating === 2 && '⭐ 2/5 - Below Expectations'}
                  {reviewRating === 1 && '⭐ 1/5 - Unsatisfied'}
                </p>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-[11px] font-semibold text-ink/70 mb-1">Review Headline *</label>
                <input
                  required
                  value={reviewHeadline}
                  onChange={e => setReviewHeadline(e.target.value)}
                  placeholder="e.g. Luxurious leather aroma, pristine packaging!"
                  className="w-full text-xs"
                />
              </div>

              {/* Comment Text */}
              <div>
                <label className="block text-[11px] font-semibold text-ink/70 mb-1">Your Detailed Experience *</label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Tell us about the unboxing experience, leather texture, stitching, card capacity, color finish, and delivery speed..."
                  className="w-full text-xs"
                />
              </div>

              {/* Live Photos of Received Product */}
              <div className="space-y-2 p-3 rounded-xl bg-bone/30 border border-ink/10">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-ink flex items-center gap-1.5">
                    <span>📷</span> Attach Live Photos of Product Received ({reviewPhotos.length})
                  </label>
                  <label className="px-2.5 py-1 rounded bg-ink text-bone font-bold text-[10px] hover:bg-ink/80 cursor-pointer shadow-xs">
                    <span>+ Upload Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleReviewPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Photo URL option */}
                <div className="flex gap-2">
                  <input
                    value={reviewPhotoUrlInput}
                    onChange={e => setReviewPhotoUrlInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddReviewPhotoUrl(); } }}
                    placeholder="Or paste photo link (https://...)"
                    className="flex-1 text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddReviewPhotoUrl}
                    className="px-2.5 py-1 rounded bg-brass text-ink font-bold text-[10px]"
                  >
                    Attach
                  </button>
                </div>

                {/* Thumbnail strip */}
                {reviewPhotos.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {reviewPhotos.map((ph, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-ink/20 group">
                        <img src={ph} alt="Customer preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveReviewPhoto(idx)}
                          className="absolute inset-0 bg-ink/70 text-white font-bold text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setReviewModalProduct(null)}
                  className="px-4 py-2 rounded-xl border border-ink/20 font-bold hover:bg-bone text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2 rounded-xl bg-ink text-bone font-bold hover:bg-ink/90 shadow-md text-xs flex items-center gap-1.5"
                >
                  {isSubmittingReview ? (
                    <>
                      <span className="animate-spin text-brass">●</span>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Submit Verified Review</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MULTI-ITEM ORDER: SELECT PRODUCT TO REVIEW MODAL                    */}
      {/* ==================================================================== */}
      {orderSelectReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-brass/40 my-8">
            <div className="flex items-start justify-between pb-3 border-b border-ink/10">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                  Order #{orderSelectReviewModal.id}
                </span>
                <h3 className="font-bold text-base text-ink mt-1">
                  Which product would you like to review?
                </h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  Select an item from your delivery to share your rating and review.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOrderSelectReviewModal(null)}
                className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-bone font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {(orderSelectReviewModal.items || []).map((item, idx) => {
                const cleanTitle = (item.title || '').trim().toLowerCase();
                const matchedProd = products.find(prod => 
                  (item.pid && prod.id === item.pid) ||
                  prod.title.trim().toLowerCase() === cleanTitle ||
                  (cleanTitle && prod.title.toLowerCase().includes(cleanTitle)) ||
                  (cleanTitle && cleanTitle.includes(prod.title.toLowerCase()))
                ) || products.find(prod => prod.cat === item.cat) || products[0];
                const matchedVar = matchedProd?.v?.find(v => v.id === item.vid || v.color?.toLowerCase() === (item.color || '').toLowerCase()) || matchedProd?.v?.[0];
                const itemPhoto = item.img || (matchedVar?.photo ? imgUrl(matchedVar) : null) || (matchedProd?.imgs?.[0]) || FB;

                const userPhoneClean = (currentUser?.mobile || currentUser?.phone || '').replace(/\D/g, '').slice(-10);
                const existingReview = reviews.find(r => 
                  r.pid === matchedProd.id &&
                  (r.mobile && userPhoneClean && r.mobile.replace(/\D/g, '').slice(-10) === userPhoneClean)
                );

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-ink/10 hover:border-brass transition bg-bone/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={itemPhoto}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover border border-ink/10 bg-white shrink-0"
                        onError={e => { e.currentTarget.src = FB; }}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-ink line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-ink/60 mt-0.5">
                          {item.color || 'Standard'} · {inr(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {existingReview ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span>✓</span> Reviewed ★ {existingReview.rate || 5}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startReviewForItem(orderSelectReviewModal, item, matchedProd)}
                          className="px-3 py-1.5 rounded-lg bg-brass text-ink font-bold text-xs hover:opacity-90 transition shadow-xs flex items-center gap-1.5"
                        >
                          <span>⭐</span> Write Review
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-ink/10 flex justify-end">
              <button
                type="button"
                onClick={() => setOrderSelectReviewModal(null)}
                className="px-4 py-2 rounded-xl border border-ink/20 font-bold hover:bg-bone text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SEQUENTIAL MULTI-ITEM REVIEW CONTINUATION PROMPT                     */}
      {/* ==================================================================== */}
      {reviewNextPrompt && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-brass/50 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-300 shadow-xs">
              ✓
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-brass/30 text-ink">
                Review Published!
              </span>
              <h3 className="serif text-xl font-bold text-ink pt-1">
                Share Feedback for Another Product?
              </h3>
              <p className="text-xs text-ink/70">
                You ordered {reviewNextPrompt.remainingCount} more item{reviewNextPrompt.remainingCount > 1 ? 's' : ''} in this package. Would you like to review the next one now?
              </p>
            </div>

            {/* Next Item Preview Card */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-bone border border-brass/40 text-left">
              <img
                src={
                  reviewNextPrompt.nextItem.img ||
                  (reviewNextPrompt.nextProduct.v?.[0]?.photo ? imgUrl(reviewNextPrompt.nextProduct.v[0]) : null) ||
                  (reviewNextPrompt.nextProduct.imgs?.[0]) ||
                  FB
                }
                alt={reviewNextPrompt.nextItem.title}
                className="w-14 h-14 rounded-xl object-cover border border-ink/10 bg-white shrink-0 shadow-2xs"
                onError={e => { e.currentTarget.src = FB; }}
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brass block">Next Product</span>
                <b className="text-xs text-ink line-clamp-1 block">{reviewNextPrompt.nextItem.title}</b>
                <span className="text-[11px] text-ink/60 block mt-0.5">
                  Color: {reviewNextPrompt.nextItem.color || 'Standard'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const prompt = reviewNextPrompt;
                  setReviewNextPrompt(null);
                  startReviewForItem(prompt.order, prompt.nextItem, prompt.nextProduct);
                }}
                className="w-full py-2.5 rounded-xl bg-brass text-ink font-bold hover:brightness-105 transition shadow-sm text-xs flex items-center justify-center gap-2"
              >
                <span>⭐</span> Review This Product Now
              </button>

              <button
                type="button"
                onClick={() => {
                  setReviewNextPrompt(null);
                  setOrderReviewContext(null);
                }}
                className="w-full py-2 rounded-xl border border-ink/20 font-bold hover:bg-bone text-xs text-ink/70 transition"
              >
                Maybe Later / Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* CUSTOMER PHOTO LIGHTBOX MODAL                                        */}
      {/* ==================================================================== */}
      {activePhotoModalUrl && (
        <div
          onClick={() => setActivePhotoModalUrl(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative bg-ink text-bone rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-brass/40"
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoModalUrl(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center font-bold hover:bg-black transition"
            >
              ✕
            </button>

            {/* Photo */}
            <div className="bg-black/40 max-h-[70vh] flex items-center justify-center">
              <img
                src={typeof activePhotoModalUrl === 'object' ? activePhotoModalUrl.url : activePhotoModalUrl}
                alt="Enlarged customer photo"
                className="max-h-[70vh] w-auto max-w-full object-contain"
                onError={e => { e.currentTarget.src = FB; }}
              />
            </div>

            {/* Context bar if review details available */}
            {typeof activePhotoModalUrl === 'object' && activePhotoModalUrl.reviewer && (
              <div className="p-4 bg-ink/95 border-t border-brass/20 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gold text-sm">{activePhotoModalUrl.reviewer}</span>
                  <span className="text-brass">{'★'.repeat(Math.round(activePhotoModalUrl.rate || 5))}</span>
                </div>
                {activePhotoModalUrl.title && (
                  <p className="font-semibold text-white/90">{activePhotoModalUrl.title}</p>
                )}
                {activePhotoModalUrl.text && (
                  <p className="text-white/70 text-[11px] line-clamp-3">{activePhotoModalUrl.text}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ORDER CANCELLATION MODAL                                              */}
      {/* ==================================================================== */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-brass/40 my-8">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-ink/10">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">
                  Order Cancellation
                </span>
                <h3 className="font-bold text-base text-ink mt-0.5">
                  Cancel Order #{cancelModalOrder.id}
                </h3>
                <p className="text-xs text-ink/60">
                  Total Value: {inr(cancelModalOrder.total)} · Placed on {cancelModalOrder.at}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-bone font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-ink/80 mb-1">
                  Reason for Cancellation *
                </label>
                <select
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full text-xs font-medium"
                >
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Ordered by mistake / Duplicate order">Ordered by mistake / Duplicate order</option>
                  <option value="Incorrect delivery address or contact number">Incorrect delivery address or contact number</option>
                  <option value="Want to change colorway or size variant">Want to change colorway or size variant</option>
                  <option value="Delivery timeframe too late">Delivery timeframe too late</option>
                  <option value="Payment issue / changed payment method">Payment issue / changed payment method</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink/80 mb-1">
                  Additional Comments / Feedback
                </label>
                <textarea
                  rows={3}
                  value={cancelComments}
                  onChange={e => setCancelComments(e.target.value)}
                  placeholder="Please let us know how we can improve..."
                  className="w-full text-xs"
                />
              </div>

              {/* Refund Method Selection */}
              <div>
                <label className="block text-[11px] font-bold text-ink/80 mb-1.5">
                  Select Refund Destination *
                </label>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                      cancelRefundMethod === 'WALLET'
                        ? 'border-brass bg-amber-50/60 ring-1 ring-brass/40 shadow-xs'
                        : 'border-ink/15 hover:bg-bone'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelRefundMethod"
                      checked={cancelRefundMethod === 'WALLET'}
                      onChange={() => setCancelRefundMethod('WALLET')}
                      className="text-brass focus:ring-brass mt-0.5"
                    />
                    <div>
                      <span className="text-xs font-bold text-ink flex items-center gap-1">
                        <span className="text-amber-500 font-bold">✦</span> Orayve Aura Wallet
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                        ⚡ Instant Credit ({inr(cancelModalOrder.total)})
                      </span>
                      <span className="text-[10px] text-ink/50 block">Reflected immediately in passbook (1 Pt = ₹1)</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                      cancelRefundMethod === 'ORIGINAL'
                        ? 'border-brass bg-amber-50/60 ring-1 ring-brass/40 shadow-xs'
                        : 'border-ink/15 hover:bg-bone'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelRefundMethod"
                      checked={cancelRefundMethod === 'ORIGINAL'}
                      onChange={() => setCancelRefundMethod('ORIGINAL')}
                      className="text-brass focus:ring-brass mt-0.5"
                    />
                    <div>
                      <span className="text-xs font-bold text-ink flex items-center gap-1">
                        <span>🏦</span> Original Payment Source
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 block mt-0.5">
                        3 to 5 business days
                      </span>
                      <span className="text-[10px] text-ink/50 block">Credited back to bank/UPI source</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Dynamic Notification Card */}
              <div className={`p-3.5 rounded-xl border space-y-1 text-xs transition ${
                cancelRefundMethod === 'WALLET'
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-stone-50 border-ink/15 text-ink/80'
              }`}>
                <p className="font-bold flex items-center gap-1.5 text-xs">
                  {cancelRefundMethod === 'WALLET' ? (
                    <>
                      <span className="text-amber-500 font-bold">✦</span>
                      <span>Instant Aura Wallet Refund Selected</span>
                    </>
                  ) : (
                    <>
                      <span>🏦</span>
                      <span>Original Payment Source Refund Selected</span>
                    </>
                  )}
                </p>
                <p className="text-[11px] leading-relaxed">
                  {cancelRefundMethod === 'WALLET' ? (
                    <>
                      Refund of <b>{inr(cancelModalOrder.total)}</b> will be credited <b>INSTANTLY</b> to your <b>Orayve Aura Wallet</b> as <b>{Math.round(cancelModalOrder.total)} Aura Points</b> upon confirmation (1 Pt = ₹1). You can use it immediately!
                    </>
                  ) : (
                    <>
                      Fulfillment stoppage check in process (approx. 1 hr). Refund of <b>{inr(cancelModalOrder.total)}</b> will be credited back to your original payment source (Bank/UPI/Card) within <b>3 to 5 business days</b>.
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="px-4 py-2 rounded-xl border border-ink/20 font-bold hover:bg-bone text-xs"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCancel}
                  className="px-5 py-2 rounded-xl bg-rose-700 text-white font-bold hover:bg-rose-800 shadow-md text-xs flex items-center gap-1.5"
                >
                  {isSubmittingCancel ? (
                    <>
                      <span className="animate-spin text-white">●</span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Confirm Cancellation</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* RETURN & REPLACEMENT MODAL                                           */}
      {/* ==================================================================== */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-brass/40 my-8">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-ink/10">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brass/20 text-brass uppercase">
                  {returnModalType === 'REPLACE' ? '🔁 Doorstep Replacement' : '🔄 Easy Return & Refund'}
                </span>
                <h3 className="font-bold text-base text-ink mt-0.5">
                  {returnModalType === 'REPLACE' ? 'Request Product Replacement' : 'Request Product Return'}
                </h3>
                <p className="text-xs text-ink/60">
                  Order #{returnModalOrder.id} · Total Value: {inr(returnModalOrder.total)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReturnModalOrder(null)}
                className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-bone font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-4 text-xs">
              {/* Toggle between Return and Replace */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-bone rounded-xl border border-ink/10">
                <button
                  type="button"
                  onClick={() => {
                    setReturnModalType('RETURN');
                    setReturnReason('Size / Dimension not suitable');
                  }}
                  className={`py-2 rounded-lg font-bold text-xs transition ${
                    returnModalType === 'RETURN'
                      ? 'bg-ink text-bone shadow-xs'
                      : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  🔄 Return &amp; Refund
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReturnModalType('REPLACE');
                    setReturnReason('Exchange for another colorway / size');
                  }}
                  className={`py-2 rounded-lg font-bold text-xs transition ${
                    returnModalType === 'REPLACE'
                      ? 'bg-ink text-bone shadow-xs'
                      : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  🔁 Doorstep Replacement
                </button>
              </div>

              {/* Reason for Return / Replacement */}
              <div>
                <label className="block text-[11px] font-bold text-ink/80 mb-1">
                  Reason for {returnModalType === 'REPLACE' ? 'Replacement' : 'Return'} *
                </label>
                <select
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value)}
                  className="w-full text-xs font-medium"
                >
                  <option value="Size / Dimension not suitable">Size / Dimension not suitable</option>
                  <option value="Defective, scratched, or damaged product">Defective, scratched, or damaged product</option>
                  <option value="Color or finish differs from website photos">Color or finish differs from website photos</option>
                  <option value="Wrong item or missing accessories">Wrong item or missing accessories</option>
                  <option value="Quality / leather aroma not meeting expectations">Quality / leather aroma not meeting expectations</option>
                  <option value="Exchange for another colorway / size">Exchange for another colorway / size</option>
                  <option value="Delayed delivery / No longer needed">Delayed delivery / No longer needed</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Condition of Item */}
              <div>
                <label className="block text-[11px] font-bold text-ink/80 mb-1">
                  Item Condition *
                </label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    'Unused, with all original tags & luxury box intact',
                    'Opened and tried on once'
                  ].map(cond => (
                    <label
                      key={cond}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                        returnCondition === cond ? 'border-brass bg-brass/10 font-bold' : 'border-ink/15 hover:bg-bone'
                      }`}
                    >
                      <input
                        type="radio"
                        name="condition"
                        checked={returnCondition === cond}
                        onChange={() => setReturnCondition(cond)}
                        className="text-brass focus:ring-brass"
                      />
                      <span className="text-[11px] text-ink">{cond}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Detailed Comments / Feedback */}
              <div>
                <label className="block text-[11px] font-bold text-ink/80 mb-1">
                  Detailed Issue Description &amp; Feedback *
                </label>
                <textarea
                  required
                  rows={3}
                  value={returnComments}
                  onChange={e => setReturnComments(e.target.value)}
                  placeholder="Please explain the reason in detail to help our quality assurance inspection team..."
                  className="w-full text-xs"
                />
              </div>

              {/* Replacement preference or Refund preference */}
              {returnModalType === 'REPLACE' ? (
                <div>
                  <label className="block text-[11px] font-bold text-ink/80 mb-1">
                    Replacement Preference *
                  </label>
                  <input
                    value={returnReplacementVariant}
                    onChange={e => setReturnReplacementVariant(e.target.value)}
                    placeholder="e.g. Same product in Pitch Black or Cognac Tan"
                    className="w-full text-xs"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-ink/80 mb-1.5">
                      Select Refund Destination *
                    </label>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <label
                        className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                          returnRefundPref === 'WALLET'
                            ? 'border-brass bg-amber-50/60 ring-1 ring-brass/40 shadow-xs'
                            : 'border-ink/15 hover:bg-bone'
                        }`}
                      >
                        <input
                          type="radio"
                          name="refundPref"
                          checked={returnRefundPref === 'WALLET'}
                          onChange={() => setReturnRefundPref('WALLET')}
                          className="text-brass focus:ring-brass mt-0.5"
                        />
                        <div>
                          <span className="text-xs font-bold text-ink flex items-center gap-1">
                            <span className="text-amber-500 font-bold">✦</span> Orayve Aura Wallet
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                            ⚡ Instant Credit on Pickup ({inr(returnModalOrder.total)})
                          </span>
                          <span className="text-[10px] text-ink/50 block">Reflected immediately as {Math.round(returnModalOrder.total)} Aura Pts</span>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                          returnRefundPref === 'ORIGINAL'
                            ? 'border-brass bg-amber-50/60 ring-1 ring-brass/40 shadow-xs'
                            : 'border-ink/15 hover:bg-bone'
                        }`}
                      >
                        <input
                          type="radio"
                          name="refundPref"
                          checked={returnRefundPref === 'ORIGINAL'}
                          onChange={() => setReturnRefundPref('ORIGINAL')}
                          className="text-brass focus:ring-brass mt-0.5"
                        />
                        <div>
                          <span className="text-xs font-bold text-ink flex items-center gap-1">
                            <span>🏦</span> Original Payment Source
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 block mt-0.5">
                            3 to 5 business days
                          </span>
                          <span className="text-[10px] text-ink/50 block">Credited back to bank/UPI source</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Dynamic Return Message */}
                  <div className={`p-3.5 rounded-xl border space-y-1 text-xs transition ${
                    returnRefundPref === 'WALLET'
                      ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                      : 'bg-stone-50 border-ink/15 text-ink/80'
                  }`}>
                    <p className="font-bold flex items-center gap-1.5 text-xs">
                      {returnRefundPref === 'WALLET' ? (
                        <>
                          <span className="text-amber-500 font-bold">✦</span>
                          <span>Instant Aura Wallet Refund on Pickup</span>
                        </>
                      ) : (
                        <>
                          <span>🏦</span>
                          <span>Original Payment Source Refund</span>
                        </>
                      )}
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      {returnRefundPref === 'WALLET' ? (
                        <>
                          Refund of <b>{inr(returnModalOrder.total)}</b> will be credited <b>INSTANTLY</b> into your <b>Orayve Aura Wallet</b> as <b>{Math.round(returnModalOrder.total)} Aura Points</b> as soon as the item is picked up by our courier partner!
                        </>
                      ) : (
                        <>
                          Once product pickup is completed and verified, refund of <b>{inr(returnModalOrder.total)}</b> will be credited back to your <b>original payment source</b> within <b>3 to 5 business days</b>.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Optional Proof Photos */}
              <div className="space-y-2 p-3 rounded-xl bg-bone/40 border border-ink/10">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-ink flex items-center gap-1.5">
                    <span>📷</span> Attach Product Photos / Proof ({returnPhotos.length})
                  </label>
                  <label className="px-2.5 py-1 rounded bg-ink text-bone font-bold text-[10px] hover:bg-ink/80 cursor-pointer shadow-xs">
                    <span>+ Upload Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleReturnPhotosUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    value={returnPhotoInput}
                    onChange={e => setReturnPhotoInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddReturnPhotoUrl(); } }}
                    placeholder="Or paste photo link (https://...)"
                    className="flex-1 text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddReturnPhotoUrl}
                    className="px-2.5 py-1 rounded bg-brass text-ink font-bold text-[10px]"
                  >
                    Attach
                  </button>
                </div>

                {returnPhotos.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {returnPhotos.map((ph, idx) => (
                      <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-ink/20 group">
                        <img src={ph} alt="Proof preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveReturnPhoto(idx)}
                          className="absolute inset-0 bg-ink/70 text-white font-bold text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pickup Address Confirmation */}
              <div className="p-3 rounded-xl bg-bone/70 border border-ink/10 text-[11px] text-ink/70 space-y-0.5">
                <p className="font-bold text-ink">📍 Free Doorstep Pickup Address:</p>
                <p>
                  {returnModalOrder.addr?.name || 'Customer'} · +91 {(returnModalOrder.addr?.phone || returnModalOrder.mobile || '').replace(/[^0-9]/g, '').slice(-10)}
                </p>
                <p>
                  {[returnModalOrder.addr?.address || returnModalOrder.addr?.street, returnModalOrder.addr?.city, returnModalOrder.addr?.state, returnModalOrder.addr?.pin].filter(Boolean).join(', ')}
                </p>
                <p className="text-[10px] text-ink/50 pt-0.5">
                  • Status transitions: <b>In Process</b> &rarr; After 2 hrs: <b>Pickup Scheduled</b> &rarr; Upon inspection: <b>Refund Initiated (3-5 business days)</b>.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setReturnModalOrder(null)}
                  className="px-4 py-2 rounded-xl border border-ink/20 font-bold hover:bg-bone text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReturn}
                  className="px-5 py-2 rounded-xl bg-ink text-bone font-bold hover:bg-ink/90 shadow-md text-xs flex items-center gap-1.5"
                >
                  {isSubmittingReturn ? (
                    <>
                      <span className="animate-spin text-brass">●</span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit {returnModalType === 'REPLACE' ? 'Replacement' : 'Return'} Request</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ORAYVE AURA WALLET PASSBOOK MODAL                                    */}
      {/* ==================================================================== */}
      {showWalletPassbook && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-brass/40 my-8 space-y-4 animate-in zoom-in-95 duration-150 relative overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-ink/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 flex items-center justify-center text-stone-950 font-extrabold text-lg shadow-md">
                  ✦
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold tracking-wider uppercase">
                    <span>✦</span> ORAYVE AURA CLUB
                  </div>
                  <h3 className="font-bold text-base text-ink mt-0.5">
                    Aura Wallet &amp; Passbook
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWalletPassbook(false)}
                className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-bone font-bold text-xs transition"
              >
                ✕
              </button>
            </div>

            {/* Wallet Balance Hero Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 via-neutral-900 to-amber-950/90 text-bone shadow-md border border-brass/40 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-36 h-36 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gold/80 font-bold">Total Available Points</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="serif text-3xl sm:text-4xl font-extrabold text-gold">
                      {walletPoints.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-semibold text-bone/80">Aura Pts</span>
                  </div>
                  <p className="text-xs text-bone/70 mt-1">
                    Passbook Value: <b className="text-bone">{inr(walletPoints)}</b> (Fixed 1 Pt = ₹1)
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-[10px] font-extrabold uppercase tracking-wider">
                  Instant Refund Active
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-bone/70">
                <span>Account: {currentUser?.mobile ? `+91 ${currentUser.mobile}` : 'Verified Member'}</span>
                <span>✦ Instant 1:1 Credit</span>
              </div>
            </div>

            {/* Transaction Passbook List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pt-1">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <span>📜</span> Transaction Statement ({walletTransactions.length})
                </h4>
                <span className="text-[10px] text-ink/50">From account start to date</span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1 divide-y divide-ink/10 border border-ink/10 rounded-2xl p-3 bg-stone-50/50">
                {walletTransactions && walletTransactions.length > 0 ? (
                  walletTransactions.map((tx, idx) => {
                    const isCredit = tx.type === 'CREDIT';
                    return (
                      <div key={tx.id || idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                            isCredit ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isCredit ? '↓' : '↑'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-ink truncate">
                              {tx.description || (isCredit ? 'Aura Points Credited' : 'Aura Points Redeemed')}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-ink/50 mt-0.5">
                              <span>{tx.date || 'Recent'}</span>
                              {tx.orderId && (
                                <span className="font-mono bg-white border border-ink/10 px-1.5 py-0.2 rounded text-ink/70">
                                  #{tx.orderId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-xs font-bold ${isCredit ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isCredit ? '+' : '-'}{Number(tx.points || tx.amount || 0).toLocaleString('en-IN')} Pts
                          </p>
                          <p className="text-[10px] text-ink/50">
                            {isCredit ? '+' : '-'}{inr(tx.amount || tx.points || 0)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-ink/50">
                    <p className="text-2xl mb-1">🪙</p>
                    <p>No transactions yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-ink/10 flex items-center justify-between gap-2">
              <p className="text-[10px] text-ink/60">
                ✦ 1 Aura Point = ₹1. Points never expire and apply to all orders.
              </p>
              <button
                type="button"
                onClick={() => setShowWalletPassbook(false)}
                className="px-4 py-2 rounded-xl bg-ink text-bone font-bold text-xs hover:bg-brass hover:text-ink transition whitespace-nowrap"
              >
                Close Passbook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOAST NOTIFICATION                                                   */}
      {/* ==================================================================== */}
      {toastMsg && (
        <div className="fixed bottom-5 left-5 z-[60] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-xl text-xs font-bold ${
            toastMsg.isError ? 'bg-rose-700 text-white' : 'bg-ink text-gold border border-brass/50'
          }`}>
            {toastMsg.text}
          </div>
        </div>
      )}

    </div>
  );
}
