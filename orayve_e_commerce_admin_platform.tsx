import React, { useState, useMemo } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Lock,
  X,
  Plus,
  Minus,
  Trash2,
  Share2,
  Star,
  Check,
  MapPin,
  CreditCard,
  Smartphone,
  Building2,
  FileText,
  Printer,
  Package,
  Truck,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Tag,
  ShieldCheck,
  LogOut,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Navigation,
} from 'lucide-react';

// ============================================================================
// 1. CURATED REAL PHOTOGRAPHY & 260-PRODUCT CATALOG GENERATOR (13 x 20)
// ============================================================================

const CATEGORY_CONFIGS = [
  {
    name: 'Wallets',
    hsn: '42023120',
    skuPrefix: 'WLT',
    basePrice: 899,
    materials: ['Full-Grain Leather', 'Saffiano Leather', 'Vegetable-Tanned Leather', 'Vegan Pebble Leather'],
    designs: ['Bifold', 'Slim Cardholder', 'Zip-Around', 'RFID Minimalist'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Atelier Stitched Bifold Wallet', 'Vanguard RFID Slim Cardholder', 'Sovereign Zip-Around Wallet',
      'Monolith Magnetic Money Clip', 'Heritage Trifold Leather Wallet', 'Noir Carbon-Weave Card Case',
      'Kensington Long Coat Wallet', 'Aurelia Coin-Pouch Bifold', 'Verona Saddle-Stitch Wallet',
      'Meridian Travel Passport Wallet', 'Oslo Minimalist 4-Slot Sleeve', 'Savile Textured Checkbook Wallet',
      'Cognac Burnished Everyday Bifold', 'Imperial Brass-Corner Wallet', 'Solstice Pull-Tab Cardholder',
      'Regent Dual-Note Executive Wallet', 'Caspian Pebbled Zip Card Case', 'Echelon Snap-Closure Pocket Wallet',
      'Valet Front-Pocket Slim Wallet', 'Bespoke Monogrammed Billfold',
    ],
    swatches: [
      { name: 'Pitch Black', hex: '#1C1B29' },
      { name: 'Cognac Tan', hex: '#8B5A2B' },
      { name: 'Emerald Green', hex: '#1E4D3B' },
    ],
  },
  {
    name: "Men's Belts",
    hsn: '42033000',
    skuPrefix: 'MBL',
    basePrice: 1199,
    materials: ['Full-Grain Leather', 'Italian Calfskin', 'Brushed Suede', 'Woven Leather'],
    designs: ['Formal Buckle', 'Reversible', 'Braided', 'Ratchet Auto-Lock'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Heritage Antique Brass Buckle Belt', 'Savile Reversible Formal Belt', 'Tuscany Hand-Braided Leather Belt',
      'Monarch Suede Dress Belt', 'Apex Ratchet Micro-Adjust Belt', 'Kensington Stitched Chino Belt',
      'Noir Matte-Gunmetal Buckle Belt', 'Sovereign Croc-Embossed Belt', 'Verona Double-Keeper Belt',
      'Oxford Burnished Edge Belt', 'Caspian Casual Canvas-Trim Belt', 'Regent Bridle Leather Belt',
      'Vanguard Roller-Buckle Belt', 'Meridian Heavyweight Jean Belt', 'Oslo Minimalist Plaque Belt',
      'Imperial Two-Tone Leather Belt', 'Valet Woven Elasticated Belt', 'Echelon Satin-Nickel Dress Belt',
      'Atelier Hand-Painted Leather Belt', 'Bespoke Classic 35mm Belt',
    ],
    swatches: [
      { name: 'Espresso Brown', hex: '#4A3123' },
      { name: 'Pitch Black', hex: '#1C1B29' },
      { name: 'Saddle Tan', hex: '#9C6B3B' },
    ],
  },
  {
    name: 'Bags & Backpacks',
    hsn: '42029200',
    skuPrefix: 'BAG',
    basePrice: 2499,
    materials: ['Waxed Canvas & Leather', 'Full-Grain Leather', 'Ballistic Nylon', 'Textured Vegan Leather'],
    designs: ['Commuter Backpack', 'Laptop Briefcase', 'Weekender Duffle', 'Messenger'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Nomad Waxed Canvas Backpack', 'Executive 16-Inch Leather Briefcase', 'Sovereign Weekender Duffle Bag',
      'Courier Vintage Leather Messenger', 'Aero Slim Tech Commuter Pack', 'Meridian Roll-Top Travel Pack',
      'Kensington Structured Portfolio', 'Vanguard Water-Resistant Rucksack', 'Oslo Minimalist Daypack',
      'Atelier Overnight Holdall', 'Caspian Crossbody Chest Sling', 'Regent Cabin Trolley Sleeve Bag',
      'Monolith Hard-Shell Laptop Pack', 'Verona Suede-Trim Tote Pack', 'Imperial Gym-to-Office Duffle',
      'Valet Convertible Brief-Backpack', 'Echelon Camera & Tech Pack', 'Savile Heritage Satchel',
      'Noir Matte Nylon Travel Pack', 'Bespoke Leather Garment Duffle',
    ],
    swatches: [
      { name: 'Olive Charcoal', hex: '#464C3F' },
      { name: 'Ink Navy', hex: '#1C1B29' },
      { name: 'Espresso', hex: '#4A3123' },
    ],
  },
  {
    name: 'Handbags',
    hsn: '42022290',
    skuPrefix: 'HBG',
    basePrice: 2199,
    materials: ['Textured Vegan Leather', 'Saffiano Leather', 'Supple Nappa', 'Quilted Leather'],
    designs: ['Structured Tote', 'Top-Handle Sling', 'Evening Clutch', 'Crossbody'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Monolith Structured Top-Handle Sling', 'Aurelia Executive Work Tote', 'Celeste Quilted Chain Crossbody',
      'Sovereign Brass-Clasp Evening Clutch', 'Verona Slouchy Hobo Bag', 'Solstice Mini Bucket Bag',
      'Kensington Saddle Shoulder Bag', 'Noir Croc-Effect Satchel', 'Oslo Minimalist Baguette Bag',
      'Regent Dual-Zip Camera Crossbody', 'Atelier Pleated Wristlet Pouch', 'Meridian Reversible Shopper Tote',
      'Caspian Gold-Hardware Dome Bag', 'Valet Convertible Belt-Sling', 'Imperial Velvet Potli Clutch',
      'Echelon Structured Trapezoid Bag', 'Savile Woven Leather Shoulder Bag', 'Vanguard Everyday Carryall',
      'Lumina Pearl-Handle Mini Bag', 'Bespoke Crescent Moon Bag',
    ],
    swatches: [
      { name: 'Midnight Navy', hex: '#1F2D42' },
      { name: 'Warm Bone', hex: '#E8E0D2' },
      { name: 'Burgundy Wine', hex: '#5E2129' },
    ],
  },
  {
    name: 'Rings',
    hsn: '71171990',
    skuPrefix: 'RNG',
    basePrice: 549,
    materials: ['316L Stainless Steel', '18K Gold-Plated Brass', 'Sterling Silver', 'Brushed Titanium'],
    designs: ['Minimalist Band', 'Signet', 'Stackable', 'Solitaire'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Orayve Signature Brushed Band Ring', 'Sovereign Cushion Signet Ring', 'Aurelia Triple Stackable Ring Set',
      'Celeste Solitaire Zirconia Ring', 'Noir Matte-Black Titanium Band', 'Solstice Twisted Rope Ring',
      'Verona Domed Croissant Ring', 'Kensington Beveled Edge Band', 'Regent Open Adjustable Cuff Ring',
      'Caspian Hammered Texture Ring', 'Atelier Couple Promise Band', 'Meridian Geometric Hex Ring',
      'Oslo Thin Pavé Eternity Band', 'Imperial Emerald-Cut Cocktail Ring', 'Valet Vintage Coin Signet',
      'Echelon Interlocking Link Ring', 'Savile Engraved Roman Band', 'Vanguard Grooved Center Ring',
      'Lumina Pearl Accent Midi Ring', 'Bespoke Satin-Finish Thumb Ring',
    ],
    swatches: [
      { name: 'Brushed Brass', hex: '#B8905C' },
      { name: 'Sterling Silver', hex: '#C0C5CE' },
      { name: 'Obsidian Ink', hex: '#1C1B29' },
    ],
  },
  {
    name: 'Chains & Necklaces',
    hsn: '71171910',
    skuPrefix: 'CHN',
    basePrice: 799,
    materials: ['18K Gold-Plated Steel', '316L Stainless Steel', 'Sterling Silver', 'Rose Gold Plated'],
    designs: ['Layered Link', 'Cuban Curb', 'Rope Chain', 'Minimalist Pendant'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Solstice Layered Link Necklace', 'Vanguard 5mm Cuban Curb Chain', 'Aurelia Diamond-Cut Rope Chain',
      'Celeste Compass Medallion Pendant', 'Sovereign Italian Figaro Chain', 'Noir Dog-Tag Bar Pendant',
      'Verona Herringbone Snake Chain', 'Kensington Box-Link Everyday Chain', 'Regent Pearl Drop Choker',
      'Caspian Paperclip Toggle Necklace', 'Atelier Minimalist Heart Pendant', 'Meridian Wheat-Link Chain',
      'Oslo Delicate Tennis Choker', 'Imperial Byzantine Heavy Chain', 'Valet North-Star Coin Necklace',
      'Echelon Dual-Tone Mariner Chain', 'Savile Polished Franco Chain', 'Lumina Freshwater Pearl Strand',
      'Monolith Geometric Onyx Pendant', 'Bespoke Adjustable Lariat Chain',
    ],
    swatches: [
      { name: 'Champagne Gold', hex: '#D6B98C' },
      { name: 'Rose Gold', hex: '#D49B8B' },
      { name: 'Polished Steel', hex: '#B8BDC4' },
    ],
  },
  {
    name: 'Shoes',
    hsn: '64039990',
    skuPrefix: 'SHO',
    basePrice: 3299,
    materials: ['Full-Grain Calfskin', 'Brushed Suede', 'Nappa Leather', 'Patent Leather'],
    designs: ['Oxford Formal', 'Penny Loafer', 'Chelsea Boot', 'Minimalist Sneaker'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Savile Cap-Toe Leather Oxford', 'Heritage Hand-Stitched Penny Loafer', 'Kensington Suede Chelsea Boot',
      'Noir Minimalist Court Sneaker', 'Sovereign Double Monk-Strap Shoe', 'Verona Burnished Wingtip Brogue',
      'Oslo Pebble-Grain Driving Moccasin', 'Regent Wholecut Evening Oxford', 'Caspian Lug-Sole Derby Shoe',
      'Atelier Tassel Velvet Loafer', 'Meridian Chukka Desert Boot', 'Vanguard Knit-Trim Runner',
      'Imperial Patent Tuxedo Derby', 'Valet Slip-On Espadrille Loafer', 'Echelon High-Top Leather Sneaker',
      'Monolith Square-Toe Dress Boot', 'Solstice Woven Mule Loafer', 'Aurelia Pointed-Toe Block Heel',
      'Celeste Slingback Kitten Heel', 'Bespoke Goodyear-Welted Brogue',
    ],
    swatches: [
      { name: 'Espresso Brown', hex: '#4A3123' },
      { name: 'Pitch Black', hex: '#1C1B29' },
      { name: 'Warm Bone', hex: '#E8E0D2' },
    ],
  },
  {
    name: 'Sandals',
    hsn: '64039920',
    skuPrefix: 'SND',
    basePrice: 1499,
    materials: ['Vegetable-Tanned Leather', 'Soft Suede', 'Cork & Leather', 'Woven Leather'],
    designs: ['Strappy Leather', 'Fisherman', 'Kolhapuri Craft', 'Buckled Slide'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Verona Dual-Buckle Cork Sandal', 'Heritage Handcrafted Kolhapuri', 'Caspian Woven Fisherman Sandal',
      'Aurelia Strappy Grecian Flat', 'Oslo Contoured Leather Slide', 'Solstice Crisscross Toe-Ring Sandal',
      'Kensington Cushioned Resort Mule', 'Noir Matte-Leather Recovery Slide', 'Sovereign Ankle-Strap Dress Sandal',
      'Regent Braided T-Strap Sandal', 'Atelier Brass-Studded Flat Slide', 'Meridian Padded Quilted Slide',
      'Vanguard Outdoor Trek Leather Sandal', 'Imperial Metallic-Trim Festive Flat', 'Valet Slip-On Suede Clog',
      'Echelon Slingback Wedge Sandal', 'Savile Minimalist Thong Sandal', 'Lumina Pearl-Embellished Flat',
      'Monolith Square-Toe Heeled Sandal', 'Bespoke Saddle-Stitch Chappal',
    ],
    swatches: [
      { name: 'Saddle Tan', hex: '#9C6B3B' },
      { name: 'Pitch Black', hex: '#1C1B29' },
      { name: 'Warm Bone', hex: '#E8E0D2' },
    ],
  },
  {
    name: 'Ladies Belts',
    hsn: '42033000',
    skuPrefix: 'LBL',
    basePrice: 849,
    materials: ['Supple Nappa Leather', '18K Gold-Plated Chain', 'Textured Vegan Leather', 'Velvet & Brass'],
    designs: ['Skinny Brass Buckle', 'Waist Cinch', 'Chain Belt', 'Corset Leather'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Aurelia Skinny Brass-Buckle Belt', 'Celeste Interlocking-Ring Waist Belt', 'Solstice Gold Chain Link Belt',
      'Verona Wide Leather Corset Belt', 'Lumina Pearl-Clasp Saree Belt', 'Oslo Minimalist Knot Tie Belt',
      'Noir Double-O Buckle Jean Belt', 'Sovereign Croc-Embossed Cinch Belt', 'Atelier Sculpted Gold-Bar Belt',
      'Kensington Reversible Slim Belt', 'Regent Braided Boho Waist Belt', 'Caspian Elasticated Dress Cinch',
      'Meridian D-Ring Trench Belt', 'Valet Suede Wrap Obi Belt', 'Imperial Crystal-Buckle Evening Belt',
      'Echelon Asymmetric Buckle Belt', 'Savile Studded Rocker Slim Belt', 'Vanguard Saddle-Stitch Trouser Belt',
      'Monolith Square-Frame Buckle Belt', 'Bespoke Monogrammed Waist Belt',
    ],
    swatches: [
      { name: 'Antique Brass', hex: '#B8905C' },
      { name: 'Pitch Black', hex: '#1C1B29' },
      { name: 'Warm Bone', hex: '#E8E0D2' },
    ],
  },
  {
    name: 'Ties',
    hsn: '62151000',
    skuPrefix: 'TIE',
    basePrice: 799,
    materials: ['100% Mulberry Silk', 'Knitted Merino Wool', 'Silk Jacquard', 'Grenadine Silk'],
    designs: ['Classic 8cm', 'Slim 6cm', 'Knitted Square-End', 'Jacquard Paisley'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Savile Midnight Silk Jacquard Tie', 'Kensington Knitted Merino Wool Tie', 'Noir Satin Slim Formal Tie',
      'Sovereign Royal Paisley Silk Tie', 'Heritage Textured Grenadine Tie', 'Regent Regimental Stripe Tie',
      'Oslo Micro-Dot Business Tie', 'Verona Herringbone Cashmere-Blend Tie', 'Atelier Seven-Fold Luxury Tie',
      'Caspian Geometric Medallion Tie', 'Meridian Matte Linen Summer Tie', 'Vanguard Velvet Evening Bow Tie',
      'Imperial Gold-Thread Wedding Tie', 'Valet Houndstooth Woven Tie', 'Echelon Twill Solid Boardroom Tie',
      'Monolith Charcoal Pinstripe Tie', 'Solstice Floral Botanical Silk Tie', 'Aurelia Champagne Satin Tie',
      'Celeste Polka-Dot Heritage Tie', 'Bespoke Tie & Pocket Square Set',
    ],
    swatches: [
      { name: 'Ink Navy', hex: '#1C1B29' },
      { name: 'Burgundy Wine', hex: '#5E2129' },
      { name: 'Emerald Green', hex: '#1E4D3B' },
    ],
  },
  {
    name: 'Socks',
    hsn: '61159500',
    skuPrefix: 'SCK',
    basePrice: 399,
    materials: ['Combed Egyptian Cotton', 'Merino Wool', 'Bamboo Fiber', 'Mercerized Cotton'],
    designs: ['Ribbed Dress Crew', 'No-Show Loafer', 'Heritage Argyle', 'Cushioned Athletic'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Savile Ribbed Combed Cotton Dress Socks', 'Oslo Invisible No-Show Loafer Socks', 'Kensington Merino Wool Thermal Crew',
      'Heritage Classic Argyle Dress Socks', 'Atelier Bamboo Anti-Odor Executive Socks', 'Noir Mercerized Over-The-Calf Socks',
      'Verona Pinstripe Boardroom Socks', 'Caspian Micro-Dot Gift Box (Pack of 3)', 'Regent Herringbone Formal Socks',
      'Meridian Cushioned Arch-Support Crew', 'Vanguard Breathable Mesh Ankle Socks', 'Sovereign Cashmere-Blend Lounge Socks',
      'Valet Houndstooth Patterned Socks', 'Echelon Seamless-Toe Formal Socks', 'Monolith Solid Essential Pack (3 Pairs)',
      'Solstice Waffle-Knit Boot Socks', 'Aurelia Sheer-Ribbed Ankle Socks', 'Celeste Pastel Combed Cotton Crew',
      'Imperial Silk-Blend Tuxedo Socks', 'Bespoke Monogrammed Gift Socks',
    ],
    swatches: [
      { name: 'Ink Navy', hex: '#1C1B29' },
      { name: 'Charcoal Grey', hex: '#4A4A4F' },
      { name: 'Warm Bone', hex: '#E8E0D2' },
    ],
  },
  {
    name: 'Ladies Wrist Watches',
    hsn: '91021100',
    skuPrefix: 'LWT',
    basePrice: 2899,
    materials: ['316L Stainless Steel', '18K Gold-Plated Mesh', 'Mother-of-Pearl & Steel', 'Italian Leather Strap'],
    designs: ['Petite Mesh', 'Rectangular Tank', 'Bangle Dress', 'Minimalist Leather'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Aurelia Petite Gold Milanese Mesh Watch', 'Celeste Mother-of-Pearl Dial Watch', 'Solstice Rose-Gold Bangle Watch',
      'Verona Rectangular Heritage Tank Watch', 'Lumina Crystal-Bezel Dress Watch', 'Oslo Ultra-Thin Leather Strap Watch',
      'Noir Sunburst Emerald-Dial Watch', 'Sovereign Two-Tone Jubilee Watch', 'Atelier Roman-Numeral Classic Watch',
      'Kensington Oval Vintage Cocktail Watch', 'Regent Ceramic White Minimalist Watch', 'Caspian Moonphase Petite Watch',
      'Meridian Square Gold-Link Watch', 'Valet Interchangeable-Strap Watch Set', 'Imperial Guilloché Dial Dress Watch',
      'Echelon Starlight Aventurine Watch', 'Savile Cushion-Case Leather Watch', 'Vanguard Water-Resistant Sport Chic',
      'Monolith Matte-Black Mesh Watch', 'Bespoke Dual-Time Travel Watch',
    ],
    swatches: [
      { name: 'Champagne Gold', hex: '#D6B98C' },
      { name: 'Rose Gold', hex: '#D49B8B' },
      { name: 'Polished Silver', hex: '#C0C5CE' },
    ],
  },
  {
    name: 'Gents Wrist Watches',
    hsn: '91021100',
    skuPrefix: 'GWT',
    basePrice: 3499,
    materials: ['316L Stainless Steel', 'Sapphire Glass & Leather', 'Brushed Titanium', 'Ceramic Bezel & Steel'],
    designs: ['Chronograph', 'Automatic Diver', 'Dress Leather', 'Field Mechanical'],
    fallbackPhoto: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    photos: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=600&q=80',
    ],
    types: [
      'Chrono 01 Brass & Leather Watch', 'Sovereign 200M Automatic Diver', 'Savile Ultra-Slim Dress Leather Watch',
      'Kensington Steel Sunburst Blue-Dial', 'Vanguard Tactical Field Watch', 'Noir Stealth Matte Chronograph',
      'Heritage Open-Heart Skeleton Watch', 'Meridian GMT Dual-Time Aviator', 'Oslo Bauhaus Minimalist Date Watch',
      'Caspian Racing Tachymeter Chrono', 'Regent Moonphase Calendar Watch', 'Atelier Titanium Lightweight Watch',
      'Verona Cushion-Case Vintage Diver', 'Imperial Gold-Case Tuxedo Watch', 'Valet Panda-Dial Heritage Chrono',
      'Echelon Integrated-Bracelet Sport Watch', 'Monolith Square-Case Automatic', 'Solstice Pilot Big-Crown Watch',
      'Aurelia Green-Dial Jubilee Watch', 'Bespoke Collector Edition Automatic',
    ],
    swatches: [
      { name: 'Brass & Black', hex: '#B8905C' },
      { name: 'Steel & Navy', hex: '#2B4570' },
      { name: 'Obsidian Matte', hex: '#1C1B29' },
    ],
  },
];

