import { useCategoryStore } from "@/lib/category-store";
import { FolderTree, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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

  return (
    <Dialog
      open={isCreateModalOpen}
      onOpenChange={(open) => !open && closeCreateModal()}
    >
      <DialogContent className="max-h-[95vh] max-w-4xl sm:max-w-xl md:max-w-6xl overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FolderTree className="h-6 w-6" />
            Create New Category
          </DialogTitle>
          <DialogDescription>
            Add a new product category to your store
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="basic" className="px-6">
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="display">Display</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <div className="h-[68vh] overflow-auto">
                <div className="pb-6">
                  <TabsContent value="basic" className="space-y-6">
                    <InfoTabForm form={form} />
                  </TabsContent>

                  <TabsContent value="display" className="space-y-6">
                    <DisplayTabForm form={form} />
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-6">
                    <SeoTabForm form={form} />
                  </TabsContent>
                </div>
              </div>
            </Tabs>

            <DialogFooter className="flex items-center justify-between border-t p-3">
              <Button variant="outline" onClick={closeCreateModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Category
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
