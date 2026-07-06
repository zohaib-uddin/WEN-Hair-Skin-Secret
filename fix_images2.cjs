const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix / loading="lazy"> to loading="lazy" />
  content = content.replace(/\/\s*loading="lazy">/g, 'loading="lazy" />');
  
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
