"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle, HelpCircle, Sparkles } from "lucide-react";

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    comparePrice: "",
    category: "Skin Care",
    stock: "25",
    status: "Active",
    isBestSeller: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = () => {
    setFormData(prev => ({ ...prev, status: prev.status === "Active" ? "Inactive" : "Active" }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }));
  };

  const handleImageUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Please ensure Name and Price parameters are registered!");
      return;
    }
    alert("Formula Catalog entry created successfully!");
    window.location.href = "/admin/products";
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      {/* Title block */}
      <div className="flex items-center gap-3.5 pb-6 border-b border-gray-200">
        <Link
          href="/admin/products"
          className="p-2 border border-gray-200 hover:bg-gray-100 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-4.5 h-4.5 text-[#1F4D3A]" />
        </Link>
        <div>
          <h2 className="text-2xl font-playfair font-bold text-[#1F4D3A] tracking-wide uppercase">Add Formulation</h2>
          <p className="text-xs text-gray-400 font-sans font-light mt-0.5">Introduce a masterwork skin or hair prescription to your online vault.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Core specs details (70%) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-5 shadow-xs">
            {/* Title */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
                Treatment Label
              </label>
              <input 
                type="text" 
                name="name"
                placeholder="e.g. Kashmiri Saffron Hydrating Nectar"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 focus:border-[#C9A227] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A227] font-semibold"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
                Detailed Botanical Description
              </label>
              <textarea 
                rows={5}
                name="description"
                placeholder="Describe molecular weights, ancient apothecary infusion metrics or clinical trials."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 focus:border-[#C9A227] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A227] font-sans resize-none"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
                Clinical Overview
              </label>
              <textarea 
                rows={2}
                name="shortDescription"
                placeholder="e.g. Instant glow therapy leveraging 24k colloidal gold accents."
                value={formData.shortDescription}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 focus:border-[#C9A227] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A227] font-sans resize-none text-xs"
              />
            </div>

            {/* Pricing Section (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
                  Retail Cost Price (Rs.)
                </label>
                <input 
                  type="number" 
                  name="price"
                  placeholder="3500"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#C9A227] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A227] font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
                  Compare Price (Original - Strikeout Rs.)
                </label>
                <input 
                  type="number" 
                  name="comparePrice"
                  placeholder="4000"
                  value={formData.comparePrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-[#C9A227] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A227] font-sans text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Media Images upload */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4 shadow-xs">
            <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400 block text-left">
              Treatment Photography
            </label>
            
            <div className="border-2 border-dashed border-gray-200 hover:border-[#C9A227] rounded-2xl p-8 text-center transition duration-250 cursor-pointer relative group flex flex-col items-center justify-center">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUploaded}
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              />
              {imagePreview ? (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Upload Preview" 
                    className="max-h-56 mx-auto rounded-xl object-contain border border-gray-100" 
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-xs text-gray-400">Click or Drag new file to replace</p>
                </div>
              ) : (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="p-3 bg-[#F7F2EA] text-[#1F4D3A] rounded-xl group-hover:scale-105 transition duration-250">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Drag & drop your formulation graphics here</p>
                    <p className="text-[10px] text-gray-400 mt-1">Supports High Resolution PNG or JPEG up to 6MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Taxonomy / Publishing configuration card (35%) */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 shadow-xs text-left">
            <div>
              <h3 className="font-playfair text-md font-bold text-[#1F4D3A] uppercase tracking-wide">
                Publishing Specs
              </h3>
              <p className="text-[10px] text-gray-400">Set visibility and logistical details.</p>
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
                Formula Taxonomy
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3.5 py-3 border border-gray-200 focus:outline-none focus:border-[#C9A227] rounded-xl text-xs font-semibold font-sans"
              >
                <option value="Skin Care">Skin Care Essentials</option>
                <option value="Hair Care">Hair Care Essentials</option>
                <option value="Body Care">Body Care Essentials</option>
              </select>
            </div>

            {/* Stock entries */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">
                Apothecary Stocks
              </label>
              <input 
                type="number" 
                name="stock"
                placeholder="25"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 focus:border-[#C9A227] rounded-xl text-xs focus:outline-none font-bold"
                required
              />
            </div>

            {/* Toggle Status switch */}
            <div className="flex items-center justify-between py-2 border-y border-gray-100">
              <div className="text-left select-none">
                <span className="text-xs font-bold text-gray-800 block">Treat Status</span>
                <span className="text-[10px] text-gray-400">Control store visibility</span>
              </div>
              
              <button 
                type="button"
                onClick={handleToggleChange}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.status === "Active" ? "bg-emerald-600" : "bg-gray-200"
                }`}
                role="switch"
                aria-checked={formData.status === "Active"}
              >
                <span className="sr-only">Toggle formulation visibility status</span>
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formData.status === "Active" ? "translate-x-5" : "translate-x-0"
                  }`} 
                />
              </button>
            </div>

            {/* Is Best Seller checkbox alignment */}
            <div className="flex items-center gap-3 py-1">
              <input 
                type="checkbox" 
                id="isBestSeller" 
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-[#1F4D3A] focus:ring-[#C9A227] border-gray-300 rounded-md cursor-pointer"
              />
              <label htmlFor="isBestSeller" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                Best-Seller Formulation Accents
              </label>
            </div>

            {/* Publish Actions Trigger buttons */}
            <div className="space-y-3 pt-3">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#C9A227] hover:bg-[#b08b1a] text-[#1F4D3A] font-sans text-xs font-extrabold uppercase tracking-widest rounded-xl transition duration-200 shadow-md cursor-pointer flex items-center justify-center gap-2 hover:scale-101"
              >
                <CheckCircle className="w-4 h-4 text-[#1F4D3A]" />
                <span>Publish Formulation</span>
              </button>
              
              <Link
                href="/admin/products"
                className="w-full py-3 border border-gray-250 hover:bg-gray-50 text-gray-400 hover:text-black font-sans text-[10px] uppercase tracking-widest font-bold rounded-xl transition cursor-pointer block text-center"
              >
                Discard Draft
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
