const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

// Customer details rename
content = content.replace(
  /<h4 className="font-bold text-\[#1F4D3A\] uppercase tracking-wider text-\[10px\] border-b border-stone-200 pb-2">Customer Profile \(Auth Details\)<\/h4>/g,
  `<h4 className="font-bold text-[#1F4D3A] uppercase tracking-wider text-[10px] border-b border-stone-200 pb-2">Customer Details</h4>`
);

// Order communication details
// Look for where to insert Order Communication Details.
// Just insert it after Customer Details block.
const customerProfileRegex = /(<h4 className="font-bold text-\[#1F4D3A\] uppercase tracking-wider text-\[10px\] border-b border-stone-200 pb-2">Customer Details<\/h4>\s*<div className="space-y-3">\s*<div>\s*<span className="text-\[#757575\] block text-\[9px\] uppercase tracking-widest">Full Name<\/span>\s*<span className="font-semibold text-stone-850 text-sm block mt-0\.5">\{selectedOrderDetail\.fullName\}<\/span>\s*<\/div>\s*<div>\s*<span className="text-\[#757575\] block text-\[9px\] uppercase tracking-widest">Email Address<\/span>\s*<span className="text-stone-850 text-sm block mt-0\.5">\{selectedOrderDetail\.email\}<\/span>\s*<\/div>\s*<div>\s*<span className="text-\[#757575\] block text-\[9px\] uppercase tracking-widest">Contact Number<\/span>\s*<span className="text-stone-850 text-sm block mt-0\.5">\{selectedOrderDetail\.phone\}<\/span>\s*<\/div>\s*<\/div>\s*<\/div>)/;

const match = content.match(customerProfileRegex);
if (match) {
  const replacement = match[1] + `
                  <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 space-y-4">
                    <h4 className="font-bold text-[#1F4D3A] uppercase tracking-wider text-[10px] border-b border-stone-200 pb-2">Order Communication Details</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[#757575] block text-[9px] uppercase tracking-widest">Confirmation Email</span>
                        <span className="text-stone-850 text-sm block mt-0.5">{selectedOrderDetail.confirmationEmail || selectedOrderDetail.email}</span>
                      </div>
                      <div>
                        <span className="text-[#757575] block text-[9px] uppercase tracking-widest">Confirmation Phone (WhatsApp)</span>
                        <span className="text-stone-850 text-sm block mt-0.5">{selectedOrderDetail.confirmationPhone || selectedOrderDetail.phone}</span>
                      </div>
                    </div>
                  </div>`;
  content = content.replace(customerProfileRegex, replacement);
}

fs.writeFileSync('src/pages/AdminPage.tsx', content);
console.log('done AdminPage details block');
