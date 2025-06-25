import GeneralTab from "../-components/product-form/general-tab";
import ProductImagesTab from "../-components/product-form/images-tab";
import ProductInventoryTab from "../-components/product-form/inventory-tab";
import SeoTab from "../-components/product-form/seo-tab";
import ProductVariantTab from "../-components/product-form/variants-tab";

export type TabConfig = {
  value: string;
  label: string;
  content: React.ReactNode;
  isDisabled?: boolean;
};

export const productCreateModalTabs = [
  {
    value: "general",
    label: "General",
    content: <GeneralTab />,
    isDisabled: false,
  },
  {
    value: "images",
    label: "Images",
    content: <ProductImagesTab />,
    isDisabled: false,
  },
  {
    value: "inventory",
    label: "Inventory",
    content: <ProductInventoryTab />,
    isDisabled: false,
  },
  {
    value: "variants",
    label: "Variants",
    content: <ProductVariantTab />,
    isDisabled: true,
  },
//   {
//     value: "related-products",
//     label: "Related Products",
//     content: <ProductVariantTab />,
//     isDisabled: false,
//   },
  { value: "seo", label: "SEO", content: <SeoTab />, isDisabled: false },
] as const;

export const productDetailTabs = productCreateModalTabs.map((tab) => ({
  ...tab,
  isDisabled: tab.value === "variants" ? false : tab.isDisabled,
}));

export type ProductTab = (typeof productCreateModalTabs)[number]["value"];

// export type ProductTabs =
//   | "general"
//   | "images"
//   | "inventory"
//   | "variants"
//   | "seo";

// export type TabConfig<T> = {
//   value: T;
//   label: string;
//   content: React.ReactNode;
//   isDisabled?: boolean;
// };

// export function getProductTabs(
//   isVariantActive: boolean
// ): TabConfig<ProductTabs>[] {
//   return [
//     { value: "general", label: "General", content: <GeneralTab /> },
//     { value: "images", label: "Images", content: <ProductImagesTab /> },
//     {
//       value: "inventory",
//       label: "Inventory",
//       content: <ProductInventoryTab />,
//     },
//     {
//       value: "variants",
//       label: "Variants",
//       content: <ProductVariantTab />,
//       isDisabled: isVariantActive,
//     },
//     { value: "seo", label: "SEO", content: <SeoTab /> },
//   ];
// }
