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
} from "../-components/product-form/validation-schema";
import { Form } from "@/components/ui/form";
import React from "react";
import { ProductStatusConfigs, ProductStatusEnum } from "../-types";
import GeneralTab from "../-components/product-form/general-tab";
import ProductImagesTab from "../-components/product-form/images-tab";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProductInventoryTab from "../-components/product-form/inventory-tab";
import ProductVariantTab from "../-components/product-form/variants-tab";
import { getDirtyValues, getDirtyValuess } from "@/lib/utils";
import { useLayoutStore } from "@/lib/layout-store";
import { toast } from "sonner";

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

  const [activeTab, setActiveTab] = React.useState("general");

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
      // metaTitle: data?.product.metaTitle,
      // metaDescription: data?.product.metaDescription,
      // metaKeywords: data?.product.metaKeywords,
    },
  });

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

  // console.log("Product Detail page data:", form.getValues());

  const onSubmit = async (dataa: ProductFormValues) => {
    // console.log("zort");

    try {
      console.log("orjData", form.getValues());
       const formData = new FormData();
      const changedData = getDirtyValuess(
        form.formState.dirtyFields,
        dataa
      );
      const payload: any = { ...changedData };

      const allImages = dataa.images || [];
      const prevImages = data?.product.images || [];

      // const added = allImages.filter((img) => img.file && !img.cloudinaryId);
      const removed = prevImages
        .filter(
          (prev) =>
            !allImages.some((cur) => cur.cloudinaryId === prev.cloudinaryId)
        )
        .map((i) => i.cloudinaryId);

      // if (added.length) payload.addImages = added;
      if (removed.length) payload.removeImageIds = removed;

      if (Object.keys(payload).length === 0) {
        return; // nothing changed
      }

      console.log("changedDAta", payload);

      Object.entries(changedData).forEach(([key, value]) => {
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
      dataa.images?.forEach((img, index) => {
        if (img.file) {
          formData.append("files", img.file);
        }
        formData.append("imageUrls", img.url);
        formData.append("displayOrders", String(index));
        if (img.cloudinaryId) {
          formData.append("cloudinaryIds", img.cloudinaryId);
        }
      });

      console.log("formdata", formData);

      // const res = await createProduct(formData);
      // console.log("Product created successfully:", res);

      // closeCreateModal();
    } catch (error) {
      console.error("Failed to create product:", error);
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="mb-6 flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="related">Related Products</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
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

              <TabsContent value="general" className="space-y-6">
                <GeneralTab />
              </TabsContent>

              <TabsContent value="images" className="space-y-6">
                <DndProvider backend={HTML5Backend}>
                  <ProductImagesTab />
                </DndProvider>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6">
                <ProductInventoryTab />
              </TabsContent>

              <TabsContent value="variants" className="space-y-6">
                <ProductVariantTab />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}
