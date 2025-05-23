import type { IProductAttributes } from "@/routes/dashboard/products/-types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSKUFromAttributes(
  attributes: IProductAttributes[]
): string {
  if (!attributes || attributes.length === 0) {
    return "BASE";
  }

  const sortedAttributes = [...attributes].sort((a, b) =>
    a.variantType.localeCompare(b.variantType)
  );

  // Generate SKU parts (e.g., "COL-RED-SIZ-LG")
  const skuParts = sortedAttributes.map((attr) => {
    const typeAbbr = attr.variantType.slice(0, 3).toUpperCase();
    const valueAbbr = attr.value.slice(0, 3).toUpperCase();
    return `${typeAbbr}-${valueAbbr}`;
  });

  return skuParts.join("-");
}
