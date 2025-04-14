import { createFileRoute } from "@tanstack/react-router";
import { getCategoriesFn, useCategories } from "./-api/use-categories";
import { categoryQueryKeys } from "./-types";
import { CategoryDetails } from "./-components/category-details";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CategoriesTree } from "./-components/categories-tree";
import { CreateCategoryModal } from "./-components/create-category-modal";

export const Route = createFileRoute("/dashboard/categories/")({
  component: RouteComponent,
  beforeLoad: () => {
    return {
      crumb: "Categories",
    };
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: categoryQueryKeys.all,
      queryFn: getCategoriesFn,
    }),
});

function RouteComponent() {
  const {
    data: categories,
    isPending,
    error,
  } = useSuspenseQuery(useCategories);

  if (isPending) return <div>Loading...</div>;
  if (!categories) return <div>No Category...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex mt-4 gap-2">
        <CategoriesTree />
        <CategoryDetails />
      </div>
      <CreateCategoryModal />
    </div>
  );
}
