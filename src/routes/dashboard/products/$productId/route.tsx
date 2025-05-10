import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getProductByIdQueryOptions } from "../-api/use-get-product";

export const Route = createFileRoute("/dashboard/products/$productId")({
  component: () => <Outlet />,
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(
      getProductByIdQueryOptions(params.productId)
    );
    return {
      crumb: `${product.product.name}`,
    };
  },
});
