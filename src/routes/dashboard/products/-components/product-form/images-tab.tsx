import React from "react";
import { useFormContext, type UseFormReturn } from "react-hook-form";
import type { ProductFormValues } from "./validation-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, GripVertical } from "lucide-react";
import { useDrop, useDrag } from "react-dnd";

type ProductImagesTab = {};
type ImageItem = {
  url: string;
  displayOrder: number;
  cloudinaryId?: string;
  file?: File;
};

const ProductImagesTab = (props: ProductImagesTab) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const images: ImageItem[] = watch("images") || [];

  console.log(images);

  const addImageInputRef = React.useRef<HTMLInputElement>(null);
  const changeImageInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 10 - images.length);

    const newImages = newFiles.map((file, index) => ({
      url: URL.createObjectURL(file),
      displayOrder: images.length + index,
      file,
    }));

    setValue("images", [...images, ...newImages], { shouldValidate: true });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images
      .filter((_, i) => i !== index)
      .map((img, idx) => ({ ...img, displayOrder: idx }));

    setValue("images", newImages, { shouldValidate: true });

    if (images[index]?.file) {
      URL.revokeObjectURL(images[index].url);
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images[index]?.file) {
      URL.revokeObjectURL(images[index].url);
    }

    const newImages = [...images];
    newImages[index] = {
      url: URL.createObjectURL(file),
      displayOrder: index,
      file,
    };

    setValue("images", newImages, { shouldValidate: true });
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    const reorderedImages = newImages.map((img, idx) => ({
      ...img,
      displayOrder: idx,
    }));

    setValue("images", reorderedImages, { shouldValidate: true });
  };

  const ImageThumbnail = ({
    image,
    index,
  }: {
    image: ImageItem;
    index: number;
  }) => {
    const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
      type: "IMAGE",
      item: { index },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    const [, drop] = useDrop(() => ({
      accept: "IMAGE",
      hover: (item: { index: number }) => {
        if (item.index !== index) {
          moveImage(item.index, index);
          item.index = index;
        }
      },
    }));

    return (
      <div
        ref={(node) => {
          if (node) {
            drag(drop(node));
          }
        }}
        className={`relative aspect-square overflow-hidden rounded-lg border ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        <img
          src={image.url}
          alt={`Product image ${index + 1}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              className="z-10"
              onClick={(e) => {
                e.stopPropagation();
                changeImageInputRefs.current[index]?.click();
              }}
            >
              Change
              <input
                type="file"
                ref={(el) => {
                  changeImageInputRefs.current[index] = el;
                }}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
              />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              type="button"
              className="z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage(index);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="absolute top-2 left-2 bg-gray-800/80 text-white p-1 rounded cursor-move">
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="absolute bottom-2 right-2 bg-gray-800/80 text-white text-xs px-2 py-1 rounded">
          {index + 1}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>
          Manage product images and its display order. First image is thumbnail
          of product.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Gallery Images ({images.length}/10)</Label>
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={images.length >= 10}
                onClick={() => addImageInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Add Image
                <input
                  type="file"
                  ref={addImageInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleAddImages}
                />
              </Button>
            </div>
            {images.length === 0 ? (
              <div className="flex items-center justify-center h-32 rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">
                  No images uploaded yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {images
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((image, index) => (
                    <ImageThumbnail key={index} image={image} index={index} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductImagesTab;
