import { queryClient } from "@/main";
import { createFileRoute } from "@tanstack/react-router";
import { getCategoriesFn, useCategories } from "./-api/use-categories";
import { categoryQueryKeys } from "./-types";
// import CategoryDropdown from "./-components/category-dropdown";

export const Route = createFileRoute("/dashboard/categories/")({
  component: RouteComponent,
  loader: () =>
    queryClient.ensureQueryData({
      queryKey: [categoryQueryKeys.all],
      queryFn: getCategoriesFn,
    }),
});

function RouteComponent() {
  const { data: categories, isPending, error } = useCategories();

  if (isPending) return <div>Loading...</div>;
  if (!categories) return <div>No Category...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <div className="flex flex-col w-full h-full">
      <h5 className="text-2xl">Categories</h5>
      <div className="flex flex-1 flex-row mt-4 gap-2">
        {categories.map((category) => (
          <div className="h-64 w-64 relative bg-slate-500 rounded-md items-center justify-center flex flex-col cursor-pointer group">
            <div className="absolute inset-0 bg-black rounded-md opacity-55 group-hover:opacity-45 z-10"></div>
            {/* <div className="absolute flex m-auto z-20 right-2 top-2">
            <CategoryDropdown />
            </div> */}
            <h1 className="text-white text-xl font-bold absolute flex items-center justify-center z-20">
              {category.name}
            </h1>
            <img
              src={category.imageUrl}
              className="rounded-md absolute inset-0 z-0 object-cover"
              alt="Description of my image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
