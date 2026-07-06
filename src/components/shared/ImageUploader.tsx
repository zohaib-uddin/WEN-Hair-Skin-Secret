import React, { useState, useRef } from "react";
import { UploadCloud, Image, Trash2, CheckCircle2 } from "lucide-react";

interface ImageUploaderProps {
  onImageSelected: (base64OrUrl: string) => void;
  defaultImage?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  defaultImage = "",
  className = "",
}) => {
  const [preview, setPreview] = useState<string>(defaultImage);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;

    // Check if image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG/JPG).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onImageSelected(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview("");
    onImageSelected("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <span className="block text-xs font-bold uppercase tracking-wider text-[#1F4D3A] mb-2 font-sans">
        Formulation Visual Media (Image)
      </span>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`w-full min-h-[220px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer select-none relative overflow-hidden group ${
          preview
            ? "border-[#C9A227] bg-[#f5f5f5]/20"
            : "border-[#E8E1D3] hover:border-[#C9A227] bg-white"
        } ${dragActive ? "border-[#C9A227] bg-[#1F4D3A]/5 scale-[0.99]" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {preview ? (
          <div className="absolute inset-0 w-full h-full group">
            <img
              src={preview}
              alt="Media Formulation Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Hover overlay controls */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
              <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 bg-[#1F4D3A]/90 px-4.5 py-2.5 rounded-full border border-[#C9A227]/30 shadow-md">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#C9A227]" /> Media
                Loaded
              </span>
              <button
                type="button"
                onClick={clearImage}
                className="px-4.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 transition-colors absolute bottom-6 hover:scale-105"
              >
                <Trash2 className="w-4 h-4" /> Remove Media
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 max-w-sm pointer-events-none">
            <div className="p-4 bg-[#C9A227]/5 border border-[#C9A227]/10 text-[#C9A227] rounded-full group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-8 h-8 stroke-[1.2]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1F4D3A] uppercase tracking-wider">
                Drag &amp; Drop or{" "}
                <span className="text-[#C9A227] underline">
                  Browse formulations
                </span>
              </p>
              <p className="text-[10px] text-[#757575] font-light mt-1">
                Supports High-resolution JPG or PNG formats up to 5MB.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
