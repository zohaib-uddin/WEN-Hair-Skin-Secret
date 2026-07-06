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

  // Add the import
  if (!content.includes('useScrollArrows')) {
    content = content.replace(
      /import \{.*ArrowLeft.*\}/g, 
      "$& \nimport { useScrollArrows } from \"../../hooks/useScrollArrows\";"
    );
  }

  // Find scrollContainerRef declaration
  const refMatch = content.match(/const \w+Ref = useRef<HTMLDivElement>\(null\);/);
  if (refMatch && !content.includes('useScrollArrows(')) {
    const refName = refMatch[0].match(/const (\w+Ref)/)[1];
    content = content.replace(
      refMatch[0],
      `${refMatch[0]}\n  const { isAtStart, isAtEnd } = useScrollArrows(${refName});`
    );
  }

  // Replace Left button
  content = content.replace(
    /<button[^>]*onClick=\{scrollLeft\}[^>]*className="([^"]+)"[^>]*>[\s\S]*?<ArrowLeft[^>]*>[\s\S]*?<\/button>/,
    `<button
            onClick={scrollLeft}
            className={\`absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-[#1F4D3A] transition-all duration-300 cursor-pointer \${
              isAtStart ? "opacity-0 pointer-events-none translate-x-[-10px]" : "opacity-100 translate-x-0"
            }\`}
            aria-label="Scroll left"
          >
            <ArrowLeft size={28} strokeWidth={2.5} className="md:w-8 md:h-8" />
          </button>`
  );

  // Replace Right button
  content = content.replace(
    /<button[^>]*onClick=\{scrollRight\}[^>]*className="([^"]+)"[^>]*>[\s\S]*?<ArrowRight[^>]*>[\s\S]*?<\/button>/,
    `<button
            onClick={scrollRight}
            className={\`absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-[#1F4D3A] transition-all duration-300 cursor-pointer \${
              isAtEnd ? "opacity-0 pointer-events-none translate-x-[10px]" : "opacity-100 translate-x-0"
            }\`}
            aria-label="Scroll right"
          >
            <ArrowRight size={28} strokeWidth={2.5} className="md:w-8 md:h-8" />
          </button>`
  );

  fs.writeFileSync(file, content);
});

console.log('Done modifying arrows');
