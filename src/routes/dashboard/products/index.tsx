import * as React from "react";
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { columns } from "./-components/columns";
import {
  ChevronDown,
  LoaderCircle,
  PlusCircleIcon,
  SearchIcon,
  X,
} from "lucide-react";
import {
  getProductsQueryOptions,
  useGetProducts,
} from "./-api/use-get-products";
import { productStatusOptions } from "./-types/index";
import { useLayoutStore } from "@/lib/layout-store";
import ProductCreateModal from "./-components/product-create-modal";
import { useDeleteProduct } from "./-api/use-delete-product";
import { useDebounce } from "@/hooks/use-debounce";

export const Route = createFileRoute("/dashboard/products/")({
  component: ProductPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getProductsQueryOptions({ page: 1, pageSize: 10 })
    );
  },
});

function ProductPage() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchQuery, setSearchQuery] = React.useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isPending, error } = useGetProducts({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    status:
      columnFilters.find((filter) => filter.id === "status")?.value ||
      undefined,
    categorySlug: columnFilters.find((filter) => filter.id === "category")
      ?.value as any,
    search: debouncedSearchQuery.length >= 2 ? debouncedSearchQuery : undefined,
  });

  const { mutateAsync: deleteProducts } = useDeleteProduct();

  const { openCreateModal } = useLayoutStore();

  console.log("prods", data?.data);

  const table = useReactTable({
    data: data?.data || [],
    columns,
    rowCount: data?.pagination.totalRecords,
    manualPagination: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  React.useEffect(() => {
    if (debouncedSearchQuery.length >= 2) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [debouncedSearchQuery]);

  if (error) return <div>Error loading products</div>;
  if (!data) return <div>No data available</div>;

  const getSelectedProductIds = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    return selectedRows.map((row) => row.original.product.id);
  };

  const uniqueCategories = React.useMemo(() => {
    const categoryMap = new Map<
      string,
      { id: string; name: string; slug: string }
    >();

    data?.data?.forEach((product) => {
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

  const handleDeleteProducts = async (productId?: string) => {
    const selectedIds = productId ? [productId] : getSelectedProductIds();
    if (selectedIds.length === 0) return;

    try {
      await deleteProducts(selectedIds);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleBulkStatusUpdate = async (status: ProductStatusType) => {
  //   const selectedIds = getSelectedProductIds();
  //   if (selectedIds.length === 0) return;

  //   try {
  //   } catch (error) {
  //     console.error("Error updating products:", error);

  //     // Show error message
  //     // toast({
  //     //   title: "Error",
  //     //   description: "Failed to update products. Please try again.",
  //     //   variant: "destructive",
  //     // });
  //   }
  // };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/*  TABLE FILTERS  */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-64">
            <Input
              placeholder="Filter products..."
              left={<SearchIcon />}
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              className="pr-8 bg-white"
            />

            {searchQuery.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full p-0"
                onClick={() => setSearchQuery("")}
                aria-label="Clear filter"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Select
            value={
              table.getColumn("category")?.getFilterValue()
                ? (table.getColumn("category")?.getFilterValue() as string[])[0]
                : "all"
            }
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("category")?.setFilterValue(undefined);
              } else {
                table.getColumn("category")?.setFilterValue([value]);
              }
            }}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category?.id} value={category?.slug || ""}>
                  {category?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              table.getColumn("status")?.getFilterValue()
                ? (table.getColumn("status")?.getFilterValue() as string[])[0]
                : "all"
            }
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("status")?.setFilterValue(undefined);
              } else {
                console.log("value", columnFilters);

                table.getColumn("status")?.setFilterValue([value]);
              }
            }}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filter by Status" />
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

        {/*  END OF TABLE FILTERS  */}

        <div className="flex items-center gap-2">
          {Object.keys(rowSelection).length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mark as Active</DropdownMenuItem>
                <DropdownMenuItem>Mark as Out of Stock</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDeleteProducts()}
                  className="text-destructive"
                >
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button size={"sm"} onClick={openCreateModal}>
            <PlusCircleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Create Product</span>
          </Button>
          <ProductCreateModal />
        </div>
      </div>

      <Card>
        <div className="rounded-md border">
          <div className="xl:min-h-[70vh] overflow-auto ">
            {isPending && (
              <div className="flex items-center justify-center xl:h-[70vh]">
                <LoaderCircle className="w-10 h-10 animate-spin" />
              </div>
            )}
            {!isPending && (
              <Table>
                <TableHeader className="sticky top-0 bg-gray-100 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="overflow-y-auto">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 p-4">
          <Select
            defaultValue={pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
