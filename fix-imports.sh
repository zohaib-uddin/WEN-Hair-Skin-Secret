files=(
  'src/components/home/HowItWorks.tsx'
  'src/components/home/WenPhilosophy.tsx'
  'src/components/home/CategoriesShowcase.tsx'
  'src/components/home/TestimonialSection.tsx'
  'src/components/home/VideoGuidesSection.tsx'
  'src/components/home/InstagramFeed.tsx'
)
for f in "${files[@]}"; do
  sed -i 's/} import { useScrollArrows } from "\.\.\/\.\.\/hooks\/useScrollArrows"; from "lucide-react";/} from "lucide-react";\nimport { useScrollArrows } from "..\/..\/hooks\/useScrollArrows";/g' "$f"
done
