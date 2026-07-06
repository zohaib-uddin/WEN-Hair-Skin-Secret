import { z } from "zod";

// --- CATEGORY ---
export const CategoryInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-_]+$/, "Slug must be URL-safe (lowercase, numbers, - or _)"),
  description: z.string().nullable().optional(),
  image_url: z.string().url("Invalid image URL").nullable().or(z.string().length(0)).optional(),
  display_order: z.number().int().optional().default(0),
});

export const CategoryUpdateSchema = CategoryInputSchema.partial();

// --- PRODUCT ---
export const ProductInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-_]+$/, "Slug must be URL-safe (lowercase, numbers, - or _)"),
  description: z.string().nullable().optional(),
  short_description: z.string().nullable().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  compare_price: z.number().min(0).nullable().optional(),
  category_id: z.string().uuid("Invalid category ID format").nullable().optional(),
  images: z.array(z.string().url("Invalid image URL in array")).default([]),
  stock_quantity: z.number().int().min(0, "Stock quantity must be non-negative").default(0),
  is_bestseller: z.boolean().optional().default(false),
  is_featured: z.boolean().optional().default(false),
  ingredients: z.array(z.string()).default([]),
  how_to_use: z.string().nullable().optional(),
  benefits: z.array(z.string()).default([]),
  is_active: z.boolean().optional().default(true),
});

export const ProductUpdateSchema = ProductInputSchema.partial();

// --- CART ITEM ---
export const CartItemAddSchema = z.object({
  product_id: z.string().uuid("Invalid product ID format"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const CartItemUpdateSchema = z.object({
  product_id: z.string().uuid("Invalid product ID format"),
  quantity: z.number().int().nonnegative("Quantity must be non-negative"),
});

// --- ORDER ---
export const OrderPlaceSchema = z.object({
  shipping_address: z.string().min(5, "Shipping address must be at least 5 characters long"),
  city: z.string().min(1, "City is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  notes: z.string().nullable().optional(),
});
