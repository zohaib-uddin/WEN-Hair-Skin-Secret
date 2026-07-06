"use client";

import React, { useState } from "react";
import { FolderTree, Plus, Edit, Trash, X, Upload, HelpCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  description: string;
  image: string;
}

const mockCategories: Category[] = [
  { id: "1", name: "Skin Care Essentials", slug: "skin-care", productCount: 16, description: "Hydrating, restorative facial elixirs, active botanical serums, and organic scrubs designed for Pakistani weather.", image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=200" },
  { id: "2", name: "Hair Care Essentials", slug: "hair-care", productCount: 12, description: "Nutritive black seed elixirs, sulfate-free shampoos, and keratin damage controllers.", image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=200" },
  { id: "3", name: "Body Care Essentials", slug: "body-care", productCount: 8, description: "Sandalwood, charcoal, and lavender-infused deep exfoliating body polishers.", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=200" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: ""
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you wish to delete this category from the taxonomy system? (Associated products might lose category indices)")) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "name") {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }
      return updated;
    });
  };

  const handleImageUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const nextId = String(categories.length + 1);
    const newCat: Category = {
      id: nextId,
      name: formData.name,
      slug: formData.slug,
      productCount: 0,
      description: formData.description,
      image: formData.image || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=200"
    };

    setCategories(prev => [...prev, newCat]);
    setModalOpen(false);
    setFormData({ name: "", slug: "", description: "", image: "" });
    setImagePreview(null);
  };

  return (
    <div className="space-y-8 pb-12 text-left">
      {/* Title display */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-[#1F4D3A] tracking-wide uppercase">Category Taxonomy</h2>
          <p className="text-xs text-gray-400 font-sans font-light mt-0.5">Control product structures and navigation category links.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#1F4D3A] hover:bg-[#153427] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C9A227]" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Grid Layout of Category list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300"
          >
            <div className="relative h-44 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
              <img 
                src={cat.image} 
                alt={cat.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-104 transition duration-300"
              />
              <div className="absolute top-3 right-3 bg-[#1F4D3A] text-white text-[10px] font-bold font-sans uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                {cat.productCount} Formulations
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-1.5">
                <h3 className="font-playfair text-lg font-bold text-[#1F4D3A] tracking-wide">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-[#C9A227] font-mono tracking-wider font-semibold uppercase">
                  Slug: /{cat.slug}
                </p>
                <p className="text-xs text-gray-500 font-sans leading-relaxed tracking-wide font-light line-clamp-3 pt-1">
                  {cat.description}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-50">
                <button
                  onClick={() => alert("Edit parameters details overlay can be triggered here...")}
                  className="p-2 border border-gray-200 hover:border-[#1F4D3A] text-gray-400 hover:text-[#1F4D3A] rounded-xl transition cursor-pointer text-xs flex items-center gap-1 font-medium"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 border border-rose-100 hover:bg-rose-50 text-rose-455 hover:text-rose-650 rounded-xl transition cursor-pointer text-xs flex items-center gap-1 font-medium"
                >
                  <Trash className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal Dialog overlay */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-100 shadow-2xl p-6 md:p-8 relative">
            {/* Close */}
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute right-6 top-6 p-1.5 bg-gray-55 hover:bg-gray-150 text-gray-400 hover:text-gray-650 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSaveCategory} className="space-y-6 text-left">
              <div>
                <span className="text-[10px] font-bold font-mono text-[#C9A227] uppercase tracking-widest">Taxonomy Hub</span>
                <h3 className="font-playfair text-xl font-bold text-[#1F4D3A] tracking-wide uppercase">Add Category</h3>
              </div>

              <div className="space-y-4">
                {/* Category Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">Category Title</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="e.g. Cleansing Wash Accents"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-[#C9A227] rounded-xl text-sm focus:outline-none"
                    required
                  />
                </div>

                {/* Slug display */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">Permis Link (Slug)</label>
                  <input 
                    type="text" 
                    name="slug"
                    value={formData.slug}
                    disabled
                    className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-gray-400 rounded-xl text-sm outline-none"
                  />
                </div>

                {/* Category Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">Description</label>
                  <textarea 
                    rows={3}
                    name="description"
                    placeholder="Summarize the botanical nature of treatments in this category..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-[#C9A227] rounded-xl text-xs focus:outline-none resize-none font-sans"
                  />
                </div>

                {/* Cover block upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans font-bold uppercase tracking-wider text-gray-400">Category Thumbnail</label>
                  <div className="border-2 border-dashed border-gray-200 hover:border-[#C9A227] rounded-xl p-6 text-center transition cursor-pointer relative flex flex-col items-center justify-center">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUploaded}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Upload Preview" 
                        className="h-28 object-cover rounded-lg border border-gray-100" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="space-y-2 flex flex-col items-center">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] text-gray-400">Upload category graphics</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit triggers */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-3.5 border border-gray-200 hover:bg-gray-55 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black rounded-xl transition cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-5 py-3.5 bg-[#1F4D3A] hover:bg-[#153427] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition cursor-pointer shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
