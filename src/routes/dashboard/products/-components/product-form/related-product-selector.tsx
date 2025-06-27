import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";
import { Search, X, Plus, Check, Package, Star, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { useInfiniteProducts } from "../../-api/use-get-products";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";
import {
  productStatusOptions,
  type IRelatedProduct,
  type ProductServiceResponse,
} from "../../-types";
import { toast } from "sonner";
import { getStatusBadge } from "./-utils";

type Props = {
  selectedProducts: IRelatedProduct[];
  onProductsChange?: (products: IRelatedProduct[]) => void;
};

const AddRelatedProductModal = ({
  selectedProducts,
  onProductsChange,
}: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [tempSelectedProducts, setTempSelectedProducts] = React.useState<
    IRelatedProduct[]
  >([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteProducts({
    search: debouncedSearchQuery.length >= 2 ? debouncedSearchQuery : undefined,
    category: categoryFilter,
    status: statusFilter,
  });

  const allProducts = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  console.log("allprods", allProducts);

  React.useEffect(() => {
    if (isOpen) {
      setTempSelectedProducts([...selectedProducts]);
    }
  }, [isOpen, selectedProducts]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight * 1.2;

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // const filteredProducts = React.useMemo(() => {
  //   return allProducts.filter((data) => {
  //     const matchesSearch = debouncedSearchQuery
  //       ? data.product.name
  //           .toLowerCase()
  //           .includes(debouncedSearchQuery.toLowerCase()) ||
  //         (data.product?.sku &&
  //           data.product.sku
  //             .toLowerCase()
  //             .includes(debouncedSearchQuery.toLowerCase()))
  //       : true;

  //     const matchesCategory =
  //       categoryFilter !== "all"
  //         ? data.category?.find((c) => c.slug === categoryFilter)
  //         : true;

  //     const matchesStatus =
  //       statusFilter !== "all" ? data.product.status === statusFilter : true;

  //     return matchesSearch && matchesCategory && matchesStatus;
  //   });
  // }, [allProducts, debouncedSearchQuery, categoryFilter, statusFilter]);

  const toggleProductSelection = (data: ProductServiceResponse) => {
    const isSelected = isProductSelected(data.product.id);

    if (isSelected) {
      setTempSelectedProducts((prev) =>
        prev.filter((p) => p.id !== data.product.id)
      );
    } else {
      let newProduct: IRelatedProduct = {
        ...data.product,
        images: data.images || [],
        category: data.category,
      };
      setTempSelectedProducts((prev) => [...prev, newProduct]);
    }
  };

  //FIX
  const uniqueCategories = React.useMemo(() => {
    const categoryMap = new Map<
      string,
      { id: string; name: string; slug: string }
    >();

    allProducts?.forEach((product) => {
      console.log("foreach", product);

      const categories = Array.isArray(product.category)
        ? product.category
        : product.category && typeof product.category === "object"
          ? [product.category]
          : [];

      categories.forEach((cat) => {
        if (cat?.id && !categoryMap.has(cat.id)) {
          categoryMap.set(cat.id, cat);
        }
      });
    });

    return Array.from(categoryMap.values());
  }, []);

  const handleSave = () => {
    // onProductsChange(tempSelectedProducts);
    setIsOpen(false);
    toast.success("Related products updated");
  };

  const isProductSelected = (productId: string) => {
    return tempSelectedProducts.some((p) => p.id === productId);
  };

  const handleCancel = () => {
    setTempSelectedProducts([...selectedProducts]);
    setIsOpen(false);
  };

  const clearAllSelections = () => {
    setTempSelectedProducts([]);
  };

  const selectAllFiltered = () => {
    const newSelections: IRelatedProduct[] = allProducts
      .filter((data) => !isProductSelected(data.product.id))
      .map((data) => data.product);

    setTempSelectedProducts((prev) => [...prev, ...newSelections]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Related Products
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl min-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Related Products</DialogTitle>
          <DialogDescription>
            Choose products that are related to this item. These will be shown
            as recommendations to customers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {productStatusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selection Summary */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {tempSelectedProducts.length} products selected
              </span>
              {tempSelectedProducts.length > 0 && (
                <Badge variant="secondary">{tempSelectedProducts.length}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {allProducts.length > 0 && (
                <Button variant="ghost" size="sm" onClick={selectAllFiltered}>
                  Select All Filtered
                </Button>
              )}
              {tempSelectedProducts.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllSelections}>
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <ScrollArea
            className="h-[400px] rounded-md border"
            onScroll={handleScroll}
          >
            <div className="p-4">
              {isLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : allProducts.length > 0 ? (
                <div className="grid gap-3">
                  {allProducts.map((data) => (
                    <ProductCard
                      key={data.product.id}
                      data={data}
                      isSelected={isProductSelected(data.product.id)}
                      onSelect={toggleProductSelection}
                    />
                  ))}
                  {isFetchingNextPage && (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState
                  hasFilters={
                    !!searchQuery ||
                    categoryFilter !== "all" ||
                    statusFilter !== "all"
                  }
                />
              )}
            </div>
          </ScrollArea>

          {/* Selected Products Preview */}
          {tempSelectedProducts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">Selected Products:</h4>
                <Badge variant="outline">{tempSelectedProducts.length}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {tempSelectedProducts.map((data) => (
                  <Badge key={data.id} variant="secondary" className="gap-1">
                    {data.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTempSelectedProducts((prev) =>
                          prev.filter((p) => p.id !== data.id)
                        );
                      }}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Selection ({tempSelectedProducts.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EmptyState = ({ hasFilters }: { hasFilters: boolean }) => (
  <div className="flex h-32 items-center justify-center text-center">
    <div className="space-y-2">
      <Package className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        {hasFilters
          ? "No products match your filters"
          : "No products available"}
      </p>
    </div>
  </div>
);

const ProductCard = ({
  data,
  isSelected,
  onSelect,
}: {
  data: ProductServiceResponse;
  isSelected: boolean;
  onSelect: (product: ProductServiceResponse) => void;
}) => (
  <Card
    className={`cursor-pointer transition-all hover:shadow-md ${
      isSelected ? "ring-2 ring-primary bg-primary/5" : ""
    }`}
    onClick={() => onSelect(data)}
  >
    <CardContent className="p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Checkbox checked={isSelected} />
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <img
              src={data.images?.[0]?.url || "/placeholder.svg"}
              alt={data.product.name}
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{data.product.name}</h4>
            {data.product.isFeatured && (
              <Badge
                variant="secondary"
                className="text-xs bg-amber-50 text-amber-700 border-amber-200"
              >
                <Star className="mr-1 h-3 w-3 fill-amber-700" />
                Featured
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>SKU: {data.product.sku}</span>
            <span>•</span>
            <span>{data.category?.[0]?.name}</span>
            <span>•</span>
            <span>Stock: {data.product.stockQuantity}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="font-semibold">${data.product.price}</div>
          {getStatusBadge(data.product.status)}
        </div>

        {isSelected && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default AddRelatedProductModal;
