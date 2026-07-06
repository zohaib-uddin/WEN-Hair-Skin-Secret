const fs = require('fs');
let content = fs.readFileSync('app/checkout/page.tsx', 'utf8');

// Replace left column bg
content = content.replace(/className="lg:col-span-7 bg-\[#F7F2EA\]\/20 border border-gray-100 rounded-3xl p-6 sm:p-10 space-y-8"/g, 
  'className="lg:col-span-7 space-y-[32px]"');
  
// Replace buttons
content = content.replace(/className="px-6 py-4 bg-\[#1F4D3A\] hover:bg-\[#C9A227\] transition text-white font-bold text-xs uppercase tracking-widest rounded-xl cursor-pointer flex items-center gap-1\.5 shadow-md"/g, 
  'className="px-[32px] py-[16px] bg-[#1F4D3A] hover:bg-[#1a4030] transition text-white font-bold text-[14px] uppercase tracking-wide rounded-[12px] cursor-pointer flex items-center justify-center shadow-md"');

content = content.replace(/className="px-6 py-4 bg-\[#1F4D3A\] hover:bg-\[#C9A227\] transition text-white text-xs uppercase tracking-widest rounded-xl cursor-pointer flex items-center gap-1\.5 shadow-md"/g, 
  'className="px-[32px] py-[16px] bg-[#1F4D3A] hover:bg-[#1a4030] transition text-white font-bold text-[14px] uppercase tracking-wide rounded-[12px] cursor-pointer flex items-center justify-center shadow-md"');

content = content.replace(/className="px-6 py-4 bg-\[#1F4D3A\] hover:bg-\[#C9A227\] transition text-white text-xs uppercase tracking-widest rounded-xl cursor-pointer flex items-center gap-1\.5 shadow-md disabled:opacity-50"/g, 
  'className="px-[32px] py-[16px] bg-[#1F4D3A] hover:bg-[#1a4030] transition text-white font-bold text-[14px] uppercase tracking-wide rounded-[12px] cursor-pointer flex items-center justify-center shadow-md disabled:opacity-50"');

// Typography adjustments
content = content.replace(/font-playfair text-2xl sm:text-3xl font-extrabold text-\[#1F4D3A\]/g, 
  'font-playfair text-[28px] sm:text-[32px] font-bold text-[#1F4D3A]');

content = content.replace(/text-\[10px\] font-bold font-mono tracking-widest text-\[#C9A227\] uppercase block mb-1/g, 
  'text-[12px] font-bold tracking-widest text-[#6b6b6b] uppercase block mb-2');

// Fix payment options styling
content = content.replace(/p-5 border rounded-2xl cursor-pointer transition text-left flex flex-col justify-between h-32 \$\{/g, 
  'p-[24px] border rounded-[12px] cursor-pointer transition text-left flex flex-col justify-between h-[140px] ${');

content = content.replace(/paymentChoice === "COD" \n                          \? "border-2 border-\[#C9A227\] bg-\[#F7F2EA\]\/30 text-\[#1F4D3A\]" \n                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"/g, 
  'paymentChoice === "COD" ? "border-2 border-[#1F4D3A] bg-white text-[#1F4D3A]" : "border-[#e5e5e5] bg-white text-[#6b6b6b] hover:border-[#1F4D3A]"');

content = content.replace(/paymentChoice === "Card" \n                          \? "border-2 border-\[#C9A227\] bg-\[#F7F2EA\]\/30 text-\[#1F4D3A\]" \n                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"/g, 
  'paymentChoice === "Card" ? "border-2 border-[#1F4D3A] bg-white text-[#1F4D3A]" : "border-[#e5e5e5] bg-white text-[#6b6b6b] hover:border-[#1F4D3A]"');

// Fix shipping methods styling
content = content.replace(/p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition \$\{/g, 
  'p-[20px] border rounded-[12px] flex items-center justify-between cursor-pointer transition ${');

content = content.replace(/deliveryMethod === "standard" \n                            \? "border-2 border-\[#C9A227\] bg-\[#F7F2EA\]\/30 text-\[#1F4D3A\] font-bold" \n                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"/g, 
  'deliveryMethod === "standard" ? "border-2 border-[#1F4D3A] bg-white text-[#1F4D3A] font-bold" : "border-[#e5e5e5] bg-white text-[#6b6b6b] hover:border-[#1F4D3A]"');

content = content.replace(/deliveryMethod === "express" \n                            \? "border-2 border-\[#C9A227\] bg-\[#F7F2EA\]\/30 text-\[#1F4D3A\] font-bold" \n                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"/g, 
  'deliveryMethod === "express" ? "border-2 border-[#1F4D3A] bg-white text-[#1F4D3A] font-bold" : "border-[#e5e5e5] bg-white text-[#6b6b6b] hover:border-[#1F4D3A]"');


fs.writeFileSync('app/checkout/page.tsx', content);