// Programmatically build 260 distinct, deterministic products (13 categories x 20 types)
function generateCatalog() {
  const catalog = [];
  let counter = 1;

  CATEGORY_CONFIGS.forEach((cat, catIdx) => {
    cat.types.forEach((title, typeIdx) => {
      const id = `p_${counter}`;
      const materialType = cat.materials[typeIdx % cat.materials.length];
      const designStyle = cat.designs[typeIdx % cat.designs.length];
      const basePhoto = cat.photos[typeIdx % cat.photos.length];
      const priceStep = (typeIdx % 6) * 150;
      const salePrice = cat.basePrice + priceStep;
      const discountPercent = 20 + ((typeIdx * 7) % 21); // 20% to 40%
      const mrp = Math.round(salePrice / (1 - discountPercent / 100));
      const rating = Number((4.4 + ((catIdx + typeIdx) % 7) * 0.1).toFixed(1));
      const reviewCount = 24 + ((counter * 17) % 210);
      const viewCount = 450 + ((counter * 131) % 2100);
      const unitsSold = typeIdx % 5 === 0 ? 12 + (typeIdx % 8) : 35 + ((counter * 13) % 140);

      const variants = cat.swatches.map((sw, sIdx) => ({
        id: `${id}_v${sIdx + 1}`,
        sku: `ORV-${cat.skuPrefix}-${String(typeIdx + 1).padStart(2, '0')}-${sIdx + 1}`,
        colorName: sw.name,
        colorHex: sw.hex,
        photoUrl: cat.photos[(typeIdx + sIdx) % cat.photos.length],
        mrp: mrp + sIdx * 50,
        discountPercent,
        salePrice: salePrice + sIdx * 50,
        stock: (counter + sIdx * 3) % 14 === 0 ? 6 : 18 + ((counter * 5 + sIdx * 7) % 48),
      }));

      catalog.push({
        id,
        title,
        category: cat.name,
        materialType,
        designStyle,
        hsnCode: cat.hsn,
        countryOfOrigin: 'China',
        returnPolicyDays: 7,
        isCouponApplicable: typeIdx % 6 !== 0,
        rating: Math.min(5.0, rating),
        reviewCount,
        viewCount,
        unitsSold,
        fallbackPhoto: cat.fallbackPhoto,
        description: `Crafted in ${materialType.toLowerCase()} with a ${designStyle.toLowerCase()} silhouette. Hand-inspected prior to dispatch in signature Orayve Ink & Brass packaging.`,
        variants,
      });

      counter += 1;
    });
  });

  return catalog;
}

