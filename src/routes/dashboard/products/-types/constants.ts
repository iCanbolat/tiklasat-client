export type TabConfig = {
  value: string;
  label: string;
  content: React.ReactNode;
  isDisabled?: boolean;
};

export const productTabDefs = [
  {
    value: "general",
    label: "General",
    isDisabled: false,
  },
  {
    value: "images",
    label: "Images",
    isDisabled: false,
  },
  {
    value: "inventory",
    label: "Inventory",
    isDisabled: false,
  },
  {
    value: "variants",
    label: "Variants",
    isDisabled: true,
  },
  {
    value: "related-products",
    label: "Related Products",
    isDisabled: false,
  },
  { value: "seo", label: "SEO", isDisabled: false },
] as const;
export type ProductTab = (typeof productTabDefs)[number]["value"];
