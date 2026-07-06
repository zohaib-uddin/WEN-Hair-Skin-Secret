const fs = require('fs');
const files = [
  'src/components/home/HowItWorks.tsx',
  'src/components/home/WenPhilosophy.tsx',
  'src/components/home/CategoriesShowcase.tsx',
  'src/components/home/TestimonialSection.tsx',
  'src/components/home/VideoGuidesSection.tsx',
  'src/components/home/InstagramFeed.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{.*?\} import \{ useScrollArrows \}.*?from "lucide-react";/s, function(match) {
      let parts = match.split('import { useScrollArrows } from "../../hooks/useScrollArrows";');
      return parts[0].trim() + ' \nimport { useScrollArrows } from "../../hooks/useScrollArrows";';
  });
  // Another attempt if the regex didn't work:
  if (content.includes('import { useScrollArrows } from "../../hooks/useScrollArrows"; from "lucide-react";')) {
      content = content.replace('import { useScrollArrows } from "../../hooks/useScrollArrows"; from "lucide-react";', 'from "lucide-react";\nimport { useScrollArrows } from "../../hooks/useScrollArrows";');
  }
  fs.writeFileSync(file, content);
});
console.log('done');
