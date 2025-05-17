import { createFileRoute } from "@tanstack/react-router";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getProductByIdQueryOptions,
  useGetProduct,
} from "../-api/use-get-product";
import ProductForm from "../-components/product-form";
import {
  productFormSchema,
  type ProductFormValues,
} from "../-components/product-form/validation-schema";
import { Form } from "@/components/ui/form";

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

  const form = useForm<ProductFormValues, any, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: data?.product.name,
      slug: data?.product.slug,
      sku: data?.product.sku ?? "",
      price: data?.product.price,
      cost: data?.product.cost ?? 0,
      allowBackorders: data?.product.allowBackorders ?? false,
      manageStock: data?.product.manageStock ?? true,
      stockQuantity: data?.product.stockQuantity,
      stockUnderThreshold: data?.product.stockUnderThreshold ?? 10,
      category: data?.product.category,
      parentId: data?.product.parentId,
      description: data?.product.description,
      status: data?.product.status,
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

  console.log("Product Detail page data:", data?.product);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 flex-col overflow-auto p-6">
        <Form {...form}>
          <form>
            <ProductForm data={data} form={form} />
          </form>
        </Form>
      </div>
    </div>
  );
}
