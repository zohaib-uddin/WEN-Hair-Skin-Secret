import { MetadataRoute } from "next";
import { getSupabaseAdminClient } from "../src/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://wen.com.pk"; // Base production URL

  // Declarative static mappings
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  try {
    const supabase = getSupabaseAdminClient();

    // 1. Fetch active products to dynamic paths
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true);

    const productUrls = (products || []).map((prod) => ({
      url: `${baseUrl}/product/${prod.slug}`,
      lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
      changeFrequency: "weekly" as "weekly",
      priority: 0.8,
    }));

    // 2. Fetch categories to dynamic paths
    const { data: categories } = await supabase
      .from("categories")
      .select("slug");

    const categoryUrls = (categories || []).map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as "weekly",
      priority: 0.6,
    }));

    return [...staticPages, ...productUrls, ...categoryUrls];
  } catch (error) {
    console.error("[Sitemap Generation Service Error]:", error);
    return staticPages;
  }
}
