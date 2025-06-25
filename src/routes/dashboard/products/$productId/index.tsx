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

import { getDirtyValuess } from "@/lib/utils";
import { useEditProduct } from "../-api/use-edit-product";
import { useLayoutStore } from "@/lib/layout-store";

import { productDetailTabs } from "../-types/constants";

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

  const onSubmit = async (values: ProductFormValues) => {
    try {
      // console.log("orjData", form.getValues());
      setIsPending(true);

      const formData = new FormData();
      let changedData = getDirtyValuess(form.formState.dirtyFields, values);
      const payload: any = { ...changedData };

      const allImages = values.images || [];
      const prevImages = data?.product.images || [];

      const removed = prevImages
        .filter(
          (prev) =>
            !allImages.some((cur) => cur.cloudinaryId === prev.cloudinaryId)
        )
        .map((i) => i.cloudinaryId);

      removed.forEach((id) => {
        formData.append("imagesToDelete", String(id));
      });

      if (Object.keys(payload).length === 0) {
        setIsPending(false);
        return;
      }

      // console.log("changedDAta", payload);

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images") return;

        if (value === null || value === undefined) {
          return;
        }

        if (typeof value === "object" && value !== null) {
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
                    <TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>
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
                <TabsContent value={tab.value} className="space-y-6">
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
