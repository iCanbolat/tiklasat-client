import { useCategoryStore } from "@/lib/category-store";
import { FolderTree } from "lucide-react";

import {
  categoryFormSchema,
  type CategoryFormValues,
} from "./validation-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SeoTabForm from "./seo-tab-form";
import InfoTabForm from "./info-tab-form";
import DisplayTabForm from "./display-tab-form";
import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCreateCategory } from "../../-api/use-create-category";
import { CreateFormModal } from "@/components/create-modal";

export function CreateCategoryModal() {
  const { isCreateModalOpen, closeCreateModal } = useCategoryStore();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const { categoryId } = useParams({ strict: false });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: categoryId ?? null,
      isActive: true,
      isFeatured: false,
      image: null,
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      displayOrder: 0,
      banner: null,
    },
  });

  useEffect(() => {
    form.setValue("parentId", categoryId ?? null);
  }, [categoryId]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      createCategory(data);
      closeCreateModal();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const tabs = [
    {
      value: "basic",
      label: "Basic Info",
      content: <InfoTabForm form={form} />,
    },
    {
      value: "display",
      label: "Display",
      content: <DisplayTabForm form={form} />,
    },
    {
      value: "seo",
      label: "SEO",
      content: <SeoTabForm form={form} />,
    },
  ];

  return (
    <CreateFormModal
      onSubmit={onSubmit}
      form={form}
      isSubmitting={isPending}
      title="Create New Category"
      description="Add a new product category to your store"
      icon={<FolderTree className="h-6 w-6" />}
      submitButtonText="Create Category"
      tabs={tabs}
    />
  );
}
