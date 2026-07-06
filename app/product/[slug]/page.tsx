import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { PRODUCTS } from "../../../src/lib/constants";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Dynamic SEO Metadata Generator for Next.js SEO optimization
export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const product = PRODUCTS.find((p) => p.id === slug || p.id.toLowerCase() === slug.toLowerCase());

  if (!product) {
    return {
      title: "Product Not Found | WEN Secrets",
      description: "Selected luxury formulation catalog record is not found.",
    };
  }

  return {
    title: `${product.name} | WEN Hair & Skin Secret`,
    description: `${product.description.slice(0, 155)}... Engineered meticulously for Pakistan climate indexes.`,
    keywords: [product.name, product.category, "Kashmiri beauty secret", "pH 5.5 organic scalp", "Pakistani luxury skincare", "WEN cosmetics"],
    openGraph: {
      title: `${product.name} | WEN Hair & Skin Secret`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
      type: "article",
    },
  };
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const slug = params.slug;
  const product = PRODUCTS.find((p) => p.id === slug || p.id.toLowerCase() === slug.toLowerCase());

  if (!product) {
    notFound();
  }

  // Structured Data (JSON-LD) for rich search snippet compatibility
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "WEN Secrets"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://wen.com.pk/product/${product.id}`,
      "priceCurrency": "PKR",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "WEN Secrets"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 128,
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <main className="w-full flex-1 min-h-screen bg-white">
      {/* Dynamic structured content injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient product={product} />
    </main>
  );
}
