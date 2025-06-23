import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import type { ProductFormValues } from "./validation-schema";
import { TagInput } from "@/components/ui/tag-input";

const SeoTab = () => {
  const form = useFormContext<ProductFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
        <CardDescription>Optimize product for search engines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Title</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>
                Recommended length: 50-60 characters
              </FormDescription>
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
                <Textarea {...field} rows={3} value={field.value ?? ""} />
              </FormControl>
              <FormDescription>
                Recommended length: 150-160 characters
              </FormDescription>
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
                <TagInput
                  value={
                    field.value
                      ? field.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      : []
                  }
                  onChange={(tags: readonly string[]) =>
                    field.onChange(tags.join(", "))
                  }
                />
              </FormControl>
              <FormDescription>Recommended length : 3-10 tags</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-medium">Search Preview</h3>
          <div className="space-y-1">
            <div className="text-sm text-blue-600 hover:underline">
              {form.getValues("metaTitle") || form.getValues("name")} | Your
              Store Name
            </div>
            <div className="text-xs text-green-700">
              yourstore.com/products/{form.getValues("slug").toLowerCase()}
            </div>
            <div className="text-xs text-gray-600">
              {form.getValues("metaDescription")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoTab;
