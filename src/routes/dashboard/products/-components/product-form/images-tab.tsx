import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useDrop, useDrag, DndProvider } from "react-dnd";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, GripVertical, Loader2, CloudUpload } from "lucide-react";
import { useUploadImage } from "../../-api/use-upload-image";
import { useParams } from "@tanstack/react-router";
import { HTML5Backend } from "react-dnd-html5-backend";

type ImageItem = {
  url: string;
  displayOrder: number;
  cloudinaryId?: string;
  file?: File;
};

const ProductImagesTab = () => {
  const { control, setValue, watch } = useFormContext();
  const { productId } = useParams({ strict: false });
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();

  const { fields, append, replace, remove, move } = useFieldArray({
    control,
    name: "images",
  });

  const images: ImageItem[] = watch("images") || [];

  const addImageInputRef = React.useRef<HTMLInputElement>(null);
  const changeImageInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const markDirty = (newImages: typeof images) => {
    replace(newImages);
    setValue("images", newImages, { shouldDirty: true });
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 10 - images.length);

    const newImgItems = newFiles.map((file, i) => ({
      file,
      url: URL.createObjectURL(file),
      displayOrder: images.length + i,
    }));

    markDirty([...images, ...newImgItems]);
  };

  const handleRemoveImage = (index: number) => {
    const newArr = images
      .filter((_, i) => i !== index)
      .map((img, idx) => ({ ...img, displayOrder: idx }));
    markDirty(newArr);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    URL.revokeObjectURL(images[idx].url);
    const newArr = images.map((img, i) =>
      i === idx
        ? {
            file,
            url: URL.createObjectURL(file),
            displayOrder: idx,
          }
        : img
    );
    markDirty(newArr);
  };

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    if (dragIndex === hoverIndex) return;

    const newArr = [...images];
    const [moved] = newArr.splice(dragIndex, 1);
    newArr.splice(hoverIndex, 0, moved);
    markDirty(newArr.map((img, idx) => ({ ...img, displayOrder: idx })));
    move(dragIndex, hoverIndex);
  };

  const uploadToCloudinary = async () => {
    if (!productId) return;
    const pending = images.filter((img) => img.file && !img.cloudinaryId);
    if (pending.length === 0) return;

    const results = await Promise.all(
      pending.map(async (img) => ({
        idx: images.findIndex((i) => i === img),
        res: await uploadImage({
          file: img.file!,
          folder: "products",
          productId,
          displayOrder: img.displayOrder,
        }),
      }))
    );
    const newArr = [...images];
    for (const r of results) {
      URL.revokeObjectURL(newArr[r.idx].url);
      newArr[r.idx] = {
        ...newArr[r.idx],
        url: r.res.url,
        cloudinaryId: r.res.public_id,
        file: undefined,
      };
    }
    markDirty(newArr);
  };

  const ImageThumbnail = ({
    image,
    index,
  }: {
    image: ImageItem;
    index: number;
  }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
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
          drag(drop(node));
        }}
        className={`relative aspect-square overflow-hidden rounded-lg border ${
          isDragging ? "opacity-50 border-primary" : "opacity-100"
        } transition-all duration-200`}
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
    <DndProvider backend={HTML5Backend}>
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>
            Manage product images and their display order. First image is
            thumbnail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <Label>Gallery Images ({images.length}/10)</Label>
                <div className="flex gap-2">
                  {images.length > 0 && productId && (
                    <Button
                      type="button"
                      onClick={uploadToCloudinary}
                      disabled={
                        isUploading || images.every((img) => img.cloudinaryId)
                      }
                    >
                      {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CloudUpload className="mr-2 h-4 w-4" />
                      )}
                      {isUploading ? "Uploading..." : "Upload to Cloudinary"}
                    </Button>
                  )}
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
    </DndProvider>
  );
};

export default ProductImagesTab;
