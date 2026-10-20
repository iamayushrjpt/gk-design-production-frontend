// Central API client. All data fetching (public and admin) should go through
// here rather than calling fetch() directly in components, so auth headers,
// error envelopes, and the base URL only need to change in one place.

import type { Product, Category } from "./data";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

// If no backend URL is configured, admin pages fall back to their local mock
// state (Phase 2-4 behavior) instead of hitting a real API. This lets the
// frontend demo standalone before Phase 5's backend is deployed.
export const USE_LIVE_API = Boolean(API_BASE_URL);

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
};

type PagedData<T> = {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
};

export class ApiError extends Error {
  status: number;
  errors: string[];
  constructor(message: string, status: number, errors: string[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

const TOKEN_KEY = "gk_admin_token";

function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body: ApiEnvelope<T> = await response.json().catch(() => ({
    success: false,
    message: "Server returned an invalid response.",
    data: null as T,
  }));

  if (!response.ok || !body.success) {
    throw new ApiError(body.message ?? "Request failed.", response.status, body.errors ?? []);
  }

  return body.data;
}

/**
 * Like `request`, but for multipart/form-data (file uploads). Deliberately
 * does NOT set Content-Type — the browser needs to set it itself, including
 * the multipart boundary string, which fetch can't do if we set it manually.
 */
async function requestMultipart<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const body: ApiEnvelope<T> = await response.json().catch(() => ({
    success: false,
    message: "Server returned an invalid response.",
    data: null as T,
  }));

  if (!response.ok || !body.success) {
    throw new ApiError(body.message ?? "Upload failed.", response.status, body.errors ?? []);
  }

  return body.data;
}

function toQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
  ).toString();
  return query ? `?${query}` : "";
}

export type HomepageSection = {
  id: string;
  type: string;
  label: string;
  isEnabled: boolean;
  order: number;
  content?: Record<string, string>;
};

export type MediaAsset = {
  id: string;
  url: string;
  filename: string;
  folder: string;
  createdAt: string;
  objectKey?: string;
};

export type WhatsAppInquiry = {
  id: string;
  productName: string;
  sku: string;
  variant: string;
  price: number;
  createdAt: string;
};

export type SiteSettings = {
  businessName: string;
  whatsappNumber: string;
  email: string;
  address: string;
  businessHours: string;
  socials?: Record<string, string>;
};

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; email: string; name: string; role: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
  },

  products: {
    list: (params: Record<string, string | number | boolean | undefined> = {}) =>
      request<PagedData<Product>>(`/api/products${toQueryString(params)}`),
    getBySlug: (slug: string) => request<Product>(`/api/products/${slug}`),
  },

  categories: {
    list: () => request<Category[]>("/api/categories"),
    getBySlug: (slug: string) => request<Category>(`/api/categories/${slug}`),
  },

  services: {
    list: () => request<import("./data").ServiceOffering[]>("/api/services"),
  },

  homepageSections: {
    list: () => request<HomepageSection[]>("/api/homepage-sections"),
  },

  inquiries: {
    create: (payload: Record<string, unknown>) =>
      request<WhatsAppInquiry>("/api/inquiries", { method: "POST", body: JSON.stringify(payload) }),
  },

  settings: {
    get: () => request<SiteSettings>("/api/settings"),
  },

  admin: {
    products: {
      list: (params: Record<string, string | number | undefined> = {}) =>
        request<PagedData<Product & { status: string }>>(`/api/admin/products${toQueryString(params)}`),
      getBySlug: (slug: string) => request<Product & { status: string }>(`/api/admin/products/${slug}`),
      create: (payload: Partial<Product>) =>
        request<Product>("/api/admin/products", { method: "POST", body: JSON.stringify(payload) }),
      update: (slug: string, payload: Partial<Product>) =>
        request<Product>(`/api/admin/products/${slug}`, { method: "PUT", body: JSON.stringify(payload) }),
      updateStatus: (slug: string, status: string) =>
        request<Product>(`/api/admin/products/${slug}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }),
      duplicate: (slug: string) =>
        request<Product>(`/api/admin/products/${slug}/duplicate`, { method: "POST" }),
      remove: (slug: string) => request<void>(`/api/admin/products/${slug}`, { method: "DELETE" }),
      restore: (slug: string) => request<Product>(`/api/admin/products/${slug}/restore`, { method: "POST" }),
    },

    categories: {
      list: () => request<Category[]>("/api/admin/categories"),
      create: (payload: Partial<Category> & { isHidden?: boolean; order?: number }) =>
        request<Category>("/api/admin/categories", { method: "POST", body: JSON.stringify(payload) }),
      update: (slug: string, payload: Partial<Category> & { isHidden?: boolean; order?: number }) =>
        request<Category>(`/api/admin/categories/${slug}`, { method: "PUT", body: JSON.stringify(payload) }),
      remove: (slug: string) => request<void>(`/api/admin/categories/${slug}`, { method: "DELETE" }),
    },

    homepageSections: {
      list: () => request<HomepageSection[]>("/api/admin/homepage-sections"),
      toggle: (id: string, isEnabled: boolean) =>
        request<HomepageSection>(`/api/admin/homepage-sections/${id}/toggle`, {
          method: "PATCH",
          body: JSON.stringify({ isEnabled }),
        }),
      reorder: (id: string, order: number) =>
        request<HomepageSection>(`/api/admin/homepage-sections/${id}/order`, {
          method: "PATCH",
          body: JSON.stringify({ order }),
        }),
      updateContent: (id: string, content: Record<string, string>) =>
        request<HomepageSection>(`/api/admin/homepage-sections/${id}/content`, {
          method: "PUT",
          body: JSON.stringify(content),
        }),
    },

    media: {
      list: (query?: string) => request<PagedData<MediaAsset>>(`/api/admin/media${toQueryString({ query })}`),
      create: (payload: Partial<MediaAsset>) =>
        request<MediaAsset>("/api/admin/media", { method: "POST", body: JSON.stringify(payload) }),
      // The backend's save-metadata endpoint upserts on `id`, so update reuses `create`.
      update: (payload: MediaAsset) =>
        request<MediaAsset>("/api/admin/media", { method: "POST", body: JSON.stringify(payload) }),
      // Real file upload — streams to the backend, which forwards to Cloudflare R2 and returns the stored asset.
      upload: (file: File, folder: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        return requestMultipart<MediaAsset>("/api/admin/media/upload", formData);
      },
      remove: (id: string) => request<void>(`/api/admin/media/${id}`, { method: "DELETE" }),
    },

    inquiries: {
      list: (params: { page?: number; size?: number } = {}) =>
        request<PagedData<WhatsAppInquiry>>(`/api/admin/inquiries${toQueryString(params)}`),
    },

    settings: {
      get: () => request<SiteSettings>("/api/settings"),
      update: (payload: SiteSettings) =>
        request<SiteSettings>("/api/admin/settings", { method: "PUT", body: JSON.stringify(payload) }),
    },
  },
};
