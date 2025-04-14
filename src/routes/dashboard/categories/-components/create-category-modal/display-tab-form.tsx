import { Input } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";
import { ImageIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  form: UseFormReturn<CategoryFormValues>;
};

const DisplayTabForm = ({ form }: Props) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  return (
    <div className="grid gap-6 md:grid-cols-1">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="banner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Banner</FormLabel>
              <FormControl>
                <div
                  className="flex aspect-[3/1] w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:bg-muted/50"
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
                      <div className="rounded-full p-3">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">
                        Upload Category Banner
                      </p>
                    </>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Recommended size: 1200x400px. Will be displayed at the top of
                the category page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-9">
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <FormDescription>
                  Category will be visible to customers
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0">
              <div className="space-y-0.5">
                <FormLabel>Featured Category</FormLabel>
                <FormDescription>
                  Display prominently on homepage and category listings
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 0;
                    field.onChange(value);
                  }}
                  value={field.value}
                />
              </FormControl>
              <FormDescription>
                Categories with lower numbers appear first
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DisplayTabForm;
