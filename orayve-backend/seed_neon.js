import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

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

async function seed() {
  const client = await pool.connect();
  console.log('Seeding Neon database...');

  // 1. Seed Categories
  for (const [cat, hsn] of CAT_DATA) {
    const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await client.query(`
      INSERT INTO catalog_schema.categories (name, slug, hsn_code, is_active)
      VALUES ($1, $2, $3, TRUE)
      ON CONFLICT (name) DO UPDATE SET hsn_code = EXCLUDED.hsn_code;
    `, [cat, slug, hsn]);
  }
  console.log('✅ 13 Categories seeded.');

  // 2. Seed Products & Variants
  let n = 0;
  for (let ci = 0; ci < CAT_DATA.length; ci++) {
    const [cat, hsn, sk, base, noun, sty, sw, ph] = CAT_DATA[ci];
    const photos = ph.split(' ');

    for (let i = 0; i < 20; i++) {
      n++;
      const price = base + (i % 6) * 150;
      const d = 20 + ((i * 7) % 21);
      const mrp = Math.round(price / (1 - d / 100));
      const pid = 'p' + n;
      const title = `${PRE[i]} ${sty[i % 4]} ${noun}`;
      const slug = `${pid}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
      const rate = +(4.4 + ((ci + i) % 7) * 0.1).toFixed(1);
      const rev = 24 + ((n * 17) % 210);
      const views = 450 + ((n * 131) % 2100);
      const sold = i % 5 ? 35 + ((n * 13) % 140) : 12 + (i % 8);
      const couponEligible = i % 6 !== 0;

      await client.query(`
        INSERT INTO catalog_schema.products (
          product_id, category_name, title, slug, design_style, hsn_code,
          rating_avg, review_count, view_count, total_units_sold, is_coupon_applicable
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (product_id) DO NOTHING;
      `, [pid, cat, title, slug, sty[i % 4], hsn, rate, rev, views, sold, couponEligible]);

      // Variants
      const swatches = SW[sw];
      for (let k = 0; k < swatches.length; k++) {
        const [c, h] = swatches[k];
        const vid = pid + 'v' + k;
        const sku = `ORV-${sk}-${String(i + 1).padStart(2, '0')}-${k + 1}`;
        const photo = photos[(i + k) % photos.length];
        const vMrp = mrp + k * 50;
        const vPrice = price + k * 50;
        const stock = (n + k * 3) % 14 ? 18 + ((n * 5 + k * 7) % 48) : 6;

        await client.query(`
          INSERT INTO catalog_schema.product_variants (
            variant_id, product_id, sku, color_name, color_hex, photo_url,
            mrp_price, discount_percent, sale_price, stock_quantity
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (variant_id) DO NOTHING;
        `, [vid, pid, sku, c, h, photo, vMrp, d, vPrice, stock]);
      }
    }
  }
  console.log(`✅ 260 Products and ${n * 3} Variants seeded.`);

  // 3. Seed Coupons
  const coupons = [
    { code: 'WELCOME15', type: 'P', val: 15, max: 500, min: 500 },
    { code: 'ORAYVE200', type: 'F', val: 200, max: 200, min: 999 }
  ];
  for (const cp of coupons) {
    await client.query(`
      INSERT INTO order_schema.coupons (code, discount_type, discount_value, min_order_amount, max_discount_cap, is_active)
      VALUES ($1, $2, $3, $4, $5, TRUE)
      ON CONFLICT (code) DO NOTHING;
    `, [cp.code, cp.type, cp.val, cp.min, cp.max]);
  }
  console.log('✅ Coupons seeded.');

  // 4. Seed Super Admin
  await client.query(`
    INSERT INTO auth_schema.users (full_name, email, mobile_number, role, is_email_verified, is_mobile_verified)
    VALUES ('Orayve Super Admin', 'admin@orayve.in', '9999999999', 'ROLE_SUPER_ADMIN', TRUE, TRUE)
    ON CONFLICT (email) DO NOTHING;
  `);
  console.log('✅ Super Admin seeded.');

  // Check counts
  const catCount = await client.query('SELECT count(*) FROM catalog_schema.categories;');
  const prodCount = await client.query('SELECT count(*) FROM catalog_schema.products;');
  const varCount = await client.query('SELECT count(*) FROM catalog_schema.product_variants;');
  const coupCount = await client.query('SELECT count(*) FROM order_schema.coupons;');
  const userCount = await client.query('SELECT count(*) FROM auth_schema.users;');

  console.log('\n--- LIVE DATABASE SUMMARY ---');
  console.log(`Categories in DB: ${catCount.rows[0].count}`);
  console.log(`Products in DB:   ${prodCount.rows[0].count}`);
  console.log(`Variants in DB:   ${varCount.rows[0].count}`);
  console.log(`Coupons in DB:    ${coupCount.rows[0].count}`);
  console.log(`Users in DB:      ${userCount.rows[0].count}`);

  client.release();
  await pool.end();
}

seed().catch(err => {
  console.error('❌ Seeding error:', err.message);
  process.exit(1);
});
