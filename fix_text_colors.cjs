const fs = require('fs');
let content = fs.readFileSync('app/checkout/page.tsx', 'utf8');

// Replace gray text classes
content = content.replace(/text-gray-400/g, 'text-[#757575]');
content = content.replace(/text-gray-500/g, 'text-[#757575]');
content = content.replace(/text-gray-600/g, 'text-[#757575]');
content = content.replace(/text-gray-700/g, 'text-[#2C2C2C]');
content = content.replace(/text-gray-800/g, 'text-[#2C2C2C]');
content = content.replace(/text-gray-900/g, 'text-[#2C2C2C]');
content = content.replace(/text-black/g, 'text-[#1a1a1a]');

// Fix spacing / borders where gray is used
content = content.replace(/border-gray-100/g, 'border-[#e5e5e5]');
content = content.replace(/border-gray-200/g, 'border-[#e5e5e5]');
content = content.replace(/border-gray-300/g, 'border-[#e5e5e5]');

fs.writeFileSync('app/checkout/page.tsx', content);

let summary = fs.readFileSync('components/checkout/OrderSummary.tsx', 'utf8');
summary = summary.replace(/text-gray-400/g, 'text-[#757575]');
summary = summary.replace(/text-gray-500/g, 'text-[#757575]');
summary = summary.replace(/text-gray-600/g, 'text-[#757575]');
summary = summary.replace(/text-gray-700/g, 'text-[#2C2C2C]');
summary = summary.replace(/text-gray-800/g, 'text-[#2C2C2C]');
summary = summary.replace(/text-gray-900/g, 'text-[#2C2C2C]');
summary = summary.replace(/text-black/g, 'text-[#1a1a1a]');

summary = summary.replace(/border-gray-100/g, 'border-[#e5e5e5]');
summary = summary.replace(/border-gray-200/g, 'border-[#e5e5e5]');
summary = summary.replace(/border-gray-300/g, 'border-[#e5e5e5]');

fs.writeFileSync('components/checkout/OrderSummary.tsx', summary);
