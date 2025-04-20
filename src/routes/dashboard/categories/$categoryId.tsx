import { createFileRoute } from "@tanstack/react-router";
import { CategoryDetails } from "./-components/category-details";
import {
  getCategoryByIdQueryOptions,
  useGetCategoryById,
} from "./-api/use-get-category";
import { useEffect } from "react";
import { useEditCategory } from "./-api/use-edit-category";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  categoryFormSchema,
  tabSchema,
  type CategoryFormValues,
} from "./-components/create-category-modal/validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,

} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

export const Route = createFileRoute("/dashboard/categories/$categoryId")({
  component: CategoryDetailsCard,
  validateSearch: zodValidator(tabSchema),
  loader: async ({ params, context }) => {
    context.queryClient.ensureQueryData(
      getCategoryByIdQueryOptions(params.categoryId)
    );
  },
});

function CategoryDetailsCard() {
  const { categoryId } = Route.useParams();
  const { tab } = Route.useSearch();
  const { data, isLoading } = useGetCategoryById(categoryId);

  console.log("category", data);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
  });

  const { mutate, isPending } = useEditCategory(categoryId, {
    onSuccess: () => toast.success("Category updated!"),
    onError: () => toast.error("Error occurred!"),
  });

  useEffect(() => {
    form.reset({
      name: data?.category.name,
      slug: data?.category.slug,
      parentId: data?.category.parentId ?? "none",
      description: data?.category.description ?? "",
      isActive: data?.category.isActive,
      isFeatured: data?.category.isFeatured,
      image: data?.category.imageUrl,
      metaTitle: data?.category.metaTitle ?? "",
      metaDescription: data?.category.metaDescription ?? "",
      metaKeywords: data?.category.metaKeywords ?? "",
      displayOrder: data?.category.displayOrder ?? 0,
      banner: data?.category.banner,
    });
  }, [categoryId, data]);

  const isDisabled =
    ["subcategories", "products"].some((t) => t === tab) || isPending;

  function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    values.parentId === "none" ? null : values.parentId;
    mutate(values);
  }

  if (isLoading || !data) {
    return (
      <Card className="h-[87.5vh] w-full flex items-center justify-center">
        <CardContent className="text-center p-6">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          <h3 className="text-lg font-medium mb-2">Loading</h3>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full pb-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CategoryDetails form={form} data={data} />
        </form>
      </Form>

      <CardFooter className="flex justify-between mt-auto border-t p-4">
        <Button disabled={isDisabled} variant="outline">
          Cancel
        </Button>
        <Button disabled={isDisabled} type="submit">
          {isPending && <Loader2 className="animate-spin" />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
