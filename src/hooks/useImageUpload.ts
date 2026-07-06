import { useState } from "react";
import { UploadResponse } from "../types/upload";

export interface UploadedImageInfo {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImageInfo[]>([]);

  /**
   * Uploads an array of Files to the server endpoint.
   * 
   * @param files - Array of image files selected from user inputs
   * @returns Array of uploaded image results with URLs and public IDs
   */
  const uploadImages = async (files: File[]): Promise<UploadedImageInfo[]> => {
    if (files.length === 0) {
      return [];
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status code ${response.status}`);
      }

      const data: UploadResponse = await response.json();
      
      if (!data.success || !data.images) {
        throw new Error(data.error || "Failed to parse upload server responses");
      }

      setUploadedImages((prev) => [...prev, ...data.images]);
      return data.images;
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred during image uploading";
      setError(msg);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Removes uploaded images by their public_id.
   * 
   * @param publicIds - Array of public IDs to destroy in Cloudinary
   */
  const deleteImages = async (publicIds: string[]): Promise<Record<string, string>> => {
    if (publicIds.length === 0) {
      return {};
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/upload/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicIds }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Teardown request failed with status code ${response.status}`);
      }

      const data = await response.json();
      
      // Update local state by removing deleted elements
      setUploadedImages((prev) => prev.filter((img) => !publicIds.includes(img.public_id)));
      
      return data.results || {};
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred during asset removal";
      setError(msg);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const clearUploadedImages = () => {
    setUploadedImages([]);
    setError(null);
  };

  return {
    uploadImages,
    deleteImages,
    clearUploadedImages,
    isUploading,
    error,
    uploadedImages,
  };
}
