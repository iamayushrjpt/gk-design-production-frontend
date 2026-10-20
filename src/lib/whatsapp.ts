// Central WhatsApp inquiry builder. Every "Book on WhatsApp" CTA on the site
// calls this so the message format stays consistent, and so the business
// number is read from the live Settings (src/lib/siteSettings.ts) — edit it
// once in the admin panel and every link across the site updates, instead of
// being hardcoded in a dozen components.

import { getSiteSettings } from "./siteSettings";

export type WhatsAppInquiry = {
  productName: string;
  sku: string;
  price: number;
  material?: string;
  size?: string;
  variant?: string;
  quantity?: number;
};

/** Plain wa.me link with no pre-filled text — for nav/footer/general "chat with us" buttons. */
export function getWhatsAppLink(): string {
  return `https://wa.me/${getSiteSettings().whatsappNumber}`;
}

export function buildWhatsAppUrl(inquiry: WhatsAppInquiry): string {
  const productUrl = `${window.location.origin}/products/${inquiry.sku.toLowerCase()}`;

  const lines = [
    "Hello, I am interested in the following product.",
    "",
    `Product: ${inquiry.productName}`,
    `Product ID: ${inquiry.sku}`,
    `Product URL: ${productUrl}`,
  ];

  if (inquiry.variant) lines.push(`Selected Variant: ${inquiry.variant}`);
  if (inquiry.quantity) lines.push(`Quantity: ${inquiry.quantity}`);
  if (inquiry.material) lines.push(`Material: ${inquiry.material}`);
  if (inquiry.size) lines.push(`Size: ${inquiry.size}`);

  lines.push(`Price: ₹${inquiry.price.toLocaleString("en-IN")}`);
  lines.push("");
  lines.push("Please contact me regarding availability.");

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${getSiteSettings().whatsappNumber}?text=${text}`;
}
