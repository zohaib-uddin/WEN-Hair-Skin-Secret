import { Product } from "../types";
import { PRODUCTS as REAL_PRODUCTS } from "./data/products";

// Pre-generated High-Quality AI images
export const IMAGES = {
  heroProduct: "/src/assets/images/hero_product_1781973117176.jpg",
  faceSerum: "/src/assets/images/face_serum_1781973137398.jpg",
  hairOil: "/src/assets/images/hair_growth_oil_1781973152470.jpg",
  nightCream: "/src/assets/images/night_cream_1781973176798.jpg",
  shampoo: "/src/assets/images/shampoo_bottle_1781973196785.jpg",
};

export const PRODUCTS: Product[] = REAL_PRODUCTS;

export const CONCERNS = [
  "Acne & Pore Control",
  "Hair Thinning & Fall",
  "Pigmentation & Dark Spots",
  "Dullness & Glow",
  "Dehydration & Dryness"
];

export const CATEGORIES = [
  "Hair Oil",
  "Shampoo",
  "Conditioner",
  "Face Serum",
  "Face Wash",
  "Night Cream",
  "Hair Care",
  "Skin Care",
  "Body Care"
];
