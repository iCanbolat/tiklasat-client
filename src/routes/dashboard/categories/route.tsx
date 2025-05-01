import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { getCategoriesFn, useCategories } from "./-api/use-categories";
import { categoryQueryKeys } from "./-types";
import { CategoriesTree } from "./-components/categories-tree";
import { CreateCategoryModal } from "./-components/create-category-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriesGridView } from "./-components/category-grid-view";
import { useCategoryStore, type CategoryViewTab } from "@/lib/category-store";

export const Route = createFileRoute("/dashboard/categories")({
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
  const { data: categories, isPending, error } = useCategories();
  const { activeTab, setActiveTab } = useCategoryStore();
  const navigate = useNavigate();

  if (isPending) return <div>Loading...</div>;
  if (!categories) return <div>No Category...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  console.log("CategoriesAll", categories);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex mt-4 gap-2">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as CategoryViewTab);
            if (value === "grid") {
              navigate({ to: "/dashboard/categories", replace: true });
            }
          }}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="tree">Tree View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>
          <TabsContent value="tree" className="flex gap-2 w-full">
            <CategoriesTree />
            <Outlet />
          </TabsContent>
          <TabsContent value="grid">
            <CategoriesGridView />
          </TabsContent>
        </Tabs>
      </div>
      <CreateCategoryModal />
    </div>
  );
}
