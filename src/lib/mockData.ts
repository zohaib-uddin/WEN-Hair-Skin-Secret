import { Product } from "../types";

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockAlerts: number;
}

export interface AdminOrder {
  orderId: string;
  fullName: string;
  email: string;
  phone: string;
  shippingName?: string;
  shippingPhone?: string;
  confirmationEmail?: string;
  confirmationPhone?: string;
  address: string;
  city?: string;
  postalCode?: string;
  specialInstructions?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  couponCode?: string;
  discountPercentage?: number;
  discount_amount?: number;
  items: Array<{
    name: string;
    quantity: number;
    variant: string;
    price: number;
    image?: string;
    category?: string;
    concern?: string;
  }>;
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | string;
  date: string;
  estimatedDelivery: string;
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export const adminStatsMockToUse: AdminStats = {
  totalRevenue: 1250000,
  totalOrders: 450,
  totalCustomers: 120,
  lowStockAlerts: 3
};

export const adminOrdersMockToUse: AdminOrder[] = [
  {
    orderId: "WEN-958432",
    fullName: "Sarah Ahmed Malik",
    email: "sarah.malik@outlook.com",
    phone: "03008432120",
    address: "House 24, Block J, DHA Phase 6, Lahore",
    items: [
      {
        name: "Saffron Infused Ayurvedic Hair Growth Oil",
        quantity: 1,
        variant: "200ml",
        price: 4200
      },
      {
        name: "Botanical Repair Sulfate-Free Shampoo",
        quantity: 1,
        variant: "250ml",
        price: 2200
      }
    ],
    totalPrice: 6400,
    status: "Delivered",
    date: "June 14, 2026",
    estimatedDelivery: "June 17, 2026"
  },
  {
    orderId: "WEN-482390",
    fullName: "Fatima Bilal",
    email: "fatima.b89@gmail.com",
    phone: "03214589921",
    address: "Apartment 4B, Creek Vista, Phase 8 DHA, Karachi",
    items: [
      {
        name: "Saffron Glow Night Repair Cream",
        quantity: 1,
        variant: "50g",
        price: 3900
      }
    ],
    totalPrice: 3900,
    status: "Shipped",
    date: "June 18, 2026",
    estimatedDelivery: "June 21, 2026"
  },
  {
    orderId: "WEN-739210",
    fullName: "Zainab Shah",
    email: "zainab.shah@gmail.com",
    phone: "03335210984",
    address: "House 182-A, Sector F-7/2, Islamabad",
    items: [
      {
        name: "Niacinamide 10% + Zinc Golden Face Serum",
        quantity: 1,
        variant: "30ml",
        price: 2400
      },
      {
        name: "Salicylic Acid Cleansing Clear Face Wash",
        quantity: 1,
        variant: "150ml",
        price: 1850
      }
    ],
    totalPrice: 4250,
    status: "Processing",
    date: "June 19, 2026",
    estimatedDelivery: "June 22, 2026"
  },
  {
    orderId: "WEN-381023",
    fullName: "Bilal Ghazi",
    email: "bilal_ghazi7@yahoo.com",
    phone: "03126781299",
    address: "House 10, Canal View, Gujranwala",
    items: [
      {
        name: "Saffron Infused Ayurvedic Hair Growth Oil",
        quantity: 2,
        variant: "100ml",
        price: 3450
      }
    ],
    totalPrice: 6900,
    status: "Pending",
    date: "June 20, 2026",
    estimatedDelivery: "June 24, 2026"
  },
  {
    orderId: "WEN-109312",
    fullName: "Amna Yousuf",
    email: "amna.y@skincare.pk",
    phone: "03450123456",
    address: "Street 5, Saddar, Peshawar",
    items: [
      {
        name: "Pure Bulagrian Rose Water Hydration Mist",
        quantity: 1,
        variant: "100ml",
        price: 1550
      }
    ],
    totalPrice: 1550,
    status: "Cancelled",
    date: "June 10, 2026",
    estimatedDelivery: "June 13, 2026"
  }
];

export const adminProductsMockToUse: Product[] = [
  {
    id: "wen-hair-saffron-oil",
    name: "Saffron Infused Ayurvedic Hair Growth Oil",
    category: "Hair Oil",
    concern: "Hair Thinning & Fall",
    price: 3450,
    originalPrice: 4200,
    rating: 4.9,
    reviewCount: 148,
    image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600&auto=format&fit=crop",
    description: "Our signature blend powered by pure Kashmiri saffron threads and certified organic oils.",
    variants: ["100ml", "200ml"],
    selectedVariant: "100ml",
    isBestSeller: true,
    isNewArrival: false,
    keyBenefits: ["Stops hair thinning", "Nourish the scalp dynamically"],
    potencyExplanation: "Activates 83% more inactive bulb follicles.",
    idealFor: ["Thinning hair", "Chemically damaged hair"],
    howToUse: "Apply overnight.",
    ingredients: "Kashmiri Saffron, Argan oil, Bringhraj.",
    reviewsList: []
  },
  {
    id: "wen-skin-face-serum",
    name: "Niacinamide 10% + Zinc Golden Face Serum",
    category: "Face Serum",
    concern: "Acne & Pore Control",
    price: 2400,
    originalPrice: 2850,
    rating: 4.8,
    reviewCount: 96,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop",
    description: "An ultra-refined gold-tinted serum containing highly purified 10% Niacinamide (Vitamin B3) and 1% Zinc PCA.",
    variants: ["30ml", "50ml"],
    selectedVariant: "30ml",
    isBestSeller: true,
    isNewArrival: false,
    keyBenefits: ["Visibly shrinks open pores", "Controls day long shine"],
    potencyExplanation: "Provides cellular regulation.",
    idealFor: ["Oily and combination skin"],
    howToUse: "Massage 2-3 drops.",
    ingredients: "Niacinamide, Zinc PCA, Hyaluronic Acid.",
    reviewsList: []
  },
  {
    id: "wen-skin-night-cream",
    name: "Saffron Glow Night Repair Cream",
    category: "Night Cream",
    concern: "Dullness & Glow",
    price: 3900,
    originalPrice: 4500,
    rating: 4.9,
    reviewCount: 204,
    image: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=600&auto=format&fit=crop",
    description: "An incredibly decadent overnight recovery treatment infused with Kashmiri Saffron essence, Retinol, and Squalane.",
    variants: ["50g"],
    selectedVariant: "50g",
    isBestSeller: true,
    isNewArrival: false,
    keyBenefits: ["Overnight cell trigger", "Locks massive moisture"],
    potencyExplanation: "Retinol speeds cell turnover by 57%.",
    idealFor: ["Dull, fatigued skin"],
    howToUse: "Apply pea-sized amount.",
    ingredients: "Saffron, Squalane, Retinol.",
    reviewsList: []
  },
  {
    id: "wen-hair-shampoo",
    name: "Botanical Repair Sulfate-Free Shampoo",
    category: "Shampoo",
    concern: "Hair Thinning & Fall",
    price: 2200,
    originalPrice: 2600,
    rating: 4.7,
    reviewCount: 81,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop",
    description: "A gentle, luxurious sulfate-free clarifying cleanser infused with Hydrolyzed Soya Keratin.",
    variants: ["250ml", "500ml"],
    selectedVariant: "250ml",
    isBestSeller: false,
    isNewArrival: true,
    keyBenefits: ["Doesn't strip natural sebum", "Fills shaft imperfections"],
    potencyExplanation: "Co-formulated with mild coconut-derived surfactants.",
    idealFor: ["Damaged hair", "Dry scaling scalp"],
    howToUse: "Lather onto wet palms.",
    ingredients: "Aloe Vera Hydrosol, Soy Protein, Eucalyptus oil.",
    reviewsList: []
  },
  {
    id: "wen-skin-face-wash",
    name: "Salicylic Acid Cleansing Clear Face Wash",
    category: "Face Wash",
    concern: "Acne & Pore Control",
    price: 1850,
    originalPrice: 2200,
    rating: 4.8,
    reviewCount: 114,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    description: "Featuring a therapeutic dose of 2% Salicylic Acid BHA coupled with Centella and Green Tea.",
    variants: ["150ml"],
    selectedVariant: "150ml",
    isBestSeller: false,
    isNewArrival: true,
    keyBenefits: ["Eradicates blackheads", "Prevents active cysts"],
    potencyExplanation: "BHA dissolves sub-surface grease bonds.",
    idealFor: ["Oily, acne-congested skin"],
    howToUse: "Massage on damp skin for 1 minute.",
    ingredients: "Salicylic Acid, Gotu Kola, Green Tea.",
    reviewsList: []
  }
];

export const adminMessagesMockToUse: AdminMessage[] = [
  {
    id: "msg-1",
    name: "Komal Naeem",
    email: "komal.n@gmail.com",
    phone: "03221234567",
    subject: "Product Query",
    message: "Asalam-o-Alaikum, I have extremely frizzy hair and live in Karachi where the humidity is very high. Will the Saffron Hair Oil feel too heavy for regular day wear? Please advise.",
    date: "June 19, 2026, 3:15 PM",
    isRead: false
  },
  {
    id: "msg-2",
    name: "Hamza Sheikh",
    email: "sheikh.hamza@outlook.com",
    phone: "03004567890",
    subject: "Order Issue",
    message: "Hi, I ordered the Hair Growth Kit three days ago to Faisalabad. The status is showing processing but I have not received any tracking ID yet. Please check.",
    date: "June 20, 2026, 11:20 AM",
    isRead: false
  },
  {
    id: "msg-3",
    name: "Sidra Batool",
    email: "sidra.batool@gmail.com",
    phone: "03459876543",
    subject: "Refund Support",
    message: "I ordered the Salicylic Acid Cleanser but my skin is very dry so I incurred minor flaking. Would like to switch to Saffron face serum or claim refund as per your 7-day guarantee.",
    date: "June 18, 2026, 4:40 PM",
    isRead: true
  }
];
