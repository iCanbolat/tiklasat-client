import { createFileRoute } from "@tanstack/react-router";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  getProductByIdQueryOptions,
  useGetProduct,
} from "../-api/use-get-product";

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

  // const form = useForm<ProductFormValues>({
  //   resolver: zodResolver(productFormSchema),
  // });

  // useEffect(() => {
  //   form.reset({
  //     name: data?.product.product.name,
  //     slug: data?.product.product.slug,
  //     parentId: data?.product.product.parentId,
  //     description: data?.product.product.description,
  //     status: data?.product.product.status,
  //     isFeatured: data?.product.product.isFeatured,
  //     images: data?.product.images ?? [],
  //     metaTitle: data?.product.product.metaTitle ?? "",
  //     metaDescription: data?.category.metaDescription ?? "",
  //     metaKeywords: data?.category.metaKeywords ?? "",
  //     displayOrder: data?.category.displayOrder ?? 0,
  //     banner: data?.category.banner,
  //   });
  // }, [productId, data]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  console.log("Product Detail page data:", data?.product);

  return <div>Hello "/dashboard/products/$productId"!</div>;
}
