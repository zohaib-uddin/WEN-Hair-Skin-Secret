import { Product } from "../../types";

export const PRODUCTS: Product[] = [
  {
    id: "wen-hair-growth-oil",
    name: "Premium Hair Growth Oil",
    category: "Hair Oil",
    concern: "Hair Thinning & Fall",
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviewCount: 128,
    image: "/src/assets/images/hair_growth_oil_1781973152470.jpg",
    description: "Our signature hair growth oil is meticulously crafted with a blend of Argan Oil, Biotin, and Vitamin E. This powerful formula penetrates deep into hair follicles to stimulate growth, reduce hair fall, and restore natural shine. Perfect for all hair types.",
    potencyExplanation: "Stimulates hair growth & reduces hair fall naturally",
    keyBenefits: [
      "Promotes Hair Growth",
      "Reduces Hair Fall by 80%",
      "Strengthens Hair Roots",
      "Adds Natural Shine",
      "Nourishes Scalp"
    ],
    idealFor: [
      "Frizzy and thinning hair in humid climates",
      "Post-pregnancy or stress-related hair fall",
      "Dry, damaged scalp"
    ],
    howToUse: "Apply 5-10 drops on scalp and massage gently for 5 minutes. Leave overnight or minimum 2 hours. Use 3 times a week for best results.",
    ingredients: "Argan Oil, Biotin, Vitamin E, Coconut Oil, Almond Oil, Castor Oil",
    variants: ["100ml", "200ml"],
    selectedVariant: "100ml",
    isBestSeller: true,
    isNewArrival: false,
    reviewsList: [
      {
        id: "r1",
        author: "Ayesha Khan",
        city: "Lahore",
        rating: 5,
        date: "May 12, 2026",
        title: "Absolute Magic for Hair Fall!",
        text: "Since using this oil twice a week, my hair fall has almost completely stopped."
      }
    ]
  },
  {
    id: "wen-anti-hair-fall-shampoo",
    name: "Anti-Hair Fall Shampoo",
    category: "Shampoo",
    concern: "Hair Thinning & Fall",
    price: 899,
    originalPrice: 1099,
    rating: 4.6,
    reviewCount: 94,
    image: "/src/assets/images/shampoo_bottle_1781973196785.jpg",
    description: "Sulfate-free, paraben-free shampoo formulated with natural extracts to strengthen hair from roots. Gently cleanses while nourishing hair follicles to prevent breakage and hair fall.",
    potencyExplanation: "Sulfate-free formula for stronger, healthier hair",
    keyBenefits: [
      "Reduces Hair Fall",
      "Strengthens Roots",
      "Gentle Cleansing",
      "Adds Volume",
      "Natural Ingredients"
    ],
    idealFor: [
      "Sensitive scalps",
      "Thin and weak hair",
      "Daily gentle scalp cleansing"
    ],
    howToUse: "Apply on wet hair, massage gently for 2-3 minutes. Rinse thoroughly. Follow with Wen Conditioner for best results.",
    ingredients: "Biotin, Keratin, Argan Oil, Green Tea Extract, Aloe Vera",
    variants: ["250ml", "500ml"],
    selectedVariant: "250ml",
    isBestSeller: true,
    isNewArrival: false,
    reviewsList: [
      {
        id: "r2",
        author: "Fiza Fatima",
        city: "Faisalabad",
        rating: 5,
        date: "June 10, 2026",
        title: "Best sulfate-free brand!",
        text: "Clean, light, and lathers extremely well compared to other sulfate-free ones."
      }
    ]
  },
  {
    id: "wen-keratin-conditioner",
    name: "Keratin Hair Conditioner",
    category: "Conditioner",
    concern: "Hair Thinning & Fall",
    price: 799,
    originalPrice: 999,
    rating: 4.5,
    reviewCount: 72,
    image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600&auto=format&fit=crop",
    description: "Deep conditioning treatment with keratin protein to repair damaged hair, reduce frizz, and add silky smoothness.",
    potencyExplanation: "Locks in moisture & smoothens damaged hair strands",
    keyBenefits: [
      "Repairs Damaged Hair",
      "Reduces Frizz by 90%",
      "Smooths Cuticles",
      "Intense Moisture Lock",
      "Restores Elasticity"
    ],
    idealFor: [
      "Rough and frizzy hair texture",
      "Split ends and dry mid-lengths",
      "In-shower deep smoothing ritual"
    ],
    howToUse: "After shampooing, apply conditioner from mid-lengths to ends. Leave on for 2-3 minutes, then rinse thoroughly with cool water.",
    ingredients: "Hydrolyzed Keratin, Argan Oil, Shea Butter, Provitamin B5, Aloe Vera Extract",
    variants: ["200ml", "400ml"],
    selectedVariant: "200ml",
    isBestSeller: false,
    isNewArrival: true,
    reviewsList: []
  },
  {
    id: "wen-vit-c-serum",
    name: "Wen-C Vitamin C Serum",
    category: "Face Serum",
    concern: "Pigmentation & Dark Spots",
    price: 1499,
    originalPrice: 1899,
    rating: 4.9,
    reviewCount: 156,
    image: "/src/assets/images/vit_c_bottle_1782231487595.jpg",
    description: "Powerful antioxidant serum with 20% Vitamin C to brighten skin, reduce dark spots, and boost collagen production for youthful, radiant skin.",
    potencyExplanation: "Brightens skin & reduces dark spots effectively",
    keyBenefits: [
      "Brightens Skin Tone",
      "Reduces Dark Spots",
      "Boosts Collagen",
      "Anti-Aging",
      "Evens Skin Texture"
    ],
    idealFor: [
      "Dull with dark spots",
      "Suntanned skin complexion",
      "Daily radiant morning routines"
    ],
    howToUse: "Apply 3-4 drops on clean face and neck. Gently pat until absorbed. Use morning and evening. Follow with moisturizer and sunscreen.",
    ingredients: "Vitamin C (20%), Hyaluronic Acid, Vitamin E, Ferulic Acid, Niacinamide",
    variants: ["30ml", "50ml"],
    selectedVariant: "30ml",
    isBestSeller: true,
    isNewArrival: false,
    reviewsList: []
  },
  {
    id: "wen-hydrating-face-wash",
    name: "Hydrating Face Wash",
    category: "Face Wash",
    concern: "Dehydration & Dryness",
    price: 699,
    originalPrice: 899,
    rating: 4.7,
    reviewCount: 110,
    image: "/src/assets/images/hero_product_1781973117176.jpg",
    description: "Gentle, pH-balanced face wash that cleanses without stripping natural moisture. Suitable for all skin types.",
    potencyExplanation: "Cleanses gently while retaining skin's core hydration",
    keyBenefits: [
      "Deep Gentle Cleansing",
      "pH Balanced 5.5",
      "Soothes Dry Flaky Skin",
      "No Tight Feeling",
      "Safe for Sensitive Skin"
    ],
    idealFor: [
      "Morning face wash sessions",
      "Dehydrated skin textures",
      "Sensitive dry complexions"
    ],
    howToUse: "Lather a small amount on damp face, massage gently in circular motions for 1 minute. Rinse with lukewarm water.",
    ingredients: "Aloe Vera, Hyaluronic Acid, Glycerin, Green Tea, Chamomile Extract",
    variants: ["150ml"],
    selectedVariant: "150ml",
    isBestSeller: false,
    isNewArrival: true,
    reviewsList: []
  },
  {
    id: "wen-retinol-night-cream",
    name: "Retinol Night Cream",
    category: "Night Cream",
    concern: "Dullness & Glow",
    price: 1199,
    originalPrice: 1499,
    rating: 4.8,
    reviewCount: 142,
    image: "/src/assets/images/night_cream_1781973176798.jpg",
    description: "Advanced anti-aging night cream with retinol to reduce fine lines, wrinkles, and improve skin texture while you sleep.",
    potencyExplanation: "Speeds up skin cell renewal for a morning glow",
    keyBenefits: [
      "Reduces Fine Lines",
      "Stimulates Retinol Renewal",
      "Improves Elasticity",
      "Locks Moistures Overnight",
      "Brightens Complexion"
    ],
    idealFor: [
      "Aged skin with loss of bounce",
      "Uneven rough skin textures",
      "Premium nocturnal hydration therapy"
    ],
    howToUse: "Massage a dime-sized amount onto cleansed face and neck in upward strokes each night. Use sunscreen during daytime.",
    ingredients: "Retinol, Squalane, Peptide Complex, Shea Butter, Vitamin E, Saffron Oil",
    variants: ["50g"],
    selectedVariant: "50g",
    isBestSeller: false,
    isNewArrival: true,
    reviewsList: []
  },
  {
    id: "wen-hyaluronic-moisturizer",
    name: "Hyaluronic Acid Moisturizer",
    category: "Skin Care",
    concern: "Dehydration & Dryness",
    price: 999,
    originalPrice: 1299,
    rating: 4.7,
    reviewCount: 88,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    description: "Deep hydration moisturizer with hyaluronic acid to plump skin and lock in moisture for 24 hours.",
    potencyExplanation: "Provides 24-hour weightless hydration lock",
    keyBenefits: [
      "24-Hour Hydration Lock",
      "Plumps Fine Lines",
      "Oil-Free Lightweight Gel",
      "Strengthens Barrier",
      "Fresh Dewy Glow"
    ],
    idealFor: [
      "Flaky dehydrated patches",
      "Hot summer oil-free moisturizer needs",
      "Skin barrier support"
    ],
    howToUse: "Apply evenly across clean face and neck after serum. Pat gently for maximum absorption. Use morning and night.",
    ingredients: "Hyaluronic Acid, Ceramide NP, Aloe Vera, Vitamin B5, Cucumber Extract",
    variants: ["50ml", "100ml"],
    selectedVariant: "50ml",
    isBestSeller: false,
    isNewArrival: false,
    reviewsList: []
  },
  {
    id: "wen-nourishing-body-lotion",
    name: "Nourishing Body Lotion",
    category: "Body Care",
    concern: "Dehydration & Dryness",
    price: 799,
    originalPrice: 999,
    rating: 4.5,
    reviewCount: 64,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=600&auto=format&fit=crop",
    description: "Rich, fast-absorbing body lotion with shea butter and vitamin E to nourish and soften skin.",
    potencyExplanation: "Deeply softens and hydrates dry skin layers",
    keyBenefits: [
      "Intense Daily Nourishment",
      "Fast-Absorbing & Non-Greasy",
      "Shea Butter Richness",
      "Restores Skin Softness",
      "All-Day Fresh Fragrance"
    ],
    idealFor: [
      "Dry elbows, knees, heels",
      "Daily post-bath hydration lock",
      "Soft supple skin feel all day long"
    ],
    howToUse: "Apply liberally all over the body, ideally after showering when skin is damp. Reapply to extremely dry areas as needed.",
    ingredients: "Shea Butter, Vitamin E, Jojoba Oil, Glycerin, Almond Oil",
    variants: ["200ml", "400ml"],
    selectedVariant: "200ml",
    isBestSeller: false,
    isNewArrival: false,
    reviewsList: []
  },
  {
    id: "wen-exfoliating-body-scrub",
    name: "Exfoliating Body Scrub",
    category: "Body Care",
    concern: "Dullness & Glow",
    price: 899,
    originalPrice: 1099,
    rating: 4.8,
    reviewCount: 90,
    image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600&auto=format&fit=crop",
    description: "Natural exfoliating scrub with coffee and coconut oil to remove dead skin cells and reveal glowing skin.",
    potencyExplanation: "Polishes skin and melts away dull dead cells",
    keyBenefits: [
      "Polishes Dead Skin Cells",
      "Reduces Cellulite Appearance",
      "Intense Coconut Hydration",
      "Smooths Rough Elbows/Knees",
      "Energizing Coffee Aroma"
    ],
    idealFor: [
      "Weekly body scrub skin routines",
      "Restoring glowing even tone skin",
      "Apothecary exfoliating rituals"
    ],
    howToUse: "In the shower, massage a handful of scrub onto damp skin in circular motions, focusing on rough areas. Rinse thoroughly.",
    ingredients: "Robusta Coffee Grounds, Cold-Pressed Coconut Oil, Brown Sugar, Sea Salt, Vitamin E",
    variants: ["200g"],
    selectedVariant: "200g",
    isBestSeller: false,
    isNewArrival: false,
    reviewsList: []
  },
  {
    id: "wen-underarm-rollon",
    name: "Underarm Roll-On (Nonapeptide + AHA 6%)",
    category: "Body Care",
    concern: "Pigmentation & Dark Spots",
    price: 359,
    originalPrice: 499,
    rating: 4.6,
    reviewCount: 154,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=600&auto=format&fit=crop",
    description: "Advanced underarm treatment that reduces darkness and odor with nonapeptide and AHA.",
    potencyExplanation: "Targets hyperpigmentation & eliminates underarm odor",
    keyBenefits: [
      "Inhibits Hyperpigmentation",
      "6% AHA Exfoliation",
      "24-Hour Odor Protection",
      "Evens Skin Tone",
      "Aluminum & Parabens Free"
    ],
    idealFor: [
      "Melasma, dark patches, and underarm hyperpigmentation",
      "Daily clinical fresh odor control",
      "Soothed radiant skin complexions"
    ],
    howToUse: "Apply daily on clean, dry underarms. Let dry completely before dressing.",
    ingredients: "Nonapeptide-1, Glycolic Acid (AHA) 6%, Niacinamide, Tea Tree Oil, Witch Hazel",
    variants: ["50ml"],
    selectedVariant: "50ml",
    isBestSeller: false,
    isNewArrival: false,
    reviewsList: []
  },
  {
    id: "wen-acne-serum",
    name: "Wen Acne Control Serum",
    category: "Face Serum",
    concern: "Acne & Pore Control",
    price: 1599,
    originalPrice: 1999,
    rating: 4.8,
    reviewCount: 112,
    image: "/src/assets/images/acne_serum_bottle_1782231430003.jpg",
    description: "Specially formulated for acne-prone skin, this advanced formulation combines 2% Salicylic Acid (BHA), Tea Tree Oil, and Centella Asiatica to clear stubborn acne breakouts, control excessive sebum secretion, and shrink enlarged open pores for clean, refined skin.",
    potencyExplanation: "Shrinks open pores & clears acne outbreaks effectively",
    keyBenefits: [
      "Clears Severe Acne Breakouts",
      "Unclogs & Tightens Pores",
      "Regulates Excess Sebum",
      "Soothes Redness & Inflammation",
      "Smooths Skin Barrier Texture"
    ],
    idealFor: [
      "Acne-prone skin, blackheads, whiteheads",
      "Excessively oily t-zone complexions",
      "Daily lightweight calming routines"
    ],
    howToUse: "Apply 2-3 drops onto clean skin, concentrating on active areas. Gently pat until fully absorbed. Follow with moisturizer.",
    ingredients: "Salicylic Acid 2%, Tea Tree Oil, Niacinamide, Zinc PCA, Centella Asiatica (Cica)",
    variants: ["30ml"],
    selectedVariant: "30ml",
    isBestSeller: true,
    isNewArrival: true,
    reviewsList: []
  },
  {
    id: "wen-aging-serum",
    name: "WenAging Anti-Aging Serum",
    category: "Face Serum",
    concern: "Dullness & Glow",
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviewCount: 84,
    image: "/src/assets/images/aging_serum_bottle_1782231449357.jpg",
    description: "Our gold-standard cellular regeneration treatment. Combining pure Retinol, Multi-Peptides, and Squalane, it accelerates dermal turnover, targets deep fine lines and wrinkles, and tightens sagging contours to restore pristine youthfulness and bounce.",
    potencyExplanation: "Renews cellular skin bounce & targets deep wrinkles",
    keyBenefits: [
      "Reduces Deep Wrinkles & Lines",
      "Boosts Collagen Synthesis",
      "Restores Dermal Elasticity & Bounce",
      "Smoothens Rough Complexions",
      "Deep Luxurious Cell Renewal"
    ],
    idealFor: [
      "Skin showing premature aging signs",
      "Fine lines around eyes, forehead, mouth",
      "Anti-aging nighttime defense"
    ],
    howToUse: "Massage a small amount on clean face and neck in upward strokes each night. Begin by using 2-3 times a week, gradually increasing frequency.",
    ingredients: "Pure Retinol (0.5%), Palmitoyl Tripeptide, Squalane, Hyaluronic Acid, Coenzyme Q10",
    variants: ["30ml"],
    selectedVariant: "30ml",
    isBestSeller: true,
    isNewArrival: false,
    reviewsList: []
  },
  {
    id: "wen-glow-serum",
    name: "Wenglow Glutathione Brightening Serum",
    category: "Face Serum",
    concern: "Pigmentation & Dark Spots",
    price: 1799,
    originalPrice: 2199,
    rating: 4.9,
    reviewCount: 167,
    image: "/src/assets/images/glow_serum_bottle_1782231469928.jpg",
    description: "Achieve the ultimate glass-skin radiance. Infused with professional-strength Glutathione, Alpha Arbutin, and pure Saffron Extract, this ultra-luxurious blend targets stubborn hyperpigmentation, clears melasma spots, and triggers deep luminous whitening from within.",
    potencyExplanation: "Professional-grade brightness & dark spot removal",
    keyBenefits: [
      "Reduces Stubborn Hyperpigmentation",
      "Fades Melasma & Sun Spots",
      "Triggers Radiant Glass-Skin Glow",
      "Enriched with Kashmiri Saffron",
      "Inhibits Melanin Production"
    ],
    idealFor: [
      "Uneven skin tone, severe tanning, melasma",
      "Fading dark acne scars and blemishes",
      "Achieving bright, illuminated glass-skin"
    ],
    howToUse: "Apply 3-4 drops to a fully cleansed face. Gently massage and pat until dry. Use twice daily for maximum glass-skin results.",
    ingredients: "Glutathione, Alpha Arbutin, Saffron Extract, Niacinamide, Licorice Root Extract",
    variants: ["30ml"],
    selectedVariant: "30ml",
    isBestSeller: true,
    isNewArrival: true,
    reviewsList: []
  }
];