const INITIAL_PRODUCTS = generateCatalog(); // Exactly 260 products
const CATEGORY_NAMES = ['All Categories', ...CATEGORY_CONFIGS.map((c) => c.name)];
const ORDER_STATUSES = ['ORDER_PLACED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const INITIAL_COUPONS = [
  { id: 'c1', code: 'WELCOME15', type: 'PERCENTAGE', value: 15, maxDiscount: 500, minOrder: 500, active: true },
  { id: 'c2', code: 'ORAYVE200', type: 'FLAT', value: 200, maxDiscount: 200, minOrder: 999, active: true },
];

const INITIAL_ADDRESSES = [
  {
    id: 'addr1',
    label: 'Home',
    recipientName: 'Ankit Prajapati',
    phone: '+91 9876543210',
    street: 'Flat 402, Crest Residency, Laxmi Chowk',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411057',
    lat: 18.5913,
    lng: 73.7389,
    isDefault: true,
  },
  {
    id: 'addr2',
    label: 'Office',
    recipientName: 'Ankit Prajapati',
    phone: '+91 9876543210',
    street: 'Tower B, Hinjewadi Phase 2 IT Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411057',
    lat: 18.5904,
    lng: 73.7073,
    isDefault: false,
  },
];

const INITIAL_ORDERS = [
  {
    orderId: 'ORD-2026-841029',
    invoiceNumber: 'INV-2026-841029',
    createdAt: '16 Nov 2026, 2:22 pm',
    customerName: 'Ankit Prajapati',
    customerEmail: 'ankit@example.com',
    customerPhone: '+91 9876543210',
    status: 'IN_TRANSIT',
    paymentMethod: 'UPI',
    couponCode: 'WELCOME15',
    subtotal: 3098,
    discount: 465,
    total: 2633,
    address: INITIAL_ADDRESSES[0],
    items: [
      {
        productId: INITIAL_PRODUCTS[0].id,
        title: INITIAL_PRODUCTS[0].title,
        category: INITIAL_PRODUCTS[0].category,
        colorName: INITIAL_PRODUCTS[0].variants[0].colorName,
        sku: INITIAL_PRODUCTS[0].variants[0].sku,
        hsnCode: INITIAL_PRODUCTS[0].hsnCode,
        mrp: INITIAL_PRODUCTS[0].variants[0].mrp,
        salePrice: INITIAL_PRODUCTS[0].variants[0].salePrice,
        qty: 1,
      },
      {
        productId: INITIAL_PRODUCTS[60].id,
        title: INITIAL_PRODUCTS[60].title,
        category: INITIAL_PRODUCTS[60].category,
        colorName: INITIAL_PRODUCTS[60].variants[0].colorName,
        sku: INITIAL_PRODUCTS[60].variants[0].sku,
        hsnCode: INITIAL_PRODUCTS[60].hsnCode,
        mrp: INITIAL_PRODUCTS[60].variants[0].mrp,
        salePrice: INITIAL_PRODUCTS[60].variants[0].salePrice,
        qty: 1,
      },
    ],
  },
  {
    orderId: 'ORD-2026-792411',
    invoiceNumber: 'INV-2026-792411',
    createdAt: '08 Nov 2026, 7:05 pm',
    customerName: 'Ankit Prajapati',
    customerEmail: 'ankit@example.com',
    customerPhone: '+91 9876543210',
    status: 'DELIVERED',
    paymentMethod: 'CARD',
    couponCode: null,
    subtotal: 3499,
    discount: 0,
    total: 3499,
    address: INITIAL_ADDRESSES[1],
    items: [
      {
        productId: INITIAL_PRODUCTS[240].id,
        title: INITIAL_PRODUCTS[240].title,
        category: INITIAL_PRODUCTS[240].category,
        colorName: INITIAL_PRODUCTS[240].variants[0].colorName,
        sku: INITIAL_PRODUCTS[240].variants[0].sku,
        hsnCode: INITIAL_PRODUCTS[240].hsnCode,
        mrp: INITIAL_PRODUCTS[240].variants[0].mrp,
        salePrice: INITIAL_PRODUCTS[240].variants[0].salePrice,
        qty: 1,
      },
    ],
  },
];

// ============================================================================
// 2. BRAND LOGO & REAL PHOTO COMPONENT WITH RELIABLE FALLBACK
// ============================================================================

const OrayveLogo = ({ dark = true, size = 'md' }) => {
  const iconSize = size === 'lg' ? 38 : size === 'sm' ? 24 : 30;
  const textClass = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl';
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="25" cy="32" r="16" stroke={dark ? '#D6B98C' : '#1C1B29'} strokeWidth="3.2" />
        <circle cx="39" cy="32" r="16" stroke={dark ? '#F3EFE7' : '#B8905C'} strokeWidth="3.2" />
      </svg>
      <span className={`font-serif-brand font-medium tracking-wide ${textClass} ${dark ? 'text-[#F3EFE7]' : 'text-[#1C1B29]'}`}>
        Orayve
      </span>
    </div>
  );
};

const ProductPhoto = ({ src, fallback, alt, colorHex, className = '' }) => (
  <div className={`relative w-full h-full overflow-hidden bg-[#1C1B29] ${className}`}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        if (e.currentTarget.src !== fallback) {
          e.currentTarget.src = fallback;
        }
      }}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    {/* Subtle bottom vignette & variant color indicator bar */}
    <div
      className="absolute inset-0 pointer-events-none transition-colors duration-300"
      style={{
        background: `linear-gradient(to top, rgba(28,27,41,0.42) 0%, transparent 45%)`,
      }}
    />
    <div
      className="absolute bottom-0 left-0 right-0 h-1 transition-colors duration-300"
      style={{ backgroundColor: colorHex }}
    />
  </div>
);

// ============================================================================
// 3. MAIN APPLICATION
// ============================================================================

