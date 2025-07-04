import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductStatusConfigs, type ProductResponseDto } from "../../-types";
import GeneralTab from "./general-tab";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormValues } from "./validation-schema";
import ProductImagesTab from "./images-tab";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProductInventoryTab from "./inventory-tab";
import ProductVariantTab from "./variants-tab";

type ProductFormProps = {
  data: ProductResponseDto;
  form: UseFormReturn<ProductFormValues>;
};

const ProductForm = ({ data }: ProductFormProps) => {
  const [activeTab, setActiveTab] = React.useState("general");
  const productConfigData =
    ProductStatusConfigs[
      data.product.status as keyof typeof ProductStatusConfigs
    ];
  const Icon = productConfigData.icon!;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="mb-6 flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="related">Related Products</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            SKU: {data.product.sku}
          </Badge>
          <Badge
            variant={productConfigData.color as any}
            className="flex items-center gap-1"
          >
            {<Icon />}
            {productConfigData.label}
          </Badge>
        </div>
      </div>

      <TabsContent value="general" className="space-y-6">
        <GeneralTab />
      </TabsContent>

      <TabsContent value="images" className="space-y-6">
        <DndProvider backend={HTML5Backend}>
          <ProductImagesTab />
        </DndProvider>
      </TabsContent>

      <TabsContent value="inventory" className="space-y-6">
        <ProductInventoryTab />
      </TabsContent>

      <TabsContent value="variants" className="space-y-6">
        <ProductVariantTab />
      </TabsContent>
    </Tabs>
  );
};

export default ProductForm;
