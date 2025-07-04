import type { IProductAttributes } from "@/routes/dashboard/products/-types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {} from "@hookform/resolvers";

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

export function getDirtyValues(dirty: any, values: any): any {
  if (dirty === true) return values;

  // Handle arrays
  if (Array.isArray(dirty) && Array.isArray(values)) {
    const changedArray = dirty
      .map((d, i) => {
        const value = values[i];
        if (value === undefined) return null;

        const changed = getDirtyValues(d, value);

        const isChanged =
          changed &&
          ((typeof changed === "object" && Object.keys(changed).length > 0) ||
            typeof changed !== "object");

        return isChanged ? value : null;
      })
      .filter((item) => item !== null);

    return changedArray.length > 0 ? changedArray : undefined;
  }

  // Handle objects
  const result: Record<string, any> = {};
  for (const key in dirty) {
    if (values?.[key] === undefined) continue;

    const changed = getDirtyValues(dirty[key], values[key]);

    const shouldInclude =
      (Array.isArray(changed) && changed.length > 0) ||
      (typeof changed === "object" &&
        changed !== null &&
        Object.keys(changed).length > 0) ||
      typeof changed !== "object";

    if (shouldInclude) {
      result[key] = changed;
    }
  }

  return result;
}
