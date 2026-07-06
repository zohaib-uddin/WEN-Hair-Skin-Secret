const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Add loading="lazy" to standard img tags if not already present
  // using regex for <img ... >
  content = content.replace(/<img([^>]+)>/g, (match, attrs) => {
    if (attrs.includes('loading=')) return match;
    // Don't lazy load if it's in a critical file like HeroSection
    if (filePath.includes('HeroSection.tsx') || filePath.includes('Header.tsx')) return match;
    
    return `<img${attrs} loading="lazy">`;
  });

  content = content.replace(/<motion\.img([^>]+)>/g, (match, attrs) => {
    if (attrs.includes('loading=')) return match;
    if (filePath.includes('HeroSection.tsx') || filePath.includes('Header.tsx')) return match;
    return `<motion.img${attrs} loading="lazy">`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      traverse(filePath);
    } else if (filePath.endsWith('.tsx')) {
      processFile(filePath);
    }
  }
}

traverse('src/pages');
traverse('src/components');