export default function App() {
  const [view, setView] = useState('store'); // 'store' | 'profile' | 'checkout' | 'admin'
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  // User & Admin Auth
  const [user, setUser] = useState({
    name: 'Ankit Prajapati',
    email: 'ankit@example.com',
    phone: '+91 9876543210',
  });
  const [adminSession, setAdminSession] = useState(null);

  // Discovery, Filters & Pagination (24 per page for snappy 260-item browsing)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'rating' | 'price_asc' | 'price_desc'
  const [filterColor, setFilterColor] = useState('All');
  const [filterMaterial, setFilterMaterial] = useState('All');
  const [filterDesign, setFilterDesign] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const PAGE_SIZE = 24;

  // In-page active variant per product
  const [activeVariantMap, setActiveVariantMap] = useState({});

  // Cart & Wishlist
  const [cart, setCart] = useState([
    { productId: INITIAL_PRODUCTS[0].id, variantId: INITIAL_PRODUCTS[0].variants[0].id, qty: 1 },
  ]);
  const [wishlist, setWishlist] = useState([INITIAL_PRODUCTS[0].id, INITIAL_PRODUCTS[240].id]);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [couponInput, setCouponInput] = useState('');

  // Drawers & Modals
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [detailProductId, setDetailProductId] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [toast, setToast] = useState(null);

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(INITIAL_ADDRESSES[0].id);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [latestOrder, setLatestOrder] = useState(null);
  const [newAddrForm, setNewAddrForm] = useState({
    show: false,
    label: 'Home',
    recipientName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    lat: null,
    lng: null,
  });

  // User Auth Modal State
  const [authTab, setAuthTab] = useState('mobile');
  const [authIdentifier, setAuthIdentifier] = useState('+91 9876543210');
  const [authOtpSent, setAuthOtpSent] = useState(false);
  const [authOtp, setAuthOtp] = useState('');
  const [authName, setAuthName] = useState('Ankit Prajapati');

  // Admin Gate & Portal State
  const [adminGateTab, setAdminGateTab] = useState('login');
  const [adminLoginId, setAdminLoginId] = useState('ADM-2026-0001');
  const [adminLoginPass, setAdminLoginPass] = useState('');
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [kycForm, setKycForm] = useState({
    fullName: '',
    companyEmail: '',
    mobile: '',
    address: '',
    govIdNumber: '',
    panNumber: '',
    otp: '',
  });
  const [adminSection, setAdminSection] = useState('analytics');
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Wallets',
    materialType: 'Full-Grain Leather',
    designStyle: 'Minimalist',
    isCouponApplicable: true,
    colorName: 'Pitch Black',
    colorHex: '#1C1B29',
    mrp: 1499,
    salePrice: 1099,
    stock: 25,
  });
  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: 10,
    maxDiscount: 300,
    minOrder: 500,
  });

  const showToast = (message, tone = 'dark') => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3000);
  };

  const getActiveVariant = (product) => {
    const vid = activeVariantMap[product.id];
    return product.variants.find((v) => v.id === vid) || product.variants[0];
  };

  // Category Counts
  const categoryCounts = useMemo(() => {
    const counts = { 'All Categories': products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Faceted Filter Options
  const filterOptions = useMemo(() => {
    const colors = new Set();
    const materials = new Set();
    const designs = new Set();
    const scope =
      selectedCategory === 'All Categories'
        ? products
        : products.filter((p) => p.category === selectedCategory);

    scope.forEach((p) => {
      materials.add(p.materialType);
      designs.add(p.designStyle);
      p.variants.forEach((v) => colors.add(v.colorName));
    });
    return {
      colors: ['All', ...Array.from(colors)],
      materials: ['All', ...Array.from(materials)],
      designs: ['All', ...Array.from(designs)],
    };
  }, [products, selectedCategory]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.materialType.toLowerCase().includes(q) ||
        p.designStyle.toLowerCase().includes(q);
      const matchesCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
      const matchesMat = filterMaterial === 'All' || p.materialType === filterMaterial;
      const matchesDesign = filterDesign === 'All' || p.designStyle === filterDesign;
      const matchesColor =
        filterColor === 'All' || p.variants.some((v) => v.colorName === filterColor);
      return matchesSearch && matchesCat && matchesMat && matchesDesign && matchesColor;
    });

    if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => getActiveVariant(a).salePrice - getActiveVariant(b).salePrice);
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => getActiveVariant(b).salePrice - getActiveVariant(a).salePrice);
    }
    return list;
  }, [products, searchQuery, selectedCategory, filterMaterial, filterDesign, filterColor, sortBy, activeVariantMap]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Cart Calculations
  const cartDetails = useMemo(() => {
    const items = cart
      .map((ci) => {
        const product = products.find((p) => p.id === ci.productId);
        if (!product) return null;
        const variant = product.variants.find((v) => v.id === ci.variantId) || product.variants[0];
        return { ...ci, product, variant };
      })
      .filter(Boolean);

    const subtotal = items.reduce((sum, item) => sum + item.variant.salePrice * item.qty, 0);
    const eligibleSubtotal = items.reduce(
      (sum, item) => (item.product.isCouponApplicable ? sum + item.variant.salePrice * item.qty : sum),
      0
    );

    let discount = 0;
    const activeCoupon = coupons.find((c) => c.code === appliedCouponCode && c.active);
    if (activeCoupon && eligibleSubtotal >= activeCoupon.minOrder) {
      discount =
        activeCoupon.type === 'PERCENTAGE'
          ? Math.min(Math.round((eligibleSubtotal * activeCoupon.value) / 100), activeCoupon.maxDiscount)
          : Math.min(activeCoupon.value, eligibleSubtotal);
    }

    return {
      items,
      subtotal,
      discount,
      total: Math.max(0, subtotal - discount),
      count: items.reduce((sum, item) => sum + item.qty, 0),
    };
  }, [cart, products, coupons, appliedCouponCode]);

  const addToCart = (productId, variantId) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === productId && i.variantId === variantId);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { productId, variantId, qty: 1 }];
    });
    showToast('Added to your Orayve bag');
  };

  const updateCartQty = (productId, variantId, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.variantId === variantId ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist');
      return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const found = coupons.find((c) => c.code === code && c.active);
    if (!found) {
      showToast('Invalid or inactive coupon code', 'error');
      return;
    }
    if (cartDetails.subtotal < found.minOrder) {
      showToast(`Minimum order ₹${found.minOrder} required`, 'error');
      return;
    }
    setAppliedCouponCode(code);
    showToast(`Coupon ${code} applied`);
  };

  const handleShareProduct = (product) => {
    const url = `https://orayve.in/product/${product.id}`;
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
    showToast('Share link copied for WhatsApp & Social');
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setNewAddrForm((prev) => ({
            ...prev,
            street: 'GPS Pin: Civil Lines / Central Avenue',
            city: 'Kanpur',
            state: 'Uttar Pradesh',
            pincode: '208001',
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
          }));
          showToast('Exact GPS coordinates captured');
        },
        () => {
          setNewAddrForm((prev) => ({
            ...prev,
            street: 'GPS Pin: Laxmi Chowk, Hinjewadi',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411057',
            lat: 18.5913,
            lng: 73.7389,
          }));
          showToast('GPS coordinates filled (demo fallback)');
        }
      );
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!newAddrForm.recipientName || !newAddrForm.street || !newAddrForm.pincode) {
      showToast('Fill all required address fields', 'error');
      return;
    }
    const newId = `addr_${Date.now()}`;
    setAddresses((prev) => [
      ...prev,
      {
        id: newId,
        label: newAddrForm.label,
        recipientName: newAddrForm.recipientName,
        phone: newAddrForm.phone || user?.phone || '+91 9876543210',
        street: newAddrForm.street,
        city: newAddrForm.city || 'Pune',
        state: newAddrForm.state || 'Maharashtra',
        pincode: newAddrForm.pincode,
        lat: newAddrForm.lat,
        lng: newAddrForm.lng,
        isDefault: false,
      },
    ]);
    setSelectedAddressId(newId);
    setNewAddrForm({ show: false, label: 'Home', recipientName: '', phone: '', street: '', city: '', state: '', pincode: '', lat: null, lng: null });
    showToast('Address saved');
  };

  const handlePlaceOrder = () => {
    if (cartDetails.items.length === 0) return;
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
    const rand = Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      orderId: `ORD-2026-${rand}`,
      invoiceNumber: `INV-2026-${rand}`,
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      customerName: user?.name || selectedAddress.recipientName,
      customerEmail: user?.email || 'customer@orayve.in',
      customerPhone: user?.phone || selectedAddress.phone,
      status: 'ORDER_PLACED',
      paymentMethod,
      couponCode: appliedCouponCode || null,
      subtotal: cartDetails.subtotal,
      discount: cartDetails.discount,
      total: cartDetails.total,
      address: selectedAddress,
      items: cartDetails.items.map((ci) => ({
        productId: ci.product.id,
        title: ci.product.title,
        category: ci.product.category,
        colorName: ci.variant.colorName,
        sku: ci.variant.sku,
        hsnCode: ci.product.hsnCode,
        mrp: ci.variant.mrp,
        salePrice: ci.variant.salePrice,
        qty: ci.qty,
      })),
    };

    setProducts((prev) =>
      prev.map((p) => {
        const bought = cartDetails.items.filter((ci) => ci.product.id === p.id);
        if (bought.length === 0) return p;
        const totalQty = bought.reduce((s, b) => s + b.qty, 0);
        return {
          ...p,
          unitsSold: p.unitsSold + totalQty,
          variants: p.variants.map((v) => {
            const m = bought.find((b) => b.variant.id === v.id);
            return m ? { ...v, stock: Math.max(0, v.stock - m.qty) } : v;
          }),
        };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    setCart([]);
    setAppliedCouponCode('');
    setCouponInput('');
    setCheckoutStep(3);
    showToast(`Order ${newOrder.orderId} confirmed!`);
  };

  // Admin Analytics
  const adminAnalytics = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const categoryMap = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        if (!categoryMap[item.category]) {
          categoryMap[item.category] = { category: item.category, orders: 0, revenue: 0, products: {} };
        }
        categoryMap[item.category].orders += item.qty;
        categoryMap[item.category].revenue += item.salePrice * item.qty;
        categoryMap[item.category].products[item.title] =
          (categoryMap[item.category].products[item.title] || 0) + item.qty;
      });
    });

    const categoryStats = Object.values(categoryMap).map((c) => {
      const best = Object.entries(c.products).sort((a, b) => b[1] - a[1])[0];
      return { ...c, bestSeller: best ? `${best[0]} (${best[1]} sold)` : '—' };
    });

    const lowStockVariants = [];
    products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.stock <= 10) lowStockVariants.push({ productTitle: p.title, sku: v.sku, colorName: v.colorName, stock: v.stock });
      });
    });

    const productsToBoost = products
      .map((p) => ({ ...p, conversionRate: p.viewCount > 0 ? (p.unitsSold / p.viewCount) * 100 : 0 }))
      .filter((p) => p.viewCount >= 1200 && p.conversionRate < 1.8)
      .sort((a, b) => a.conversionRate - b.conversionRate)
      .slice(0, 8);

    return { totalRevenue, totalOrders: orders.length, categoryStats, lowStockVariants: lowStockVariants.slice(0, 10), totalLowStock: lowStockVariants.length, productsToBoost };
  }, [orders, products]);

  const adminFilteredProducts = useMemo(() => {
    const q = adminProductSearch.trim().toLowerCase();
    if (!q) return products.slice(0, 40);
    return products
      .filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.variants[0].sku.toLowerCase().includes(q))
      .slice(0, 40);
  }, [products, adminProductSearch]);

  const handleSaveAdminProduct = (e) => {
    e.preventDefault();
    if (!productForm.title.trim()) return;
    const catCfg = CATEGORY_CONFIGS.find((c) => c.name === productForm.category) || CATEGORY_CONFIGS[0];
    const discountPct = Math.max(0, Math.round(((Number(productForm.mrp) - Number(productForm.salePrice)) / Number(productForm.mrp)) * 100));

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                title: productForm.title,
                category: productForm.category,
                materialType: productForm.materialType,
                designStyle: productForm.designStyle,
                isCouponApplicable: productForm.isCouponApplicable,
                variants: p.variants.map((v, idx) =>
                  idx === 0
                    ? {
                        ...v,
                        colorName: productForm.colorName,
                        colorHex: productForm.colorHex,
                        mrp: Number(productForm.mrp),
                        discountPercent: discountPct,
                        salePrice: Number(productForm.salePrice),
                        stock: Number(productForm.stock),
                      }
                    : v
                ),
              }
            : p
        )
      );
      setEditingProduct(null);
      showToast('Product updated live');
    } else {
      const newId = `p_${Date.now()}`;
      setProducts((prev) => [
        {
          id: newId,
          title: productForm.title,
          category: productForm.category,
          materialType: productForm.materialType,
          designStyle: productForm.designStyle,
          hsnCode: catCfg.hsn,
          countryOfOrigin: 'China',
          returnPolicyDays: 7,
          isCouponApplicable: productForm.isCouponApplicable,
          rating: 4.9,
          reviewCount: 1,
          viewCount: 100,
          unitsSold: 0,
          fallbackPhoto: catCfg.fallbackPhoto,
          description: `New Orayve arrival crafted in ${productForm.materialType}.`,
          variants: [
            {
              id: `${newId}_v1`,
              sku: `ORV-${catCfg.skuPrefix}-${Math.floor(100 + Math.random() * 899)}`,
              colorName: productForm.colorName,
              colorHex: productForm.colorHex,
              photoUrl: catCfg.photos[0],
              mrp: Number(productForm.mrp),
              discountPercent: discountPct,
              salePrice: Number(productForm.salePrice),
              stock: Number(productForm.stock),
            },
          ],
        },
        ...prev,
      ]);
      showToast('New product published to storefront');
    }
    setProductForm({ title: '', category: 'Wallets', materialType: 'Full-Grain Leather', designStyle: 'Minimalist', isCouponApplicable: true, colorName: 'Pitch Black', colorHex: '#1C1B29', mrp: 1499, salePrice: 1099, stock: 25 });
  };

  const detailProduct = products.find((p) => p.id === detailProductId);

  return (
    <div className="min-h-screen bg-[#F3EFE7] text-[#1C1B29] font-sans-ui flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-serif-brand { font-family: 'Fraunces', serif; }
        .font-sans-ui { font-family: 'Manrope', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media print {
          body * { visibility: hidden; }
          #printable-invoice, #printable-invoice * { visibility: visible; }
          #printable-invoice { position: fixed; inset: 0; background: white; padding: 24px; }
        }
      `}</style>

      {/* ====================================================================
          TOP NAVIGATION BAR
         ==================================================================== */}
      {!(view === 'admin' && adminSession) && (
        <header className="sticky top-0 z-40 bg-[#1C1B29] text-[#F3EFE7] border-b border-[#B8905C]/25 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <button onClick={() => setView('store')} className="focus:outline-none">
              <OrayveLogo dark size="md" />
            </button>

            <div className="hidden md:flex flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-[#D6B98C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                  if (view !== 'store') setView('store');
                }}
                placeholder="Search 260+ wallets, watches, shoes, ties, rings..."
                className="w-full bg-[#2E2B26]/85 border border-[#B8905C]/30 rounded-full pl-10 pr-4 py-2 text-sm text-[#F3EFE7] placeholder-[#F3EFE7]/50 focus:outline-none focus:border-[#D6B98C]"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => setWishlistOpen(true)} className="relative p-2.5 rounded-full hover:bg-white/10 transition" title="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-[#B8905C] text-[#1C1B29] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button onClick={() => setCartOpen(true)} className="relative p-2.5 rounded-full hover:bg-white/10 transition" title="Bag">
                <ShoppingBag className="w-5 h-5" />
                {cartDetails.count > 0 && (
                  <span className="absolute top-1 right-1 bg-[#D6B98C] text-[#1C1B29] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartDetails.count}
                  </span>
                )}
              </button>

              <button
                onClick={() => (user ? setView('profile') : setAuthModalOpen(true))}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B8905C]/40 hover:bg-white/10 text-xs sm:text-sm font-medium transition"
              >
                <User className="w-4 h-4 text-[#D6B98C]" />
                <span className="hidden sm:inline">{user ? user.name.split(' ')[0] : 'Sign In'}</span>
              </button>

              <button
                onClick={() => setView('admin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#B8905C]/20 border border-[#B8905C]/50 text-[#D6B98C] hover:bg-[#B8905C] hover:text-[#1C1B29] text-xs font-semibold transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ====================================================================
          VIEW 1: STOREFRONT (260 REAL-PHOTO PRODUCTS)
         ==================================================================== */}
      {view === 'store' && (
        <main className="flex-1">
          {/* Editorial Hero */}
          <section className="bg-[#1C1B29] text-[#F3EFE7] border-b border-[#B8905C]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#D6B98C] font-semibold mb-2">
                Small Details. Big Presence.
              </p>
              <h1 className="font-serif-brand text-3xl sm:text-5xl font-medium leading-tight max-w-2xl">
                260 curated essentials across 13 signature collections.
              </h1>
              <p className="text-sm text-[#F3EFE7]/75 mt-3 max-w-xl">
                Wallets, belts, handbags, watches, footwear, ties, rings, and everyday luxury—each piece backed by our 7-day return & replacement guarantee.
              </p>

              {/* Horizontal Scrollable 13-Category Pill Bar */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pt-6 pb-1">
                {CATEGORY_NAMES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setFilterColor('All');
                      setFilterMaterial('All');
                      setFilterDesign('All');
                      setCurrentPage(1);
                    }}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-[#B8905C] text-[#1C1B29] font-bold'
                        : 'bg-white/5 text-[#F3EFE7]/85 border border-white/15 hover:border-[#D6B98C]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="opacity-70 text-[10px]">({categoryCounts[cat] || 0})</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Discovery Bar & Product Grid */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1C1B29]/12">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-brand text-2xl font-medium">{selectedCategory}</h2>
                  <p className="text-xs text-[#1C1B29]/60">
                    Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length} products
                  </p>
                </div>
                <button
                  onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1C1B29]/20 text-xs font-semibold"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                </button>
              </div>

              <div className={`${showFiltersMobile ? 'grid' : 'hidden lg:flex'} grid-cols-2 sm:grid-cols-4 gap-2.5`}>
                <select
                  value={filterColor}
                  onChange={(e) => { setFilterColor(e.target.value); setCurrentPage(1); }}
                  className="bg-white border border-[#1C1B29]/15 rounded-lg px-3 py-2 text-xs font-medium"
                >
                  {filterOptions.colors.map((c) => <option key={c} value={c}>{c === 'All' ? 'Color: All' : c}</option>)}
                </select>

                <select
                  value={filterMaterial}
                  onChange={(e) => { setFilterMaterial(e.target.value); setCurrentPage(1); }}
                  className="bg-white border border-[#1C1B29]/15 rounded-lg px-3 py-2 text-xs font-medium"
                >
                  {filterOptions.materials.map((m) => <option key={m} value={m}>{m === 'All' ? 'Material: All' : m}</option>)}
                </select>

                <select
                  value={filterDesign}
                  onChange={(e) => { setFilterDesign(e.target.value); setCurrentPage(1); }}
                  className="bg-white border border-[#1C1B29]/15 rounded-lg px-3 py-2 text-xs font-medium"
                >
                  {filterOptions.designs.map((d) => <option key={d} value={d}>{d === 'All' ? 'Design: All' : d}</option>)}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="bg-[#1C1B29] text-[#F3EFE7] rounded-lg px-3 py-2 text-xs font-semibold"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="rating">Sort: Top Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-7">
              {paginatedProducts.map((product) => {
                const activeVar = getActiveVariant(product);
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl border border-[#1C1B29]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-60 cursor-pointer">
                      <div onClick={() => setDetailProductId(product.id)} className="w-full h-full">
                        <ProductPhoto
                          src={activeVar.photoUrl}
                          fallback={product.fallbackPhoto}
                          alt={product.title}
                          colorHex={activeVar.colorHex}
                        />
                      </div>

                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-[#B8905C] text-[#1C1B29] text-[10px] font-bold">
                          {activeVar.discountPercent}% OFF
                        </span>
                        {product.isCouponApplicable && (
                          <span className="px-2 py-0.5 rounded bg-[#1C1B29]/85 text-[#D6B98C] text-[10px] font-semibold">
                            Coupon Eligible
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="p-2 rounded-full bg-[#1C1B29]/75 text-[#F3EFE7] hover:bg-[#1C1B29]"
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D6B98C] text-[#D6B98C]' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleShareProduct(product)}
                          className="p-2 rounded-full bg-[#1C1B29]/75 text-[#F3EFE7] hover:bg-[#1C1B29]"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      {/* 3 Clickable In-Page Color Swatch Buttons */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          {product.variants.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => setActiveVariantMap((prev) => ({ ...prev, [product.id]: v.id }))}
                              title={v.colorName}
                              className={`w-5 h-5 rounded-full border transition-transform ${
                                v.id === activeVar.id
                                  ? 'ring-2 ring-offset-1 ring-[#B8905C] scale-110 border-[#1C1B29]'
                                  : 'border-[#1C1B29]/30 hover:scale-105'
                              }`}
                              style={{ backgroundColor: v.colorHex }}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#1C1B29]/60 font-medium">{activeVar.colorName}</span>
                      </div>

                      <p className="text-[10px] uppercase tracking-wider text-[#B8905C] font-bold">
                        {product.materialType} · {product.designStyle}
                      </p>

                      <h3
                        onClick={() => setDetailProductId(product.id)}
                        className="font-serif-brand text-base font-medium mt-1 cursor-pointer hover:text-[#B8905C] line-clamp-1"
                      >
                        {product.title}
                      </h3>

                      <div className="flex items-center justify-between mt-1.5 text-xs">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-[#B8905C] text-[#B8905C]" />
                          {product.rating}
                          <span className="text-[#1C1B29]/50 font-normal">({product.reviewCount})</span>
                        </span>
                        <span className={`text-[11px] font-semibold ${activeVar.stock <= 10 ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {activeVar.stock} in stock
                        </span>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold">₹{activeVar.salePrice.toLocaleString('en-IN')}</span>
                            <span className="text-xs line-through text-[#1C1B29]/45">₹{activeVar.mrp.toLocaleString('en-IN')}</span>
                          </div>
                          <p className="text-[10px] text-[#1C1B29]/50">SKU: {activeVar.sku}</p>
                        </div>

                        <button
                          onClick={() => addToCart(product.id, activeVar.id)}
                          className="px-3.5 py-2 rounded-lg bg-[#1C1B29] text-[#F3EFE7] hover:bg-[#B8905C] hover:text-[#1C1B29] text-xs font-semibold transition flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  disabled={safePage === 1}
                  onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-3.5 py-2 rounded-lg border border-[#1C1B29]/20 bg-white text-xs font-bold disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <span className="px-4 py-2 text-xs font-bold text-[#1C1B29]">
                  Page {safePage} of {totalPages}
                </span>
                <button
                  disabled={safePage === totalPages}
                  onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-3.5 py-2 rounded-lg border border-[#1C1B29]/20 bg-white text-xs font-bold disabled:opacity-40 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        </main>
      )}

      {/* ====================================================================
          VIEW 2: CHECKOUT FLOW
         ==================================================================== */}
      {view === 'checkout' && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10">
            {[
              { step: 1, label: 'Address' },
              { step: 2, label: 'Payment' },
              { step: 3, label: 'Confirmed' },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${checkoutStep >= s.step ? 'bg-[#1C1B29] text-[#D6B98C]' : 'bg-[#1C1B29]/15 text-[#1C1B29]/50'}`}>
                  {checkoutStep > s.step ? <Check className="w-4 h-4" /> : s.step}
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${checkoutStep >= s.step ? 'text-[#1C1B29]' : 'text-[#1C1B29]/45'}`}>{s.label}</span>
              </div>
            ))}
          </div>

          {checkoutStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-brand text-2xl font-medium">Delivery Address</h2>
                  <button
                    onClick={() => setNewAddrForm((prev) => ({ ...prev, show: !prev.show }))}
                    className="text-xs font-bold text-[#B8905C] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Address
                  </button>
                </div>

                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-xl border bg-white cursor-pointer ${selectedAddressId === addr.id ? 'border-[#B8905C] ring-2 ring-[#B8905C]/25' : 'border-[#1C1B29]/15'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#1C1B29] text-[#D6B98C] text-[10px] font-bold uppercase">{addr.label}</span>
                        <span className="font-bold text-sm">{addr.recipientName}</span>
                        {addr.isDefault && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Default</span>}
                      </div>
                      {!addr.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === addr.id })));
                            setSelectedAddressId(addr.id);
                            showToast('Default address updated');
                          }}
                          className="text-[11px] font-semibold text-[#B8905C] hover:underline"
                        >
                          Make Default
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[#1C1B29]/75 mt-1">{addr.street}, {addr.city}, {addr.state} — {addr.pincode}</p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-[#1C1B29]/55">
                      <span>Phone: {addr.phone}</span>
                      {addr.lat && <span className="inline-flex items-center gap-1 text-emerald-700"><MapPin className="w-3 h-3" /> GPS Verified ({addr.lat}, {addr.lng})</span>}
                    </div>
                  </div>
                ))}

                {newAddrForm.show && (
                  <form onSubmit={handleSaveAddress} className="p-5 rounded-xl bg-white border border-[#B8905C]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Add Address</h3>
                      <button type="button" onClick={handleDetectLocation} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1B29] text-[#D6B98C] text-xs font-semibold">
                        <Navigation className="w-3.5 h-3.5" /> Use Current Location (GPS)
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <input placeholder="Recipient Name *" value={newAddrForm.recipientName} onChange={(e) => setNewAddrForm({ ...newAddrForm, recipientName: e.target.value })} className="border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                      <input placeholder="Phone *" value={newAddrForm.phone} onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })} className="border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                      <input placeholder="Street / Landmark *" value={newAddrForm.street} onChange={(e) => setNewAddrForm({ ...newAddrForm, street: e.target.value })} className="sm:col-span-2 border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                      <input placeholder="City" value={newAddrForm.city} onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })} className="border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                      <input placeholder="Pincode *" value={newAddrForm.pincode} onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })} className="border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                    </div>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-[#B8905C] text-[#1C1B29] text-xs font-bold">Save Address</button>
                  </form>
                )}
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#1C1B29]/12 h-fit space-y-3">
                <h3 className="font-serif-brand text-lg font-medium">Order Summary</h3>
                <div className="space-y-2 text-xs border-b border-[#1C1B29]/10 pb-3">
                  <div className="flex justify-between"><span>Subtotal ({cartDetails.count} items)</span><span>₹{cartDetails.subtotal.toLocaleString('en-IN')}</span></div>
                  {cartDetails.discount > 0 && <div className="flex justify-between text-emerald-700 font-semibold"><span>Coupon ({appliedCouponCode})</span><span>-₹{cartDetails.discount.toLocaleString('en-IN')}</span></div>}
                  <div className="flex justify-between"><span>Shipping</span><span className="text-emerald-700 font-semibold">FREE</span></div>
                </div>
                <div className="flex justify-between text-base font-bold"><span>Total</span><span>₹{cartDetails.total.toLocaleString('en-IN')}</span></div>
                <button onClick={() => setCheckoutStep(2)} className="w-full py-3 rounded-xl bg-[#1C1B29] text-[#F3EFE7] hover:bg-[#B8905C] hover:text-[#1C1B29] font-semibold text-sm transition flex items-center justify-center gap-2">
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 2 && (
            <div className="max-w-xl mx-auto bg-white rounded-2xl border border-[#1C1B29]/15 overflow-hidden shadow-lg">
              <div className="bg-[#1C1B29] text-[#F3EFE7] p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#D6B98C]">Orayve Secure Checkout · Razorpay</p>
                  <p className="text-xl font-bold mt-0.5">₹{cartDetails.total.toLocaleString('en-IN')}</p>
                </div>
                <ShieldCheck className="w-8 h-8 text-[#D6B98C]" />
              </div>
              <div className="p-6 space-y-3">
                {[
                  { id: 'UPI', title: 'UPI (GPay, PhonePe, Paytm)', desc: 'Instant zero-fee UPI payment', icon: Smartphone },
                  { id: 'CARD', title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
                  { id: 'NET_BANKING', title: 'Net Banking', desc: 'HDFC, ICICI, SBI, Axis & 40+ banks', icon: Building2 },
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <div key={opt.id} onClick={() => setPaymentMethod(opt.id)} className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer ${paymentMethod === opt.id ? 'border-[#B8905C] bg-[#F3EFE7]/60' : 'border-[#1C1B29]/15'}`}>
                      <Icon className="w-5 h-5 text-[#B8905C]" />
                      <div className="flex-1"><p className="text-sm font-bold">{opt.title}</p><p className="text-xs text-[#1C1B29]/60">{opt.desc}</p></div>
                    </div>
                  );
                })}
                <div className="pt-4 flex gap-3">
                  <button onClick={() => setCheckoutStep(1)} className="px-4 py-3 rounded-xl border border-[#1C1B29]/20 text-xs font-semibold">Back</button>
                  <button onClick={handlePlaceOrder} className="flex-1 py-3 rounded-xl bg-[#1C1B29] text-[#F3EFE7] hover:bg-[#B8905C] hover:text-[#1C1B29] font-bold text-sm transition">
                    Pay ₹{cartDetails.total.toLocaleString('en-IN')} Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {checkoutStep === 3 && latestOrder && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#B8905C]/40 p-8 text-center shadow-lg">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#B8905C] font-bold">Order Confirmed</p>
              <h2 className="font-serif-brand text-3xl font-medium mt-1">Thank you for choosing Orayve</h2>
              <p className="text-sm text-[#1C1B29]/70 mt-2">Order ID: <strong className="text-[#1C1B29]">{latestOrder.orderId}</strong></p>
              <div className="mt-5 p-4 rounded-xl bg-[#F3EFE7] border border-[#B8905C]/30 text-xs text-left space-y-1">
                <p>✓ SMS confirmation dispatched to <strong>{latestOrder.customerPhone}</strong></p>
                <p>✓ GST PDF Invoice emailed to <strong>{latestOrder.customerEmail}</strong></p>
                <p>✓ Protected under Orayve's <strong>7-Day Return & Replacement Policy</strong></p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button onClick={() => setInvoiceOrder(latestOrder)} className="px-5 py-2.5 rounded-xl bg-[#1C1B29] text-[#F3EFE7] text-xs font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Download / Print GST Invoice
                </button>
                <button onClick={() => setView('profile')} className="px-5 py-2.5 rounded-xl border border-[#1C1B29]/25 text-xs font-bold">
                  View Order History
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ====================================================================
          VIEW 3: USER PROFILE & ORDER HISTORY
         ==================================================================== */}
      {view === 'profile' && (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#B8905C] font-bold">Member Profile</p>
              <h1 className="font-serif-brand text-3xl font-medium">{user?.name}</h1>
              <p className="text-xs text-[#1C1B29]/65">{user?.email} · {user?.phone}</p>
            </div>
            <button onClick={() => setView('store')} className="px-4 py-2 rounded-full bg-[#1C1B29] text-[#F3EFE7] text-xs font-semibold">
              Continue Shopping
            </button>
          </div>

          <h2 className="font-serif-brand text-xl font-medium mb-4">Order History ({orders.length})</h2>
          <div className="space-y-5">
            {orders.map((order) => {
              const currentIdx = ORDER_STATUSES.indexOf(order.status);
              return (
                <div key={order.orderId} className="bg-white rounded-xl border border-[#1C1B29]/12 p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1C1B29]/10">
                    <div>
                      <span className="text-sm font-bold">{order.orderId}</span>
                      <span className="text-xs text-[#1C1B29]/55 ml-3">{order.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">₹{order.total.toLocaleString('en-IN')}</span>
                      <button onClick={() => setInvoiceOrder(order)} className="px-3 py-1.5 rounded-lg bg-[#F3EFE7] border border-[#B8905C]/40 text-xs font-bold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Download Bill
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 py-4">
                    {ORDER_STATUSES.map((st, idx) => (
                      <div key={st} className="text-center">
                        <div className={`h-1.5 rounded-full mb-2 ${idx <= currentIdx ? 'bg-[#B8905C]' : 'bg-[#1C1B29]/12'}`} />
                        <p className={`text-[10px] font-bold ${idx <= currentIdx ? 'text-[#1C1B29]' : 'text-[#1C1B29]/40'}`}>{st.replace(/_/g, ' ')}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 text-xs text-[#1C1B29]/80">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.title} ({item.colorName}) × {item.qty}</span>
                        <span className="font-semibold">₹{(item.salePrice * item.qty).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ====================================================================
          VIEW 4: ADMIN PORTAL (AUTH GATE + LIVE DASHBOARD)
         ==================================================================== */}
      {view === 'admin' && !adminSession && (
        <main className="flex-1 flex items-center justify-center p-4 bg-[#1C1B29]">
          <div className="w-full max-w-md bg-[#F3EFE7] rounded-2xl p-7 shadow-2xl border border-[#B8905C]/40">
            <div className="flex items-center justify-between mb-6">
              <OrayveLogo dark={false} size="sm" />
              <span className="px-2.5 py-1 rounded bg-[#1C1B29] text-[#D6B98C] text-[10px] font-bold uppercase">Admin Gate</span>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 bg-[#1C1B29]/10 rounded-lg mb-6">
              <button onClick={() => setAdminGateTab('login')} className={`py-2 rounded-md text-xs font-bold ${adminGateTab === 'login' ? 'bg-[#1C1B29] text-[#F3EFE7]' : ''}`}>Admin Login</button>
              <button onClick={() => setAdminGateTab('kyc')} className={`py-2 rounded-md text-xs font-bold ${adminGateTab === 'kyc' ? 'bg-[#1C1B29] text-[#F3EFE7]' : ''}`}>KYC Registration</button>
            </div>

            {adminGateTab === 'login' ? (
              <div className="space-y-4">
                <input value={adminLoginId} onChange={(e) => setAdminLoginId(e.target.value)} placeholder="ADM-2026-0001" className="w-full bg-white border border-[#1C1B29]/20 rounded-lg px-3 py-2.5 text-sm" />
                <input type="password" value={adminLoginPass} onChange={(e) => setAdminLoginPass(e.target.value)} placeholder="Password" className="w-full bg-white border border-[#1C1B29]/20 rounded-lg px-3 py-2.5 text-sm" />
                <button
                  onClick={() => { setAdminSession({ adminId: adminLoginId || 'ADM-2026-0001' }); showToast('Admin console unlocked'); }}
                  className="w-full py-2.5 rounded-xl bg-[#1C1B29] text-[#F3EFE7] font-bold text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAdminSession({ adminId: 'ADM-2026-0001' }); showToast('Demo Super Admin active'); }}
                  className="w-full py-2 rounded-xl border border-[#B8905C] text-[#1C1B29] font-bold text-xs"
                >
                  1-Click Demo Super Admin Login
                </button>
              </div>
            ) : kycSubmitted ? (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-xs">
                <ShieldCheck className="w-10 h-10 text-emerald-700 mx-auto" />
                <p className="font-bold text-emerald-900">KYC Queued for Super Admin Approval</p>
                <p>Encrypted Gov ID & PAN received for <strong>{kycForm.companyEmail}</strong>.</p>
                <button onClick={() => { setKycSubmitted(false); setAdminGateTab('login'); }} className="mt-2 px-4 py-1.5 rounded-lg bg-[#1C1B29] text-[#F3EFE7] font-semibold">Back to Login</button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!kycForm.companyEmail.endsWith('@orayve.in')) {
                    showToast('Use an official @orayve.in email', 'error');
                    return;
                  }
                  setKycSubmitted(true);
                }}
                className="space-y-2.5 text-xs"
              >
                <input required placeholder="Full Legal Name" value={kycForm.fullName} onChange={(e) => setKycForm({ ...kycForm, fullName: e.target.value })} className="w-full bg-white border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                <input required type="email" placeholder="Company Email (@orayve.in)" value={kycForm.companyEmail} onChange={(e) => setKycForm({ ...kycForm, companyEmail: e.target.value })} className="w-full bg-white border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                <div className="grid grid-cols-2 gap-2">
                  <input required placeholder="Mobile" value={kycForm.mobile} onChange={(e) => setKycForm({ ...kycForm, mobile: e.target.value })} className="bg-white border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                  <input required placeholder="PAN Number" value={kycForm.panNumber} onChange={(e) => setKycForm({ ...kycForm, panNumber: e.target.value })} className="bg-white border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                </div>
                <input required placeholder="Gov ID (Passport / DL — AES-256)" value={kycForm.govIdNumber} onChange={(e) => setKycForm({ ...kycForm, govIdNumber: e.target.value })} className="w-full bg-white border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                <input required placeholder="Residential Address" value={kycForm.address} onChange={(e) => setKycForm({ ...kycForm, address: e.target.value })} className="w-full bg-white border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                <div className="flex gap-2">
                  <input required placeholder="OTP (Demo: 123456)" value={kycForm.otp} onChange={(e) => setKycForm({ ...kycForm, otp: e.target.value })} className="flex-1 bg-white border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                  <button type="button" onClick={() => showToast('KYC OTP sent: 123456')} className="px-3 rounded-lg bg-[#1C1B29] text-[#D6B98C] font-semibold">Send OTP</button>
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-[#B8905C] text-[#1C1B29] font-bold">Verify OTP & Submit KYC</button>
              </form>
            )}
          </div>
        </main>
      )}

      {view === 'admin' && adminSession && (
        <div className="flex-1 flex flex-col md:flex-row min-h-screen">
          <aside className="w-full md:w-64 bg-[#2E2B26] text-[#F3EFE7] p-5 flex flex-col justify-between shrink-0">
            <div>
              <div className="pb-5 border-b border-white/10">
                <OrayveLogo dark size="sm" />
                <p className="text-[10px] uppercase tracking-widest text-[#D6B98C] mt-2">Admin · {adminSession.adminId}</p>
              </div>
              <nav className="mt-5 space-y-1.5">
                {[
                  { id: 'analytics', label: 'Analytics Overview', icon: BarChart3 },
                  { id: 'products', label: `Product CRUD (${products.length})`, icon: Package },
                  { id: 'coupons', label: 'Coupon Manager', icon: Tag },
                  { id: 'orders', label: 'Order Tracker', icon: Truck },
                ].map((nav) => {
                  const Icon = nav.icon;
                  return (
                    <button
                      key={nav.id}
                      onClick={() => setAdminSection(nav.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold ${adminSection === nav.id ? 'bg-[#B8905C] text-[#1C1B29]' : 'text-[#F3EFE7]/80 hover:bg-white/10'}`}
                    >
                      <Icon className="w-4 h-4" /> {nav.label}
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="pt-5 border-t border-white/10 space-y-2">
              <button onClick={() => setView('store')} className="w-full py-2 rounded-lg bg-white/10 text-xs font-semibold">View Storefront</button>
              <button onClick={() => { setAdminSession(null); setView('store'); }} className="w-full py-2 rounded-lg text-xs text-rose-300 flex items-center justify-center gap-1.5">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </aside>

          <section className="flex-1 bg-[#F3EFE7] p-5 sm:p-8 overflow-y-auto">
            {adminSection === 'analytics' && (
              <div className="space-y-6">
                <h1 className="font-serif-brand text-3xl font-medium">Executive Analytics</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-[#1C1B29]/10"><p className="text-xs text-[#1C1B29]/60 font-semibold">Total Revenue</p><p className="text-2xl font-bold mt-1">₹{adminAnalytics.totalRevenue.toLocaleString('en-IN')}</p></div>
                  <div className="bg-white p-5 rounded-xl border border-[#1C1B29]/10"><p className="text-xs text-[#1C1B29]/60 font-semibold">Total Orders</p><p className="text-2xl font-bold mt-1">{adminAnalytics.totalOrders}</p></div>
                  <div className="bg-white p-5 rounded-xl border border-[#1C1B29]/10"><p className="text-xs text-[#1C1B29]/60 font-semibold">Live Products</p><p className="text-2xl font-bold mt-1">{products.length}</p></div>
                  <div className="bg-white p-5 rounded-xl border border-amber-300"><p className="text-xs text-amber-800 font-semibold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Low Stock SKUs</p><p className="text-2xl font-bold text-amber-700 mt-1">{adminAnalytics.totalLowStock}</p></div>
                </div>

                <div className="bg-white rounded-xl border border-[#1C1B29]/10 p-5">
                  <h2 className="font-serif-brand text-lg font-medium mb-3">Orders & Best Sellers by Category</h2>
                  <table className="w-full text-left text-xs">
                    <thead className="border-b text-[#1C1B29]/60"><tr><th className="py-2">Category</th><th className="py-2">Units</th><th className="py-2">Revenue</th><th className="py-2">Best Seller</th></tr></thead>
                    <tbody className="divide-y">
                      {adminAnalytics.categoryStats.map((c) => (
                        <tr key={c.category}><td className="py-2.5 font-semibold">{c.category}</td><td className="py-2.5">{c.orders}</td><td className="py-2.5 font-bold">₹{c.revenue.toLocaleString('en-IN')}</td><td className="py-2.5 text-[#B8905C] font-semibold">{c.bestSeller}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-[#1C1B29]/10 p-5">
                    <h2 className="font-serif-brand text-lg font-medium mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#B8905C]" /> Products to Boost</h2>
                    <div className="space-y-2">
                      {adminAnalytics.productsToBoost.map((p) => (
                        <div key={p.id} className="p-3 rounded-lg bg-[#F3EFE7] flex justify-between text-xs">
                          <div><p className="font-bold">{p.title}</p><p className="text-[#1C1B29]/60">{p.viewCount} views · {p.unitsSold} sold</p></div>
                          <span className="px-2 py-1 h-fit rounded bg-amber-100 text-amber-800 font-bold">{p.conversionRate.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-[#1C1B29]/10 p-5">
                    <h2 className="font-serif-brand text-lg font-medium mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-600" /> Low Stock Alerts</h2>
                    <div className="space-y-2">
                      {adminAnalytics.lowStockVariants.map((v) => (
                        <div key={v.sku} className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex justify-between text-xs">
                          <div><p className="font-bold">{v.productTitle}</p><p className="text-[#1C1B29]/60">{v.sku} · {v.colorName}</p></div>
                          <span className="font-bold text-amber-800">{v.stock} left</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminSection === 'products' && (
              <div className="space-y-6">
                <h1 className="font-serif-brand text-3xl font-medium">Product CRUD ({products.length} Live)</h1>
                <form onSubmit={handleSaveAdminProduct} className="bg-white p-5 rounded-xl border border-[#1C1B29]/12 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <input required placeholder="Product Title *" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} className="sm:col-span-2 border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                  <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="border border-[#1C1B29]/20 rounded-lg px-3 py-2">
                    {CATEGORY_NAMES.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input placeholder="Material" value={productForm.materialType} onChange={(e) => setProductForm({ ...productForm, materialType: e.target.value })} className="border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                  <input type="number" placeholder="MRP (₹)" value={productForm.mrp} onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })} className="border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                  <input type="number" placeholder="Sale Price (₹)" value={productForm.salePrice} onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })} className="border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                  <input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="border border-[#1C1B29]/20 rounded-lg px-3 py-2" />
                  <button type="submit" className="rounded-lg bg-[#1C1B29] text-[#F3EFE7] font-bold hover:bg-[#B8905C] hover:text-[#1C1B29] transition">
                    {editingProduct ? 'Save Edit' : 'Publish Product'}
                  </button>
                </form>

                <input
                  value={adminProductSearch}
                  onChange={(e) => setAdminProductSearch(e.target.value)}
                  placeholder="Search 260+ products by title, category, or SKU..."
                  className="w-full max-w-md bg-white border border-[#1C1B29]/20 rounded-lg px-3.5 py-2 text-xs"
                />

                <div className="bg-white rounded-xl border border-[#1C1B29]/10 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1C1B29] text-[#F3EFE7]">
                      <tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y">
                      {adminFilteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td className="p-3 font-semibold">{p.title}</td>
                          <td className="p-3 text-[#1C1B29]/70">{p.category}</td>
                          <td className="p-3"><strong>₹{p.variants[0].salePrice}</strong> <span className="line-through text-[#1C1B29]/45">₹{p.variants[0].mrp}</span></td>
                          <td className="p-3">{p.variants[0].stock}</td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm({ title: p.title, category: p.category, materialType: p.materialType, designStyle: p.designStyle, isCouponApplicable: p.isCouponApplicable, colorName: p.variants[0].colorName, colorHex: p.variants[0].colorHex, mrp: p.variants[0].mrp, salePrice: p.variants[0].salePrice, stock: p.variants[0].stock });
                              }}
                              className="text-[#B8905C] font-bold hover:underline"
                            >
                              Edit
                            </button>
                            <button onClick={() => { setProducts((prev) => prev.filter((x) => x.id !== p.id)); showToast('Product deleted'); }} className="text-rose-600 font-bold hover:underline">
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

            {adminSection === 'coupons' && (
              <div className="space-y-6">
                <h1 className="font-serif-brand text-3xl font-medium">Coupon Manager</h1>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCouponForm.code.trim()) return;
                    setCoupons((prev) => [...prev, { id: `c_${Date.now()}`, code: newCouponForm.code.toUpperCase(), type: newCouponForm.type, value: Number(newCouponForm.value), maxDiscount: Number(newCouponForm.maxDiscount), minOrder: Number(newCouponForm.minOrder), active: true }]);
                    setNewCouponForm({ code: '', type: 'PERCENTAGE', value: 10, maxDiscount: 300, minOrder: 500 });
                    showToast('Coupon created');
                  }}
                  className="bg-white p-5 rounded-xl border border-[#1C1B29]/12 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs"
                >
                  <input required placeholder="CODE" value={newCouponForm.code} onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value })} className="border rounded-lg px-3 py-2 uppercase" />
                  <select value={newCouponForm.type} onChange={(e) => setNewCouponForm({ ...newCouponForm, type: e.target.value })} className="border rounded-lg px-3 py-2"><option value="PERCENTAGE">%</option><option value="FLAT">Flat ₹</option></select>
                  <input type="number" value={newCouponForm.value} onChange={(e) => setNewCouponForm({ ...newCouponForm, value: e.target.value })} className="border rounded-lg px-3 py-2" />
                  <input type="number" value={newCouponForm.minOrder} onChange={(e) => setNewCouponForm({ ...newCouponForm, minOrder: e.target.value })} className="border rounded-lg px-3 py-2" />
                  <button type="submit" className="rounded-lg bg-[#1C1B29] text-[#F3EFE7] font-bold">Create</button>
                </form>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((c) => (
                    <div key={c.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                      <div><p className="font-bold text-sm">{c.code}</p><p className="text-xs text-[#1C1B29]/60">{c.type === 'PERCENTAGE' ? `${c.value}% off` : `₹${c.value} off`} · Min ₹{c.minOrder}</p></div>
                      <button onClick={() => setCoupons((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)))} className={`px-3 py-1 rounded-full text-xs font-bold ${c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>{c.active ? 'Active' : 'Paused'}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminSection === 'orders' && (
              <div className="space-y-4">
                <h1 className="font-serif-brand text-3xl font-medium">Order Management</h1>
                {orders.map((o) => (
                  <div key={o.orderId} className="bg-white p-5 rounded-xl border flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <p className="font-bold text-sm">{o.orderId} · {o.customerName} ({o.paymentMethod})</p>
                      <p className="text-xs text-[#1C1B29]/70 mt-1">{o.items.map((i) => `${i.title} ×${i.qty}`).join(', ')}</p>
                      <p className="text-xs font-bold text-[#B8905C] mt-1">₹{o.total.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={o.status}
                        onChange={(e) => {
                          setOrders((prev) => prev.map((x) => (x.orderId === o.orderId ? { ...x, status: e.target.value } : x)));
                          showToast(`Order updated to ${e.target.value}`);
                        }}
                        className="bg-[#1C1B29] text-[#F3EFE7] text-xs font-bold rounded-lg px-3 py-2"
                      >
                        {ORDER_STATUSES.map((st) => <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>)}
                      </select>
                      <button onClick={() => setInvoiceOrder(o)} className="p-2 rounded-lg border"><FileText className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ====================================================================
          PRODUCT DETAIL MODAL
         ==================================================================== */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          {(() => {
            const v = getActiveVariant(detailProduct);
            return (
              <div className="bg-[#F3EFE7] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
                <div className="h-72 md:h-auto relative">
                  <ProductPhoto src={v.photoUrl} fallback={detailProduct.fallbackPhoto} alt={detailProduct.title} colorHex={v.colorHex} />
                  <button onClick={() => setDetailProductId(null)} className="absolute top-3 left-3 p-2 rounded-full bg-[#1C1B29]/80 text-[#F3EFE7]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#B8905C] font-bold">{detailProduct.category}</p>
                    <h2 className="font-serif-brand text-2xl font-medium mt-1">{detailProduct.title}</h2>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-bold">₹{v.salePrice.toLocaleString('en-IN')}</span>
                      <span className="text-sm line-through text-[#1C1B29]/45">₹{v.mrp.toLocaleString('en-IN')}</span>
                      <span className="text-xs font-bold text-emerald-700">{v.discountPercent}% OFF</span>
                    </div>
                    <p className="text-xs text-[#1C1B29]/75 mt-3 leading-relaxed">{detailProduct.description}</p>
                    <div className="mt-4">
                      <p className="text-xs font-bold mb-2">Color: <span className="text-[#B8905C]">{v.colorName}</span></p>
                      <div className="flex gap-2">
                        {detailProduct.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => setActiveVariantMap((prev) => ({ ...prev, [detailProduct.id]: variant.id }))}
                            className={`w-7 h-7 rounded-full border ${variant.id === v.id ? 'ring-2 ring-offset-2 ring-[#B8905C] border-[#1C1B29]' : 'border-[#1C1B29]/30'}`}
                            style={{ backgroundColor: variant.colorHex }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#1C1B29]/12 grid grid-cols-2 gap-1.5 text-[11px] text-[#1C1B29]/70">
                      <span>Material: {detailProduct.materialType}</span>
                      <span>Design: {detailProduct.designStyle}</span>
                      <span>HSN: {detailProduct.hsnCode}</span>
                      <span>Origin: {detailProduct.countryOfOrigin}</span>
                      <span className="col-span-2 text-emerald-800 font-semibold">✓ 7-Day Return & Replacement Policy</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { addToCart(detailProduct.id, v.id); setDetailProductId(null); setCartOpen(true); }}
                      className="flex-1 py-3 rounded-xl bg-[#1C1B29] text-[#F3EFE7] hover:bg-[#B8905C] hover:text-[#1C1B29] font-bold text-xs transition"
                    >
                      Add to Bag · ₹{v.salePrice.toLocaleString('en-IN')}
                    </button>
                    <button onClick={() => handleShareProduct(detailProduct)} className="p-3 rounded-xl border border-[#1C1B29]/20 hover:bg-white">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ====================================================================
          CART & WISHLIST DRAWERS
         ==================================================================== */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-md bg-[#F3EFE7] h-full flex flex-col shadow-2xl">
            <div className="p-5 bg-[#1C1B29] text-[#F3EFE7] flex items-center justify-between">
              <h2 className="font-serif-brand text-xl">Your Bag ({cartDetails.count})</h2>
              <button onClick={() => setCartOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cartDetails.items.length === 0 ? (
                <p className="text-center text-sm text-[#1C1B29]/60 py-16">Your bag is empty.</p>
              ) : (
                cartDetails.items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="bg-white p-3.5 rounded-xl border flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <ProductPhoto src={item.variant.photoUrl} fallback={item.product.fallbackPhoto} alt={item.product.title} colorHex={item.variant.colorHex} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs truncate">{item.product.title}</p>
                      <p className="text-[11px] text-[#1C1B29]/60">{item.variant.colorName} · ₹{item.variant.salePrice}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 border rounded-lg px-2 py-0.5">
                          <button onClick={() => updateCartQty(item.productId, item.variantId, -1)}><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-bold">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.productId, item.variantId, 1)}><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => updateCartQty(item.productId, item.variantId, -item.qty)} className="text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {cartDetails.items.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-[11px] font-bold mb-1.5">Coupon (Try WELCOME15 or ORAYVE200)</p>
                  <div className="flex gap-2">
                    <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code" className="flex-1 bg-white border rounded-lg px-3 py-2 text-xs uppercase" />
                    <button onClick={handleApplyCoupon} className="px-4 py-2 rounded-lg bg-[#1C1B29] text-[#D6B98C] text-xs font-bold">Apply</button>
                  </div>
                </div>
              )}
            </div>
            {cartDetails.items.length > 0 && (
              <div className="p-5 bg-white border-t space-y-2">
                <div className="flex justify-between text-xs"><span>Subtotal</span><span>₹{cartDetails.subtotal.toLocaleString('en-IN')}</span></div>
                {cartDetails.discount > 0 && <div className="flex justify-between text-xs text-emerald-700 font-semibold"><span>Discount ({appliedCouponCode})</span><span>-₹{cartDetails.discount.toLocaleString('en-IN')}</span></div>}
                <div className="flex justify-between text-base font-bold pt-1"><span>Total</span><span>₹{cartDetails.total.toLocaleString('en-IN')}</span></div>
                <button onClick={() => { setCartOpen(false); setCheckoutStep(1); setView('checkout'); }} className="w-full py-3 rounded-xl bg-[#1C1B29] text-[#F3EFE7] hover:bg-[#B8905C] hover:text-[#1C1B29] font-bold text-sm transition">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {wishlistOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-md bg-[#F3EFE7] h-full flex flex-col shadow-2xl">
            <div className="p-5 bg-[#1C1B29] text-[#F3EFE7] flex items-center justify-between">
              <h2 className="font-serif-brand text-xl">Wishlist ({wishlist.length})</h2>
              <button onClick={() => setWishlistOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {wishlist.map((pid) => {
                const p = products.find((x) => x.id === pid);
                if (!p) return null;
                const v = getActiveVariant(p);
                return (
                  <div key={pid} className="bg-white p-3.5 rounded-xl border flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <ProductPhoto src={v.photoUrl} fallback={p.fallbackPhoto} alt={p.title} colorHex={v.colorHex} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs truncate">{p.title}</p>
                      <p className="text-xs font-bold text-[#B8905C]">₹{v.salePrice}</p>
                    </div>
                    <button onClick={() => { addToCart(p.id, v.id); toggleWishlist(p.id); }} className="px-3 py-1.5 rounded-lg bg-[#1C1B29] text-[#F3EFE7] text-[11px] font-bold">
                      Move to Cart
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          PRINTABLE GST PDF INVOICE MODAL
         ==================================================================== */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between bg-[#F3EFE7]">
              <span className="text-xs font-bold uppercase">Tax Invoice · {invoiceOrder.invoiceNumber}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg bg-[#1C1B29] text-[#F3EFE7] text-xs font-bold flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button onClick={() => setInvoiceOrder(null)} className="p-1.5 rounded-lg hover:bg-black/10"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div id="printable-invoice" className="p-7 space-y-5 text-xs">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <OrayveLogo dark={false} size="sm" />
                  <p className="text-[10px] uppercase tracking-widest text-[#B8905C] mt-1 font-bold">Small Details. Big Presence.</p>
                  <p className="text-[#1C1B29]/65 mt-1">ORAYVE Retail India · orayve.in · GSTIN: 27AABCO1234F1Z5</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">TAX INVOICE</p>
                  <p>Invoice: {invoiceOrder.invoiceNumber}</p>
                  <p>Order: {invoiceOrder.orderId}</p>
                  <p>{invoiceOrder.createdAt}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold uppercase text-[10px] text-[#1C1B29]/55">Shipped To</p>
                  <p className="font-bold">{invoiceOrder.address.recipientName}</p>
                  <p>{invoiceOrder.address.street}, {invoiceOrder.address.city} - {invoiceOrder.address.pincode}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold uppercase text-[10px] text-[#1C1B29]/55">Payment</p>
                  <p>{invoiceOrder.paymentMethod} · PAID</p>
                </div>
              </div>
              <table className="w-full text-left border-t border-b">
                <thead className="bg-[#F3EFE7]">
                  <tr><th className="p-2">Item</th><th className="p-2">HSN</th><th className="p-2 text-right">Price</th><th className="p-2 text-right">Qty</th><th className="p-2 text-right">Total</th></tr>
                </thead>
                <tbody className="divide-y">
                  {invoiceOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2"><p className="font-semibold">{item.title}</p><p className="text-[10px] text-[#1C1B29]/60">{item.colorName} · {item.sku}</p></td>
                      <td className="p-2">{item.hsnCode}</td>
                      <td className="p-2 text-right">₹{item.salePrice}</td>
                      <td className="p-2 text-right">{item.qty}</td>
                      <td className="p-2 text-right font-bold">₹{(item.salePrice * item.qty).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end">
                <div className="w-56 space-y-1">
                  <div className="flex justify-between"><span>Subtotal (Incl. GST)</span><span>₹{invoiceOrder.subtotal.toLocaleString('en-IN')}</span></div>
                  {invoiceOrder.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount</span><span>-₹{invoiceOrder.discount.toLocaleString('en-IN')}</span></div>}
                  <div className="flex justify-between font-bold text-sm border-t pt-1.5"><span>Grand Total</span><span>₹{invoiceOrder.total.toLocaleString('en-IN')}</span></div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#F3EFE7] border border-[#B8905C]/30 text-[11px]">
                <strong>7-Day Return & Replacement Policy:</strong> Eligible within 7 days of delivery in original Orayve packaging. Country of Origin: China.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 ${toast.tone === 'error' ? 'bg-rose-700 text-white' : 'bg-[#1C1B29] text-[#D6B98C] border border-[#B8905C]/50'}`}>
          <Sparkles className="w-3.5 h-3.5" /> {toast.message}
        </div>
      )}
    </div>
  );
}