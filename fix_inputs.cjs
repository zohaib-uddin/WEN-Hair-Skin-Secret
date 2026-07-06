const fs = require('fs');
let content = fs.readFileSync('app/checkout/page.tsx', 'utf8');

content = content.replace(/className=\{`w-full px-4 py-3\.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-1 transition \$\{/g, 
  'className={`w-full px-[20px] py-[16px] bg-white border rounded-[12px] text-[14px] focus:outline-none focus:ring-1 transition ${');

content = content.replace(/border-gray-200 focus:border-\[#C9A227\] focus:ring-\[#C9A227\]/g, 
  'border-[#e5e5e5] focus:border-[#1F4D3A] focus:ring-[#1F4D3A]');
  
// also replace the textarea and other inputs
content = content.replace(/className=\{`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-1 transition \$\{/g,
  'className={`w-full px-[20px] py-[16px] bg-white border rounded-[12px] text-[14px] focus:outline-none focus:ring-1 transition ${');

content = content.replace(/w-full px-4 py-3\.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium cursor-not-allowed opacity-80/g,
  'w-full px-[20px] py-[16px] bg-gray-50 border border-[#e5e5e5] rounded-[12px] text-[14px] font-medium cursor-not-allowed opacity-80');

content = content.replace(/w-full px-4 py-3\.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-\[#C9A227\] focus:border-\[#C9A227\] appearance-none cursor-pointer font-bold text-gray-700/g,
  'w-full px-[20px] py-[16px] bg-white border border-[#e5e5e5] rounded-[12px] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#1F4D3A] focus:border-[#1F4D3A] appearance-none cursor-pointer text-[#1a1a1a]');

content = content.replace(/w-full px-4 py-3\.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-\[#C9A227\] focus:ring-\[#C9A227\]/g,
  'w-full px-[20px] py-[16px] bg-white border border-[#e5e5e5] rounded-[12px] text-[14px] focus:outline-none focus:ring-1 focus:border-[#1F4D3A] focus:ring-[#1F4D3A]');

fs.writeFileSync('app/checkout/page.tsx', content);
