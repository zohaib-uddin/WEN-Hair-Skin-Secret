const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// In Admin order details fetch
content = content.replace(
  /\.select\("\*, order_items\(\*, products\(\*\)\)"\)/g,
  `.select("*, order_items(*, products(*, categories(name)))")`
);

fs.writeFileSync('server.ts', content);

// Now fix AdminPage.tsx mapping of items
let adminContent = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

adminContent = adminContent.replace(
  /const items = o.order_items \? o.order_items.map\(\(oi: any\) => \(\{/,
  `const items = o.order_items ? o.order_items.map((oi: any) => ({
                    category: oi.products?.category || oi.products?.categories?.name || oi.category,
                    concern: oi.products?.concern || oi.concern,`
);

adminContent = adminContent.replace(
  /<p className="text-stone-700 leading-relaxed mt-1 text-\[11px\] italic">\{selectedOrderDetail\.specialInstructions \|\| "N\/A"\}<\/p>/g,
  `<p className="text-stone-700 leading-relaxed mt-1 text-[11px] italic">{selectedOrderDetail.special_instructions || selectedOrderDetail.specialInstructions || "N/A"}</p>`
);

// Target fix in AdminPage.tsx
adminContent = adminContent.replace(
  /Target: \{displayTarget\}/g,
  `{displayTarget}`
);

fs.writeFileSync('src/pages/AdminPage.tsx', adminContent);
console.log('done fixing admin');
