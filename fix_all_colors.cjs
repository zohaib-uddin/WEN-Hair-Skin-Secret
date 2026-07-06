const fs = require('fs');
const path = require('path');

function replaceColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  content = content.replace(/text-gray-400/g, 'text-[#757575]');
  content = content.replace(/text-gray-500/g, 'text-[#757575]');
  content = content.replace(/text-gray-600/g, 'text-[#757575]');
  content = content.replace(/text-gray-700/g, 'text-[#2C2C2C]');
  content = content.replace(/text-gray-800/g, 'text-[#2C2C2C]');
  content = content.replace(/text-gray-900/g, 'text-[#2C2C2C]');
  content = content.replace(/text-black/g, 'text-[#1a1a1a]');
  
  content = content.replace(/border-gray-100/g, 'border-[#e5e5e5]');
  content = content.replace(/border-gray-200/g, 'border-[#e5e5e5]');
  content = content.replace(/border-gray-300/g, 'border-[#e5e5e5]');
  
  content = content.replace(/bg-gray-50/g, 'bg-[#f5f5f5]');
  content = content.replace(/bg-gray-100/g, 'bg-[#f5f5f5]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
  }
}

function traverseAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      traverseAndReplace(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      replaceColorsInFile(filePath);
    }
  }
}

traverseAndReplace('src/pages');
traverseAndReplace('src/components');
