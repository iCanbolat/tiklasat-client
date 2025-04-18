import type { UseFormReturn } from "react-hook-form";
import type { CategoryFormValues } from "./validation-schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

type SeoTabFormProps = {
  form: UseFormReturn<CategoryFormValues>;
};

const SeoTabForm = ({ form }: SeoTabFormProps) => {
  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="metaTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Title</FormLabel>
            <FormControl>
              <Input placeholder="Category meta title for SEO" {...field} />
            </FormControl>
            <div className="flex justify-between text-xs">
              <FormDescription>
                Recommended length: 50-60 characters
              </FormDescription>
              <span
                className={cn(
                  (field.value?.length || 0) > 60
                    ? "text-red-500"
                    : "text-muted-foreground"
                )}
              >
                {field.value?.length || 0}/60
              </span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metaDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description for search engine results"
                rows={3}
                {...field}
              />
            </FormControl>
            <div className="flex justify-between text-xs">
              <FormDescription>
                Recommended length: 150-160 characters
              </FormDescription>
              <span
                className={cn(
                  (field.value?.length || 0) > 160
                    ? "text-red-500"
                    : "text-muted-foreground"
                )}
              >
                {field.value?.length || 0}/160
              </span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metaKeywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Keywords</FormLabel>
            <FormControl>
              <Input
                placeholder="keyword1, keyword2, keyword3"
                {...field}
              />
            </FormControl>
            <FormDescription>Separate keywords with commas</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Search Preview</h3>
        <div className="space-y-1">
          <div className="text-sm text-blue-600 hover:underline">
            {form.getValues("metaTitle") ||
              form.getValues("name") ||
              "New Category"}{" "}
            | Your Store Name
          </div>
          <div className="text-xs text-green-700">
            yourstore.com/categories/{form.getValues("slug") || "category-slug"}
          </div>
          <div className="text-xs text-gray-600">
            {form.getValues("metaDescription") ||
              `Browse our selection of ${(form.getValues("name") || "products").toLowerCase()} at Your Store. Find the best deals on ${(form.getValues("name") || "items").toLowerCase()} with fast shipping and excellent customer service.`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoTabForm;
