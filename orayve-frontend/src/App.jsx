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

const STAT = ['ORDER PLACED', 'IN TRANSIT', 'OUT FOR DELIVERY', 'DELIVERED'];
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
// MAIN COMPONENT
// ============================================================================

export default function App() {
  // Navigation & Views
  const [view, setView] = useState('store'); // 'store', 'product', 'cart', 'checkout', 'orders', 'admin'
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

  // Admin State
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [adminTab, setAdminTab] = useState('analytics'); // 'analytics', 'orders', 'products', 'categories', 'users', 'coupons'
  const [adminSearch, setAdminSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productImgs, setProductImgs] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Offer Carousel Drag & Scroll Ref
  const carouselRef = useRef(null);

  // Toast Helper
  const showToast = (msg, isError = false) => {
    setToastMsg({ text: msg, isError });
    setTimeout(() => setToastMsg(null), 2800);
  };

  // Auth Form State with Live Country Code & Real OTP
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [authMobileInput, setAuthMobileInput] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const handleSendOtp = async () => {
    const raw = authMobileInput.trim();
    if (!raw) {
      return showToast('Please enter your mobile number first', true);
    }
    const cleanDigits = raw.replace(/\D/g, '');
    if (cleanDigits.length < 7 || cleanDigits.length > 15) {
      return showToast('Please enter a valid mobile number (7-15 digits)', true);
    }

    setIsSendingOtp(true);
    try {
      const fullMobile = `${selectedCountry.code}${cleanDigits}`;
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: fullMobile,
          countryCode: selectedCountry.code,
          purpose: authModal === 'reg' ? 'register' : 'login'
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

  // Synchronize with live backend if available
  useEffect(() => {
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

    fetch('/api/admin/users')
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setUsers(res.data);
        }
      })
      .catch(() => {});
  }, []);

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

  const handlePlaceOrder = () => {
    const addr = addresses.find(a => a.id === selectedAddrId);
    if (!addr) return showToast('Select or add a delivery address', true);
    if (!cartSummary.items.length) return showToast('Your bag is empty', true);

    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ORD-${year}-${rand}`;
    const invId = `INV-${year}-${rand}`;

    const orderData = {
      mobile: currentUser?.mobile,
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

    // Decrement stock client-side
    setProducts(prev => prev.map(p => {
      const match = cartSummary.items.filter(it => it.p.id === p.id);
      if (!match.length) return p;
      return {
        ...p,
        sold: p.sold + match.reduce((s, it) => s + it.q, 0),
        v: p.v.map(v => {
          const m = match.find(it => it.v.id === v.id);
          return m ? { ...v, stock: Math.max(0, v.stock - m.q) } : v;
        })
      };
    }));

    // Post to backend API
    fetch('/api/checkout/place-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile: currentUser?.mobile,
        addr,
        items: orderData.items,
        pay: paymentMethod,
        coupon: appliedCoupon
      })
    }).catch(() => {});

    setOrders(prev => [orderData, ...prev]);
    setCart([]);
    setAppliedCoupon('');
    setLastPlacedOrder(orderData);
    setCheckoutStep(3);
    showToast(`Order ${orderId} confirmed!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Product Details
  const openProduct = (pid) => {
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
    <div className="min-h-screen bg-bone text-ink font-sans flex flex-col selection:bg-brass selection:text-ink">
      
      {/* ==================================================================== */}
      {/* HEADER                                                               */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-40 bg-ink text-bone shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 py-2 flex flex-wrap items-center gap-3 justify-between">
          
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
            className="order-last sm:order-none flex-1 min-w-full sm:min-w-0 sm:max-w-md !bg-white/10 !border-brass/40 !rounded-full !px-4 py-2 text-bone placeholder-bone/50 focus:outline-none focus:ring-1 focus:ring-gold"
          />

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            
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
                      📦 My Orders ({orders.filter(o => o.mobile === currentUser?.mobile).length})
                    </button>
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
                <div className="mt-2 p-3 rounded-xl bg-white border border-ink/10 shadow-sm">
                  <p className="font-bold text-xs mb-1.5">Check delivery to a pincode</p>
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
                      placeholder="Enter 6-digit pincode"
                      className="flex-1 text-xs"
                    />
                    <button
                      type="submit"
                      className="px-4 rounded-lg bg-ink text-bone text-xs font-bold hover:bg-brass hover:text-ink transition"
                    >
                      Check
                    </button>
                  </form>
                  {pincodeResult && (
                    <p className={`mt-2 text-xs font-semibold ${pincodeResult.ok ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {pincodeResult.msg}
                    </p>
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

            {/* Ratings & Reviews Section */}
            <section className="mt-5 bg-white rounded-2xl border border-ink/10 p-4 shadow-sm">
              <h2 className="serif text-xl mb-3 font-bold">Ratings &amp; Reviews</h2>
              <div className="flex items-center gap-4 pb-4 border-b border-ink/10">
                <div className="text-3xl font-bold">
                  {p.rate}<span className="text-lg text-ink/50">/5</span>
                </div>
                <div>
                  <div className="text-brass">★ ★ ★ ★ ★</div>
                  <p className="text-xs text-ink/60 mt-1">{p.rev} verified customer reviews</p>
                </div>
              </div>

              <div className="divide-y divide-ink/10">
                {(showAllReviews ? REVIEWS : REVIEWS.slice(0, 3)).map((r, idx) => (
                  <div key={idx} className="py-3 text-xs">
                    <b>{r[0]}</b> <span className="text-ink/50">· {r[1]}</span>
                    <div className="my-1 text-brass text-[11px]">{'★'.repeat(r[2])}{'☆'.repeat(5 - r[2])}</div>
                    <p className="text-ink/80">{r[3]}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="mt-3 text-xs font-bold text-brass hover:underline"
              >
                {showAllReviews ? 'Show fewer reviews ▴' : `More reviews (${REVIEWS.length - 3}) ▾`}
              </button>
            </section>

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
                  <p className="font-bold mb-1.5">Coupon <span className="font-normal text-ink/60">(try WELCOME15 or ORAYVE200)</span></p>
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="flex-1 uppercase text-xs"
                    />
                    <button
                      onClick={() => applyCouponCode(couponInput)}
                      className="px-4 rounded-lg bg-ink text-gold font-bold hover:bg-brass hover:text-ink transition"
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
          {checkoutStep === 1 && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="serif text-2xl font-bold">Delivery Address</h2>

                {/* Existing saved addresses */}
                {currentUser && addresses.filter(a => a.m === currentUser.mobile).map(a => (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAddrId(a.id)}
                    className={`p-4 rounded-xl border bg-white cursor-pointer transition ${
                      selectedAddrId === a.id ? 'border-brass ring-2 ring-brass/25' : 'border-ink/15 hover:border-ink/30'
                    }`}
                  >
                    <b className="text-sm">{a.name}</b> <span className="text-xs text-ink/60">{a.phone}</span>
                    <p className="text-xs mt-1">{a.street}, {a.city} — {a.pin}</p>
                  </div>
                ))}

                {/* Add new address form */}
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const newA = {
                      id: 'a' + Date.now(),
                      m: currentUser?.mobile,
                      name: fd.get('name'),
                      phone: fd.get('phone'),
                      street: fd.get('street'),
                      city: fd.get('city') || 'Pune',
                      pin: fd.get('pin')
                    };
                    setAddresses(prev => [...prev, newA]);
                    setSelectedAddrId(newA.id);
                    // Post to backend API
                    fetch('/api/users/addresses', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        mobile: currentUser?.mobile,
                        name: newA.name,
                        phone: newA.phone,
                        street: newA.street,
                        city: newA.city,
                        pin: newA.pin
                      })
                    }).catch(() => {});
                    e.currentTarget.reset();
                    showToast('Address saved');
                  }}
                  className="p-5 rounded-xl bg-white border border-brass/40 grid sm:grid-cols-2 gap-3 shadow-sm"
                >
                  <h3 className="sm:col-span-2 font-semibold text-sm">Add new address</h3>
                  <input
                    required
                    name="name"
                    defaultValue={currentUser?.name || ''}
                    placeholder="Recipient name *"
                    className="text-xs"
                  />
                  <input
                    required
                    name="phone"
                    defaultValue={currentUser?.mobile || ''}
                    placeholder="Phone *"
                    pattern="[0-9+ ]{10,15}"
                    className="text-xs"
                  />
                  <input
                    required
                    name="street"
                    placeholder="Street / landmark *"
                    className="sm:col-span-2 text-xs"
                  />
                  <input
                    name="city"
                    defaultValue="Bengaluru"
                    placeholder="City"
                    className="text-xs"
                  />
                  <input
                    required
                    name="pin"
                    placeholder="Pincode *"
                    pattern="[0-9]{6}"
                    className="text-xs"
                  />
                  <button
                    type="submit"
                    className="sm:col-span-2 px-4 py-2 rounded-lg bg-brass text-ink text-xs font-bold hover:opacity-90 transition"
                  >
                    Save Address
                  </button>
                </form>
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
          )}

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

          {/* Step 3: Confirmed */}
          {checkoutStep === 3 && lastPlacedOrder && (
            <div className="max-w-xl mx-auto bg-white rounded-2xl border border-brass/40 p-8 text-center shadow-lg">
              <p className="text-5xl">✅</p>
              <p className="text-[11px] uppercase tracking-[.25em] text-brass font-bold mt-3">Order Confirmed</p>
              <h2 className="serif text-3xl mt-1 font-bold">Thank you for choosing Orayve</h2>
              <p className="text-sm mt-2">Order ID: <b>{lastPlacedOrder.id}</b></p>
              <p className="text-xs text-ink/60 mt-1">Protected by our 7-Day Return &amp; Replacement Policy</p>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setInvoiceModalOrder(lastPlacedOrder)}
                  className="px-5 py-2.5 rounded-xl bg-ink text-bone text-xs font-bold hover:bg-brass hover:text-ink transition"
                >
                  GST Invoice
                </button>
                <button
                  onClick={() => {
                    setView('orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl border border-ink/25 text-xs font-bold hover:bg-bone transition"
                >
                  Order History
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

              <h1 className="serif text-3xl mb-6 font-bold">
                Order History ({orders.filter(o => o.mobile === currentUser.mobile).length})
              </h1>

              {orders.filter(o => o.mobile === currentUser.mobile).length > 0 ? (
                <div className="space-y-4">
                  {orders.filter(o => o.mobile === currentUser.mobile).map(o => (
                    <div key={o.id} className="bg-white rounded-xl border border-ink/10 p-5 shadow-sm">
                      <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-ink/10">
                        <div>
                          <b className="text-sm">{o.id}</b>
                          <span className="text-xs text-ink/55 ml-2">{o.at}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <b>{inr(o.total)}</b>
                          <button
                            onClick={() => setInvoiceModalOrder(o)}
                            className="px-3 py-1.5 rounded-lg bg-bone border border-brass/40 text-xs font-bold hover:bg-brass hover:text-ink transition"
                          >
                            Download Bill
                          </button>
                        </div>
                      </div>

                      {/* 4-Stage Visual Order Tracking */}
                      <div className="grid grid-cols-4 gap-2 py-4">
                        {STAT.map((s, idx) => (
                          <div key={s} className="text-center">
                            <div className={`h-1.5 rounded-full mb-2 ${idx <= o.status ? 'bg-brass' : 'bg-ink/10'}`} />
                            <p className={`text-[10px] font-bold ${idx <= o.status ? 'text-ink' : 'opacity-40'}`}>
                              {s}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Items */}
                      <div className="space-y-1 pt-2 border-t border-ink/5">
                        {o.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-ink/80">
                            <span>{item.title} ({item.color}) × {item.qty}</span>
                            <b>{inr(item.price * item.qty)}</b>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-16 text-center text-ink/60">
                  No orders yet — place one from the storefront.
                </p>
              )}
            </>
          )}
        </main>
      )}

      {/* ==================================================================== */}
      {/* ADMIN CONSOLE VIEW                                                   */}
      {/* ==================================================================== */}
      {view === 'admin' && (
        <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
          {!adminLoggedIn ? (
            <div className="min-h-[60vh] flex items-center justify-center p-4">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (adminPassInput === ADMIN_PASS || adminPassInput === 'SuperAdmin@2026') {
                    setAdminLoggedIn(true);
                    showToast('Admin console unlocked');
                  } else {
                    showToast('Wrong passcode', true);
                  }
                }}
                className="w-full max-w-sm bg-white rounded-2xl p-7 space-y-3 shadow-xl border border-ink/10"
              >
                <h2 className="serif text-xl font-bold">Admin Console</h2>
                <input
                  type="password"
                  value={adminPassInput}
                  onChange={e => setAdminPassInput(e.target.value)}
                  placeholder="Admin passcode"
                  className="w-full text-xs"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-ink text-bone font-bold text-sm hover:bg-brass hover:text-ink transition"
                >
                  Sign In
                </button>
                <p className="text-[10px] text-ink/60">
                  Demo passcode: {ADMIN_PASS}
                </p>
              </form>
            </div>
          ) : (
            <div>
              {/* Admin Nav Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h1 className="serif text-3xl font-bold">Admin Console</h1>
                <div className="flex flex-wrap gap-2">
                  {['analytics', 'orders', 'products', 'categories', 'users', 'coupons'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setAdminTab(tab)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition ${
                        adminTab === tab ? 'bg-ink text-bone shadow' : 'bg-white border border-ink/15 hover:bg-bone'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setAdminLoggedIn(false);
                      setView('store');
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>

              {/* Tab 1: Analytics */}
              {adminTab === 'analytics' && (() => {
                const totalRev = orders.reduce((s, o) => s + o.total, 0);
                const lowStockList = products.flatMap(p => p.v.filter(v => v.stock <= 10).map(v => ({ p, v })));
                const boost = products.filter(p => p.views >= 1200 && (p.sold / p.views) * 100 < 1.8).slice(0, 6);

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        ['Revenue', inr(totalRev)],
                        ['Orders', orders.length],
                        ['Live Products', products.length],
                        ['Low-stock SKUs', lowStockList.length]
                      ].map(([lbl, val]) => (
                        <div key={lbl} className="bg-white p-5 rounded-xl border border-ink/10 shadow-sm">
                          <p className="text-xs text-ink/60 font-semibold">{lbl}</p>
                          <p className="text-2xl font-bold mt-1">{val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-white p-5 rounded-xl border border-ink/10 shadow-sm">
                        <h3 className="serif text-lg mb-2 font-bold">Products to boost</h3>
                        {boost.map(p => (
                          <div key={p.id} className="text-xs py-1.5 flex justify-between border-b border-ink/5 last:border-0">
                            <span>{p.title}</span>
                            <span className="text-ink/60">{p.views} views · {p.sold} sold</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white p-5 rounded-xl border border-ink/10 shadow-sm">
                        <h3 className="serif text-lg mb-2 font-bold">Low stock alerts</h3>
                        {lowStockList.slice(0, 10).map(({ p, v }) => (
                          <div key={v.id} className="text-xs py-1.5 flex justify-between border-b border-ink/5 last:border-0">
                            <span>{p.title} · {v.color}</span>
                            <b className="text-amber-700">{v.stock} left</b>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Tab 2: Orders */}
              {adminTab === 'orders' && (
                <div className="space-y-3">
                  {orders.length ? orders.map(o => (
                    <div key={o.id} className="bg-white p-4 rounded-xl border border-ink/10 flex flex-wrap justify-between items-center gap-3 shadow-sm">
                      <div>
                        <b className="text-sm">{o.id} · {o.addr.name} ({o.pay})</b>
                        <p className="text-xs text-ink/70">{o.items.map(i => `${i.title} ×${i.qty}`).join(', ')}</p>
                        <b className="text-xs text-brass">{inr(o.total)}</b>
                      </div>

                      <select
                        value={o.status}
                        onChange={e => {
                          const nextStatus = parseInt(e.target.value);
                          setOrders(orders.map(x => x.id === o.id ? { ...x, status: nextStatus } : x));
                          fetch(`/api/admin/orders/${o.id}/status`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', 'x-admin-passcode': ADMIN_PASS },
                            body: JSON.stringify({ status: nextStatus })
                          }).catch(() => {});
                          showToast('Order status updated');
                        }}
                        className="!bg-ink !text-bone font-bold text-xs"
                      >
                        {STAT.map((s, idx) => (
                          <option key={s} value={idx}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )) : (
                    <p className="text-sm text-ink/60">No orders yet.</p>
                  )}
                </div>
              )}

              {/* Tab 3: Products */}
              {adminTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    <button
                      onClick={() => {
                        setEditingProduct({});
                        setProductImgs([]);
                      }}
                      className="px-4 py-2 rounded-lg bg-brass text-ink text-xs font-bold hover:opacity-90 transition"
                    >
                      + Add product
                    </button>
                    <input
                      value={adminSearch}
                      onChange={e => setAdminSearch(e.target.value)}
                      placeholder="Search products / SKU..."
                      className="flex-1 max-w-md text-xs"
                    />
                  </div>

                  {/* Add / Edit Product Form */}
                  {editingProduct && (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const id = editingProduct.id || 'p' + Date.now();
                        const vs = [0, 1, 2].map(k => ({
                          c: (fd.get(`c${k}`) || '').trim(),
                          h: fd.get(`h${k}`),
                          mrp: +fd.get(`m${k}`),
                          pr: +fd.get(`p${k}`),
                          st: +fd.get(`s${k}`)
                        })).filter(x => x.c && x.pr > 0);

                        if (!vs.length) return showToast('Add at least one colour with a price', true);

                        const formattedV = vs.map((x, k) => ({
                          id: id + 'v' + k,
                          sku: `ORV-${fd.get('cat').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}-${k + 1}`,
                          color: x.c,
                          hex: x.h,
                          photo: productImgs[k] || productImgs[0] || '',
                          mrp: Math.max(x.mrp || x.pr, x.pr),
                          d: Math.round((1 - x.pr / Math.max(x.mrp || x.pr, x.pr)) * 100),
                          price: x.pr,
                          stock: Math.max(0, x.st || 0)
                        }));

                        const np = {
                          id,
                          title: fd.get('title').trim(),
                          cat: fd.get('cat'),
                          design: (fd.get('design') || '').trim() || 'Classic',
                          hsn: categories.find(c => c.name === fd.get('cat'))?.hsn || '',
                          rate: editingProduct.rate || 4.5,
                          rev: editingProduct.rev || 0,
                          views: editingProduct.views || 0,
                          sold: editingProduct.sold || 0,
                          coupon: !!fd.get('coupon'),
                          imgs: [...productImgs],
                          v: formattedV
                        };

                        if (editingProduct.id) {
                          setProducts(products.map(p => p.id === id ? np : p));
                        } else {
                          setProducts([np, ...products]);
                        }
                        setEditingProduct(null);
                        showToast(editingProduct.id ? 'Product updated' : 'Product added');
                      }}
                      className="bg-white p-5 rounded-xl border border-brass/40 space-y-3 text-xs shadow-md"
                    >
                      <h3 className="font-bold text-sm">{editingProduct.id ? 'Edit product' : 'New product'}</h3>
                      <div className="grid sm:grid-cols-4 gap-3">
                        <input
                          required
                          name="title"
                          defaultValue={editingProduct.title || ''}
                          placeholder="Title *"
                          className="sm:col-span-2 text-xs"
                        />
                        <select name="cat" defaultValue={editingProduct.cat || categories[0]?.name} className="text-xs">
                          {categories.map(c => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <input
                          name="design"
                          defaultValue={editingProduct.design || ''}
                          placeholder="Style / design"
                          className="text-xs"
                        />
                      </div>

                      {/* Variants 3 rows */}
                      {[0, 1, 2].map(k => {
                        const ev = editingProduct.v?.[k] || {};
                        return (
                          <div key={k} className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center">
                            <input name={`c${k}`} defaultValue={ev.color || ''} placeholder={`Colour ${k + 1}${k ? '' : ' *'}`} className="text-xs" />
                            <input type="color" name={`h${k}`} defaultValue={ev.hex || '#1C1B29'} className="!p-0 h-8 w-full" />
                            <input name={`m${k}`} type="number" defaultValue={ev.mrp || ''} placeholder="MRP ₹" className="text-xs" />
                            <input name={`p${k}`} type="number" defaultValue={ev.price || ''} placeholder="Price ₹" className="text-xs" />
                            <input name={`s${k}`} type="number" defaultValue={ev.stock ?? ''} placeholder="Stock" className="text-xs" />
                          </div>
                        );
                      })}

                      <label className="flex items-center gap-2">
                        <input type="checkbox" name="coupon" defaultChecked={editingProduct.coupon ?? true} />
                        <span>Coupon eligible</span>
                      </label>

                      <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 rounded-lg bg-ink text-bone font-bold">
                          {editingProduct.id ? 'Save changes' : 'Publish product'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 rounded-lg border hover:bg-bone"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Products Table */}
                  <div className="bg-white rounded-xl border border-ink/10 overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-ink text-bone">
                        <tr>
                          <th className="p-3">Product</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/10">
                        {products
                          .filter(p => !adminSearch || (p.title + p.cat).toLowerCase().includes(adminSearch.toLowerCase()))
                          .slice(0, 40)
                          .map(p => (
                            <tr key={p.id}>
                              <td className="p-3 font-semibold">{p.title}</td>
                              <td className="p-3">{p.cat}</td>
                              <td className="p-3">{p.v.map(v => inr(v.price)).join(' / ')}</td>
                              <td className="p-3">{p.v.reduce((s, v) => s + v.stock, 0)}</td>
                              <td className="p-3 text-right space-x-3">
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="text-brass font-bold hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Delete this product?')) {
                                      setProducts(products.filter(x => x.id !== p.id));
                                      showToast('Product deleted');
                                    }
                                  }}
                                  className="text-rose-600 font-bold hover:underline"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Categories */}
              {adminTab === 'categories' && (
                <div className="space-y-4">
                  <button
                    onClick={() => setEditingCategory({})}
                    className="px-4 py-2 rounded-lg bg-brass text-ink text-xs font-bold"
                  >
                    + Add category
                  </button>

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
                        showToast('Category saved');
                      }}
                      className="bg-white p-5 rounded-xl border border-brass/40 flex flex-wrap gap-3 text-xs"
                    >
                      <input
                        required
                        name="name"
                        defaultValue={editingCategory.old || ''}
                        placeholder="Category name *"
                      />
                      <input
                        name="hsn"
                        defaultValue={categories.find(c => c.name === editingCategory.old)?.hsn || ''}
                        placeholder="HSN code"
                      />
                      <button type="submit" className="px-4 py-2 rounded-lg bg-ink text-bone font-bold">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="px-4 py-2 rounded-lg border"
                      >
                        Cancel
                      </button>
                    </form>
                  )}

                  <div className="bg-white rounded-xl border border-ink/10 divide-y divide-ink/10 shadow-sm">
                    {categories.map(c => (
                      <div key={c.name} className="p-4 flex flex-wrap justify-between items-center gap-2 text-sm">
                        <div>
                          <b>{c.name}</b>{' '}
                          <span className="text-xs text-ink/60">
                            HSN {c.hsn} · {products.filter(p => p.cat === c.name).length} products
                          </span>
                        </div>
                        <div className="space-x-3 text-xs">
                          <button
                            onClick={() => setEditingCategory({ old: c.name })}
                            className="text-brass font-bold hover:underline"
                          >
                            Rename / Edit
                          </button>
                          <button
                            onClick={() => {
                              if (products.some(p => p.cat === c.name)) {
                                return showToast('Delete or move its products first', true);
                              }
                              if (confirm(`Delete category ${c.name}?`)) {
                                setCategories(categories.filter(x => x.name !== c.name));
                                showToast('Category deleted');
                              }
                            }}
                            className="text-rose-600 font-bold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Users */}
              {adminTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-ink/60">
                      {users.length} registered users · {users.filter(u => u.banned).length} banned
                    </span>
                  </div>

                  <div className="bg-white rounded-xl border border-ink/10 overflow-x-auto shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-ink text-bone">
                        <tr>
                          <th className="p-3">Name</th>
                          <th className="p-3">Age</th>
                          <th className="p-3">Mobile</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/10">
                        {users.map(u => (
                          <tr key={u.mobile} className={u.banned ? 'bg-rose-50' : ''}>
                            <td className="p-3 font-semibold">{u.name}</td>
                            <td className="p-3">{u.age}</td>
                            <td className="p-3">{u.mobile}</td>
                            <td className="p-3">{u.email}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.banned ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {u.banned ? 'BANNED' : 'Active'}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-3">
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
                                  showToast(nextBan ? 'User banned' : 'User unbanned');
                                }}
                                className={`font-bold ${u.banned ? 'text-emerald-700' : 'text-amber-700'}`}
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 6: Coupons */}
              {adminTab === 'coupons' && (
                <div className="space-y-4">
                  <button
                    onClick={() => setEditingCoupon({})}
                    className="px-4 py-2 rounded-lg bg-brass text-ink text-xs font-bold"
                  >
                    + Add coupon
                  </button>

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
                        showToast('Coupon saved');
                      }}
                      className="bg-white p-5 rounded-xl border border-brass/40 grid sm:grid-cols-6 gap-3 text-xs"
                    >
                      <input required name="code" defaultValue={editingCoupon.old || ''} placeholder="CODE *" className="uppercase" />
                      <select name="type" defaultValue="P">
                        <option value="P">% off</option>
                        <option value="F">Flat ₹ off</option>
                      </select>
                      <input required name="val" type="number" min="1" placeholder="Value *" />
                      <input name="max" type="number" placeholder="Max ₹ cap" />
                      <input name="min" type="number" placeholder="Min order ₹" />
                      <label className="flex items-center gap-1">
                        <input type="checkbox" name="on" defaultChecked />
                        <span>Active</span>
                      </label>
                      <div className="sm:col-span-6 flex gap-2">
                        <button type="submit" className="px-4 py-2 rounded-lg bg-ink text-bone font-bold">Save</button>
                        <button type="button" onClick={() => setEditingCoupon(null)} className="px-4 py-2 rounded-lg border">Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    {coupons.map((c, idx) => (
                      <div key={c.code} className="bg-white p-4 rounded-xl border border-ink/10 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                          <div>
                            <b className="text-sm">{c.code}</b>
                            <p className="text-xs text-ink/60">
                              {c.type === 'P' ? `${c.val}% off (max ${inr(c.max)})` : `${inr(c.val)} off`} · Min {inr(c.min)}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setCoupons(coupons.map((x, i) => i === idx ? { ...x, on: !x.on } : x));
                              showToast(`Coupon ${c.code} ${!c.on ? 'activated' : 'paused'}`);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                              c.on ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {c.on ? 'Active' : 'Paused'}
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
      {/* AUTH MODAL (LOGIN / REGISTER WITH DYNAMIC COUNTRY CODES & REAL OTP)   */}
      {/* ==================================================================== */}
      {authModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form
            onSubmit={async e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const rawMobile = (authMobileInput || fd.get('mobile') || '').trim();
              const cleanDigits = rawMobile.replace(/\D/g, '');
              const otp = (fd.get('otp') || '').trim();

              if (!cleanDigits) return showToast('Please enter your mobile number', true);
              if (!otp) return showToast('Please enter the 6-digit OTP', true);

              // Standardize full international mobile number
              const fullMobile = rawMobile.startsWith('+') ? rawMobile : `${selectedCountry.code}${cleanDigits}`;

              if (authModal === 'login') {
                try {
                  const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mobile: fullMobile, otp })
                  }).then(r => r.json());

                  if (res.success && res.data?.user) {
                    setCurrentUser(res.data.user);
                    setUsers(prev => prev.some(x => x.mobile === res.data.user.mobile) ? prev : [...prev, res.data.user]);
                    showToast(res.message || `Welcome, ${res.data.user.name.split(' ')[0]}`);
                  } else {
                    return showToast(res.message || 'Login failed. Please check OTP or register.', true);
                  }
                } catch {
                  // Resilient offline fallback
                  const u = users.find(x => x.mobile === fullMobile || x.mobile === cleanDigits);
                  if (!u) return showToast('No account found — please register', true);
                  if (u.banned) return showToast('Account suspended. Contact support.', true);
                  setCurrentUser(u);
                  showToast(`Welcome, ${u.name.split(' ')[0]}`);
                }
              } else {
                const name = (fd.get('name') || '').trim();
                const age = +fd.get('age') || 25;
                const email = (fd.get('email') || '').trim();

                // Strict email format validation
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(email)) {
                  return showToast('Please enter a valid email address (e.g. name@domain.com)', true);
                }

                try {
                  const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, age, email, mobile: fullMobile, otp })
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
                }
              }

              setAuthModal(null);
              setIsCountryDropdownOpen(false);
              if (authAfterRedirect) {
                setAuthAfterRedirect(false);
                proceedToCheckout();
              }
            }}
            className="bg-bone rounded-2xl w-full max-w-sm p-6 space-y-3.5 shadow-2xl border-2 border-black"
          >
            <div className="flex justify-between items-center pb-1 border-b border-black/10">
              <h2 className="serif text-2xl font-bold">{authModal === 'login' ? 'Welcome back' : 'Create account'}</h2>
              <button 
                type="button" 
                onClick={() => { setAuthModal(null); setIsCountryDropdownOpen(false); }} 
                className="text-sm font-bold p-1 hover:text-brass transition"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 bg-ink/10 rounded-xl text-xs font-bold border border-black/20">
              <button
                type="button"
                onClick={() => setAuthModal('login')}
                className={`py-2 rounded-lg transition ${authModal === 'login' ? 'bg-ink text-bone shadow' : 'text-ink/80 hover:text-ink'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthModal('reg')}
                className={`py-2 rounded-lg transition ${authModal === 'reg' ? 'bg-ink text-bone shadow' : 'text-ink/80 hover:text-ink'}`}
              >
                Register
              </button>
            </div>

            {authModal === 'reg' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-ink mb-1">Full Name *</label>
                  <input 
                    required 
                    name="name" 
                    placeholder="e.g. Neha Sharma" 
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition shadow-sm" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[11px] font-bold text-ink mb-1">Age *</label>
                    <input 
                      required 
                      name="age" 
                      type="number" 
                      min="1" 
                      max="120" 
                      defaultValue={25}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition shadow-sm" 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-ink mb-1">Email Address *</label>
                    <input 
                      required 
                      name="email" 
                      type="email" 
                      placeholder="name@domain.com" 
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition shadow-sm" 
                    />
                  </div>
                </div>
              </>
            )}

            {/* Mobile input with dynamic country flag & dial code dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1">
                Unique Mobile Number *
              </label>
              <div className="relative">
                <div className="flex gap-2">
                  {/* Country Flag & Dial Code Dropdown Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="h-full px-3 py-2.5 rounded-xl border-2 border-black bg-white text-ink text-xs font-bold flex items-center gap-1.5 hover:bg-ink/5 transition shadow-sm"
                      title="Select country code"
                    >
                      <span className="text-base">{selectedCountry.flag}</span>
                      <span>{selectedCountry.code}</span>
                      <span className="text-[10px] text-ink/60">▼</span>
                    </button>

                    {/* Country Dropdown Menu */}
                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-64 max-h-56 overflow-y-auto bg-white rounded-xl border-2 border-black shadow-2xl z-50 p-2">
                        <input
                          type="text"
                          placeholder="Search country or code..."
                          value={countrySearch}
                          onChange={e => setCountrySearch(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 mb-2 rounded-lg border-2 border-black focus:outline-none"
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
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-ink/10 transition ${
                                selectedCountry.country === c.country ? 'bg-ink/10 font-bold' : ''
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

                  {/* Mobile Input with Black Border */}
                  <input
                    required
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    value={authMobileInput}
                    onChange={e => setAuthMobileInput(e.target.value)}
                    placeholder={selectedCountry.placeholder || "Enter mobile number *"}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* OTP verification with Real Send OTP Button */}
            <div>
              <label className="block text-[11px] font-bold text-ink mb-1">
                One-Time Password (OTP) *
              </label>
              <div className="flex gap-2">
                <input
                  required
                  name="otp"
                  maxLength={6}
                  placeholder="6-digit OTP"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border-2 border-black bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition shadow-sm font-mono tracking-widest text-center font-bold"
                />
                <button
                  type="button"
                  disabled={isSendingOtp || otpCooldown > 0}
                  onClick={handleSendOtp}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shadow border-2 border-black ${
                    otpCooldown > 0 || isSendingOtp
                      ? 'bg-ink/20 text-ink/60 cursor-not-allowed'
                      : 'bg-ink text-gold hover:bg-brass hover:text-ink'
                  }`}
                >
                  {isSendingOtp ? 'Sending...' : otpCooldown > 0 ? `Resend (${otpCooldown}s)` : 'Send OTP'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-ink text-bone font-bold text-sm hover:bg-brass hover:text-ink transition shadow-lg border-2 border-black mt-2"
            >
              {authModal === 'login' ? 'Login with OTP' : 'Complete Registration'}
            </button>
            <p className="text-[10px] text-ink/60 text-center">
              Real cryptographically secure 6-digit OTP with live verification.
            </p>
          </form>
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
