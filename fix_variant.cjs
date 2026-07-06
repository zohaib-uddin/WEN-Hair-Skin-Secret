const fs = require('fs');

const replaceInFile = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  if (!content.includes('getSmallestVariant')) {
    if (file.includes('ShopContext.tsx')) {
        content = 'import { getSmallestVariant } from "../lib/utils/variant";\n' + content;
    } else {
        content = 'import { getSmallestVariant } from "../../lib/utils/variant";\n' + content;
    }
  }

  // Quick fixes
  content = content.replace(/product\.variants\?\.\[0\] \|\| product\.size \|\| ""/g, 'getSmallestVariant(product.variants, product.size)');
  content = content.replace(/p\.variants\?\.\[0\] \|\| p\.size \|\| ""/g, 'getSmallestVariant(p.variants, p.size)');
  content = content.replace(/matchedProd\.variants\?\.\[0\] \|\| matchedProd\.size \|\| ""/g, 'getSmallestVariant(matchedProd.variants, matchedProd.size)');
  content = content.replace(/product\.variants\[0\]\) \|\| product\.size \|\| ""/g, 'product.variants) || product.size || ""');
  
  if (original !== content) {
    fs.writeFileSync(file, content);
    console.log('Updated:', file);
  }
};

const files = [
  'src/components/home/HeroSection.tsx',
  'src/components/home/BestSellersSection.tsx',
  'src/components/home/ProductCarousel.tsx',
  'src/components/shop/ProductCard.tsx',
  'src/components/layout/CartDrawer.tsx',
  'src/pages/WishlistPage.tsx',
  'src/context/ShopContext.tsx'
];

for (const f of files) {
    // Check if the file path needs adjusting for imports, wait WishlistPage is in src/pages
    let content = fs.readFileSync(f, 'utf8');
    let original = content;
    
    if (!content.includes('getSmallestVariant')) {
        if (f.startsWith('src/pages/') || f.startsWith('src/context/')) {
            content = 'import { getSmallestVariant } from "../lib/utils/variant";\n' + content;
        } else {
            content = 'import { getSmallestVariant } from "../../lib/utils/variant";\n' + content;
        }
    }
    
    content = content.replace(/product\.variants\?\.\[0\] \|\| product\.size \|\| ""/g, 'getSmallestVariant(product.variants, product.size)');
    content = content.replace(/p\.variants\?\.\[0\] \|\| p\.size \|\| ""/g, 'getSmallestVariant(p.variants, p.size)');
    content = content.replace(/matchedProd\.variants\?\.\[0\] \|\| matchedProd\.size \|\| ""/g, 'getSmallestVariant(matchedProd.variants, matchedProd.size)');
    
    if (original !== content) {
        fs.writeFileSync(f, content);
        console.log('Updated:', f);
    }
}
console.log("Done");
