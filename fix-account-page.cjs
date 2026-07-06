const fs = require('fs');
const file = 'src/pages/AccountPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// Inside mapped = data.orders.map((o: any) => {
content = content.replace(
  /const items = o.order_items \? o.order_items.map\(\(oi: any\) => \(\{\n\s*name: oi.product_name/,
  `const items = o.order_items ? o.order_items.map((oi: any) => ({
                  category: oi.products?.category || oi.products?.categories?.name || oi.category,
                  concern: oi.products?.concern || oi.concern,
                  name: oi.product_name`
);

content = content.replace(
  /return \{\n\s*orderId: o.order_number,/,
  `return {
                  orderId: o.order_number,
                  confirmation_email: o.confirmation_email,
                  confirmation_phone: o.confirmation_phone,
                  special_instructions: o.special_instructions,
                  user_email: profile?.email || user?.email || o.email,`
);

fs.writeFileSync(file, content);
console.log('done AccountPage.tsx');
