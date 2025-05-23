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

  const [activeTab, setActiveTab] = React.useState("general");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: data?.product.name,
      slug: data?.product.slug,
      sku: data?.product.sku ?? "",
      price: data?.product.price,
      cost: data?.product.cost ?? 0,
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

  if (isPending || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const Icon = ProductStatusConfigs[data.product.status].icon!;

  console.log("Product Detail page data:", form.getValues());

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 flex-col overflow-auto p-6">
        <Form {...form}>
          <form>
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
                    variant={
                      ProductStatusConfigs[data.product.status].color as any
                    }
                    className="flex items-center gap-1"
                  >
                    {<Icon />}
                    {ProductStatusConfigs[data.product.status].label}
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
