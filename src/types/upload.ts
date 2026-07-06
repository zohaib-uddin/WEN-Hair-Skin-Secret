export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  [key: string]: any;
}

export interface UploadResponse {
  success: boolean;
  images: Array<{
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
  }>;
  error?: string;
}

export interface DeleteRequest {
  publicIds: string[];
}

export interface DeleteResponse {
  results: Record<string, "ok" | "not_found" | "failed" | string>;
}
