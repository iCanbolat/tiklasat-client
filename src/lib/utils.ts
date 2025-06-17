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

export function getDirtyValues(dirtyFields: any, allValues: any): any {
  // If it's a boolean dirty flag or an array → send full value
  if (dirtyFields === true || Array.isArray(dirtyFields)) {
    return allValues;
  }

  const result: any = {};
  for (const key of Object.keys(dirtyFields)) {
    const df = dirtyFields[key];
    if (df === true) {
      result[key] = allValues[key];
    } else {
      const nested = getDirtyValues(df, allValues[key]);
      // Only include if nested is non-null AND, for objects, non-empty
      if (
        nested !== null &&
        (typeof nested !== "object" || Object.keys(nested).length > 0)
      ) {
        result[key] = nested;
      }
    }
  }

  // If no fields are dirty, return null
  return Object.keys(result).length ? result : null;
}
export function getDirtyValuess(dirty: any, values: any): any {
  if (dirty === true) return values;

  // Handle arrays
  if (Array.isArray(dirty) && Array.isArray(values)) {
    const changedArray = dirty
      .map((d, i) => {
        const value = values[i];
        if (value === undefined) return null;

        const changed = getDirtyValuess(d, value);

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

    const changed = getDirtyValuess(dirty[key], values[key]);

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
