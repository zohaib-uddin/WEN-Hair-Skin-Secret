const fs = require('fs');
const file = 'src/components/account/OrderDetailView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Customer Details rename and fields
content = content.replace(
  /<User className="w-\[16px\] h-\[16px\]" \/> Customer Profile \(Auth Details\)/g,
  `<User className="w-[16px] h-[16px]" /> Customer Details`
);

// If it's already "Customer Details" or "Customer Profile (Auth Details)":
if (content.includes("Customer Details")) {
  console.log("Customer Details heading found.");
} else {
  // try another replace just in case it was modified
}

content = content.replace(
  /<span className="text-\[11px\] text-\[#6b6b6b\]">Email Address<\/span>\s*<span>\{order\.email \|\| "N\/A"\}<\/span>/,
  `<span className="text-[11px] text-[#6b6b6b]">Email Address</span>
                <span>{order.user_email || order.email || "N/A"}</span>`
);

// Order Communication Details
content = content.replace(
  /<span className="text-\[11px\] text-\[#6b6b6b\]">Confirmation Email<\/span>\s*<span>\{order\.email \|\| "N\/A"\}<\/span>/,
  `<span className="text-[11px] text-[#6b6b6b]">Confirmation Email</span>
                <span>{order.confirmation_email || order.email || "N/A"}</span>`
);
content = content.replace(
  /<span className="text-\[11px\] text-\[#6b6b6b\]">Confirmation Phone \(WhatsApp\)<\/span>\s*<span>\{order\.shippingPhone \|\| order\.phone \|\| "N\/A"\}<\/span>/,
  `<span className="text-[11px] text-[#6b6b6b]">Confirmation Phone (WhatsApp)</span>
                <span>{order.confirmation_phone || order.phone || "N/A"}</span>`
);

// Special Instructions
content = content.replace(
  /<div className="flex flex-col"><span className="text-\[11px\] text-\[#6b6b6b\]">Special Instructions<\/span><span>\{order\.specialInstructions \|\| "None"\}<\/span><\/div>/,
  `<div className="flex flex-col"><span className="text-[11px] text-[#6b6b6b]">Special Instructions</span><span>{order.special_instructions || order.specialInstructions || "None"}</span></div>`
);

// Category and concern
content = content.replace(
  /<h4 className="font-bold text-\[15px\] text-\[#1F4D3A\] line-clamp-1">\{item\.name\}<\/h4>\s*<p className="text-\[12px\] text-\[#6b6b6b\] mt-0\.5">Target: \{item\.category \|\| item\.concern \|\| "General"\}<\/p>/,
  `{(item.category || item.concern) && (
                      <p className="text-[10px] text-[#C9A227] font-bold tracking-[0.15em] uppercase mb-1">
                        {[item.category, item.concern].filter(Boolean).join(" • ")}
                      </p>
                    )}
                    <h4 className="font-bold text-[15px] text-[#1F4D3A] line-clamp-1">{item.name}</h4>`
);

fs.writeFileSync(file, content);
console.log('done OrderDetailView');
