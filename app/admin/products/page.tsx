"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash, ArrowUpDown, Sparkles } from "lucide-react";
import DataTable from "../../../components/admin/DataTable";

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: "Active" | "Inactive";
}

const mockProducts: ProductRow[] = [
  { id: "1", name: "Saffron Youth Revive Serum", sku: "WEN-SAF-01", category: "Skin Care", price: 3499, stock: 45, image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=120", status: "Active" },
  { id: "2", name: "Onion & Blackseed Hair Elixir", sku: "WEN-ONB-02", category: "Hair Care", price: 2199, stock: 3, image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=120", status: "Active" },
  { id: "3", name: "Pure Sandalwood Night Butter", sku: "WEN-SAN-03", category: "Skin Care", price: 4200, stock: 0, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=120", status: "Inactive" },
  { id: "4", name: "Argan Oil Intense Infusion Conditioner", sku: "WEN-ARG-04", category: "Hair Care", price: 1850, stock: 24, image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=120", status: "Active" },
  { id: "5", name: "Charcoal Deep Extract Clarifying Scrub", sku: "WEN-CHA-05", category: "Body Care", price: 1599, stock: 18, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=120", status: "Active" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  // Filter & Sort Logic
  const handleToggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === "Active" ? "Inactive" : "Active" };
      }
      return p;
    }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this secret formulation from the database?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === "In Stock") matchesStock = p.stock > 10;
    else if (stockFilter === "Low Stock") matchesStock = p.stock > 0 && p.stock <= 10;
    else if (stockFilter === "Out of Stock") matchesStock = p.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <span className="font-semibold text-rose-600">Out of Stock</span>;
    }
    if (stock <= 5) {
      return <span className="font-semibold text-amber-600">Low Stock ({stock})</span>;
    }
    return <span className="font-semibold text-emerald-600">In Stock ({stock})</span>;
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      {/* Title + Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-[#1F4D3A] tracking-wide uppercase">Formula Catalog</h2>
          <p className="text-xs text-gray-400 font-sans font-light mt-0.5">Edit, track, or record new luxury hair or skin treatments.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#1F4D3A] hover:bg-[#153427] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer inline-block text-center"
        >
          <Plus className="w-4 h-4 text-[#C9A227]" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Toolbar filters bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col lg:flex-row items-center gap-4 justify-between shadow-xs">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by formulation name, SKU, keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#C9A227] font-sans"
          />
        </div>

        {/* Dropdowns filters */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto text-xs font-sans">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-gray-200 focus:outline-none focus:border-[#C9A227] px-3.5 py-3 rounded-xl font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Skin Care">Skin Care</option>
            <option value="Hair Care">Hair Care</option>
            <option value="Body Care">Body Care</option>
          </select>

          <select 
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="bg-white border border-gray-200 focus:outline-none focus:border-[#C9A227] px-3.5 py-3 rounded-xl font-medium"
          >
            <option value="All">All Stock Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border border-gray-200 focus:outline-none focus:border-[#C9A227] px-3.5 py-3 rounded-xl font-medium"
          >
            <option value="Newest">Sort by: Newest</option>
            <option value="PriceLow">Price: Low to High</option>
            <option value="PriceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product list table */}
      <DataTable<ProductRow>
        data={filteredProducts}
        keyExtractor={(p) => p.id}
        emptyStateMessage="No secret formulas match your search metrics."
        columns={[
          {
            header: "Product Detail",
            renderCell: (p) => (
              <div className="flex items-center gap-3.5">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 object-cover rounded-lg border border-gray-150 shadow-sm flex-shrink-0"
                />
                <div className="truncate max-w-[200px] leading-tight text-left">
                  <span className="font-semibold text-gray-800 text-xs block truncate">{p.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono tracking-wider">{p.sku}</span>
                </div>
              </div>
            )
          },
          {
            header: "Category",
            renderCell: (p) => (
              <span className="bg-[#F7F2EA] text-[#1F4D3A] text-[10px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-full border border-gray-100">
                {p.category}
              </span>
            )
          },
          {
            header: "Retail Price",
            renderCell: (p) => (
              <span className="font-bold text-gray-900">
                Rs. {p.price.toLocaleString()}
              </span>
            )
          },
          {
            header: "Stock Status",
            renderCell: (p) => getStockBadge(p.stock)
          },
          {
            header: "Status",
            renderCell: (p) => (
              <button 
                onClick={() => handleToggleStatus(p.id)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  p.status === "Active" ? "bg-emerald-600" : "bg-gray-200"
                }`}
                role="switch"
                aria-checked={p.status === "Active"}
              >
                <span className="sr-only">Toggle product visibility status</span>
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    p.status === "Active" ? "translate-x-5" : "translate-x-0"
                  }`} 
                />
              </button>
            )
          },
          {
            header: "Manage",
            renderCell: (p) => (
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="p-2 border border-gray-200 hover:border-[#1F4D3A] text-gray-400 hover:text-[#1F4D3A] rounded-xl transition cursor-pointer"
                  aria-label="Edit formulation details"
                >
                  <Edit className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 border border-rose-100 hover:bg-rose-50 text-rose-400 hover:text-rose-600 rounded-xl transition cursor-pointer"
                  aria-label="Delete formulation from system"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          }
        ]}
      />

      {/* Pagination component representation */}
      <div className="flex items-center justify-between text-xs pt-4 border-t border-gray-150 flex-shrink-0 font-sans">
        <span className="text-gray-400">Showing 1 to {filteredProducts.length} of {filteredProducts.length} treatments</span>
        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-black cursor-pointer transition">
            Previous
          </button>
          <button className="px-3 py-2 bg-[#1F4D3A] text-white rounded-lg font-bold cursor-pointer transition">
            1
          </button>
          <button className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-black cursor-pointer transition">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
