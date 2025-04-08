import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "./validation-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "../../-api/use-categories";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ICategory } from "../../-types";

type Props = {
  form: UseFormReturn<CategoryFormValues>;
};
const BasicInfoForm = ({ form }: Props) => {
  const { data: categories } = useSuspenseQuery(useCategories);
  console.log("categories", categories);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    form.setValue("slug", slug);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        form.setValue("image", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const renderCategoryOption = (category: ICategory, level = 0) => {
    console.log("renderoption", category);

    return (
      <React.Fragment key={category.id}>
        <SelectItem
          value={category.id}
          className={cn("flex items-center gap-2", level > 0 && "pl-[20px]")}
        >
          <div className="flex items-center gap-2">
            {level > 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
            <span>{category.name}</span>
          </div>
        </SelectItem>
        {category.subcategories.map((child: any) =>
          renderCategoryOption(child, level + 1)
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Electronics, Clothing, etc."
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!form.getValues("slug")) {
                      generateSlug(e.target.value);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    placeholder="category-slug"
                    {...field}
                    // onChange={(e) => {
                    //   field.onChange(e);
                    // }}
                  />
                </FormControl>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => generateSlug(form.getValues("name"))}
                  title="Generate from name"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
              <FormDescription>
                This will be used in the URL: yourstore.com/categories/
                <strong>{form.getValues("slug") || "category-slug"}</strong>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this category..."
                  rows={4}
                  {...field}
                  //   onChange={(e) => {
                  //     field.onChange(e);
                  //   }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select
                value={field.value || "none"}
                onValueChange={(value) => {
                  const parentId = value === "none" ? null : value;
                  field.onChange(parentId);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="None (Top Level Category)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">
                    None (Top Level Category)
                  </SelectItem>
                  {categories.map((category) => renderCategoryOption(category))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select a parent to create a subcategory
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Image</FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all hover:bg-muted/50",
                    field.value
                      ? "border-transparent"
                      : "border-muted-foreground/25"
                  )}
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {field.value ? (
                    <>
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                        <img
                          src={field.value || ""}
                          alt="Category preview"
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button variant="secondary">Change Image</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-muted p-4">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">
                        Upload Category Image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Drag & drop or click to browse
                      </p>
                    </>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Recommended size: 800x800px. Max file size: 2MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BasicInfoForm;
