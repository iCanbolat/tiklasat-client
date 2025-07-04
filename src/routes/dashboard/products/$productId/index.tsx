import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getProductByIdQueryOptions,
  useGetProduct,
} from "../-api/use-get-product";
import {
  productFormSchema,
  type ProductFormValues,
  type ProductImageItem,
} from "../-components/product-form/validation-schema";
import { Form } from "@/components/ui/form";
import { ProductStatusConfigs, ProductStatusEnum } from "../-types";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { getDirtyValues } from "@/lib/utils";
import { useEditProduct } from "../-api/use-edit-product";
import { useLayoutStore } from "@/lib/layout-store";

import GeneralTab from "../-components/product-form/general-tab";
import ProductImagesTab from "../-components/product-form/images-tab";
import ProductInventoryTab from "../-components/product-form/inventory-tab";
import ProductVariantTab from "../-components/product-form/variants-tab";
import SeoTab from "../-components/product-form/seo-tab";
import RelatedProductsTab from "../-components/product-form/related-products-tab";
import { productTabDefs } from "../-types/constants";

export const Route = createFileRoute("/dashboard/products/$productId/")({
  component: ProductEditComponent,
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      getProductByIdQueryOptions(params.productId)
    );
  },
});

function ProductEditComponent() {
  const { productId } = Route.useParams();
  const { data, isPending } = useGetProduct(productId);

  const setIsPending = useLayoutStore((s) => s.setIsPending);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: data?.product.name,
      slug: data?.product.slug,
      sku: data?.product.sku ?? undefined,
      price: data?.product.price,
      cost: data?.product.cost ?? 1,
      stockQuantity: data?.product.stockQuantity,
      stockUnderThreshold: data?.product.stockUnderThreshold ?? 10,
      attributes: data?.product.attributes ?? [],
      allowBackorders: data?.product.allowBackorders ?? false,
      manageStock: data?.product.manageStock ?? true,
      category: data?.product.category,
      relatedProducts: data?.relatedProducts?.map((i) => i.id) ?? [],
      parentId: data?.product.parentId,
      description: data?.product.description,
      status: (data?.product.status as ProductStatusEnum) ?? null,
      isFeatured: data?.product.isFeatured ?? false,
      images: data?.product.images ?? [],
      metaTitle: data?.product.metaTitle,
      metaDescription: data?.product.metaDescription,
      metaKeywords: data?.product.metaKeywords,
    },
  });

  const productDetailTabs = productTabDefs.map((def) => ({
    ...def,
    isDisabled:
      def.value === "variants"
        ? data?.product.parentId
          ? true
          : false
        : def.isDisabled,
    content: (() => {
      switch (def.value) {
        case "general":
          return <GeneralTab />;
        case "images":
          return (
            <DndProvider backend={HTML5Backend}>
              <ProductImagesTab />
            </DndProvider>
          );
        case "inventory":
          return <ProductInventoryTab />;
        case "variants":
          return <ProductVariantTab />;
        case "related-products":
          return <RelatedProductsTab />;
        case "seo":
          return <SeoTab />;
        default:
          return null;
      }
    })(),
  }));

  const { mutateAsync: editProduct } = useEditProduct(productId, form);

  if (isPending || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const productConfigData =
    ProductStatusConfigs[
      data.product.status as keyof typeof ProductStatusConfigs
    ];
  const Icon = productConfigData.icon!;

  console.log("Product Detail page data:", data);
  let dirtyFields = form.formState.dirtyFields;

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsPending(true);

      let changedData = getDirtyValues(dirtyFields, values);
      const payload: any = { ...changedData };

      const allImages = values.images || [];
      const prevImages = data?.product.images || [];

      const removedImages = prevImages
        .filter(
          (prev) =>
            !allImages.some((cur) => cur.cloudinaryId === prev.cloudinaryId)
        )
        .map((i) => i.cloudinaryId);

      removedImages.forEach((id) => {
        formData.append("imagesToDelete", String(id));
      });

      const allCurrent = values.relatedProducts ?? [];
      const original = data?.relatedProducts?.map((p) => p.id) ?? [];

      const added = allCurrent.filter((id) => !original.includes(id));
      const removedRelatedProducts = original.filter(
        (id) => !allCurrent.includes(id)
      );

      console.log("chandeData", payload);

      const hasPayload = Object.keys(payload).length > 0;
      const hasRelatedChanges =
        added.length > 0 || removedRelatedProducts.length > 0;

      if (!hasPayload && !hasRelatedChanges) {
        setIsPending(false);
        return;
      }

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images" || key === "relatedProducts") return;

        if (value === null || value === undefined) return;

        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      payload.images?.forEach((img: ProductImageItem) => {
        if (img.file) {
          formData.append("files", img.file);
        }
        formData.append("imageUrls", String(img.url));
        formData.append("displayOrders", String(img.displayOrder));
        if (img.cloudinaryId) {
          formData.append("cloudinaryIds", img.cloudinaryId);
        }
      });

      if (added.length) {
        added.forEach((id) => formData.append("relatedProductsToAdd", id));
      }
      if (removedRelatedProducts.length) {
        removedRelatedProducts.forEach((id) =>
          formData.append("relatedProductsToRemove", id)
        );
      }

      formData.append("id", productId);

      const res = await editProduct(formData);
      setIsPending(false);

      console.log("Product updated successfully:", res);
    } catch (error) {
      setIsPending(false);
      console.error("Failed to update product:", error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 flex-col overflow-auto p-6">
        <Form {...form}>
          <form
            id="edit-product"
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors)
            )}
          >
            <Tabs defaultValue={productDetailTabs[0].value}>
              <div className="mb-6 flex items-center justify-between">
                <TabsList>
                  {productDetailTabs.map((tab) => (
                    <TabsTrigger
                      disabled={tab.isDisabled}
                      key={tab.value}
                      value={tab.value}
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    SKU: {data.product.sku}
                  </Badge>
                  <Badge
                    variant={productConfigData.color as any}
                    className="flex items-center gap-1"
                  >
                    {<Icon />}
                    {productConfigData.label}
                  </Badge>
                </div>
              </div>

              {productDetailTabs.map((tab) => (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="space-y-6"
                >
                  {tab.value === "images" ? (
                    <DndProvider backend={HTML5Backend}>
                      {tab.content}
                    </DndProvider>
                  ) : (
                    tab.content
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}
