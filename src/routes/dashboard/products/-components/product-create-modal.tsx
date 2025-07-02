import { PackagePlus, Plus } from "lucide-react";
import {
  productFormSchema,
  type ProductFormValues,
} from "./product-form/validation-schema";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductStatusEnum } from "../-types";
import { CreateFormModal } from "@/components/create-modal";
import { useParams } from "@tanstack/react-router";
import { useCreateProduct } from "../-api/use-create-product";
import { useLayoutStore } from "@/lib/layout-store";
import { productTabDefs } from "../-types/constants";
import ProductInventoryTab from "./product-form/inventory-tab";
import { DndProvider } from "react-dnd";
import GeneralTab from "./product-form/general-tab";
import ProductImagesTab from "./product-form/images-tab";
import { HTML5Backend } from "react-dnd-html5-backend";
import RelatedProductsTab from "./product-form/related-products-tab";
import SeoTab from "./product-form/seo-tab";

const ProductCreateModal = () => {
  const { productId } = useParams({ strict: false });
  const { closeCreateModal } = useLayoutStore();
  const { mutateAsync: createProduct, isPending } = useCreateProduct();
  const formParent = useFormContext<ProductFormValues>();

  console.log("parentform", formParent?.getValues());

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: productId
      ? { ...formParent.getValues(), attributes: [], parentId: productId }
      : {
          name: "",
          slug: "",
          sku: "",
          price: 0,
          cost: 0,
          stockQuantity: 0,
          stockUnderThreshold: 10,
          attributes: [],
          allowBackorders: false,
          manageStock: true,
          parentId: productId,
          description: "",
          status: ProductStatusEnum.ACTIVE,
          isFeatured: false,
          images: [],
          metaTitle: "",
          metaDescription: "",
          metaKeywords: "",
          relatedProducts: [],
        },
  });

  const productCreateModalTabs = productTabDefs.map((def) => ({
    ...def,
    content: (() => {
      switch (def.value) {
        case "general":
          return <GeneralTab />;
        case "images":
          return (
            <DndProvider backend={HTML5Backend}>
              <ProductImagesTab />
            </DndProvider>
          );
        case "inventory":
          return <ProductInventoryTab />;
        case "related-products":
          return <RelatedProductsTab />;
        case "seo":
          return <SeoTab />;
        default:
          return null;
      }
    })(),
  }));

  console.log("createform", form?.getValues());

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "images") return;

        if (value === null || value === undefined) {
          return;
        }

        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      data.images?.forEach((img, index) => {
        if (img.file) formData.append("files", img.file);
        formData.append("imageUrls", String(img.url));
        formData.append("displayOrders", String(index));
        if (img.cloudinaryId) {
          formData.append("cloudinaryIds", img.cloudinaryId);
        }
      });

      const res = await createProduct(formData);
      console.log("Product created successfully:", res);

      closeCreateModal();
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <CreateFormModal
      onSubmit={onSubmit}
      form={form}
      isSubmitting={isPending}
      title="Create New Product"
      description="Add a new product to your store"
      icon={<PackagePlus className="h-6 w-6" />}
      tabs={[...productCreateModalTabs]}
      submitButtonText={
        <>
          <Plus className="h-4 w-4" />
          Create Product
        </>
      }
    />
  );
};

export default ProductCreateModal;
