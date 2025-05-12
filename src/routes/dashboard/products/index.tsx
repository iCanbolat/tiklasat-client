import * as React from "react";
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
  DropdownMenuLabel,
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
import { ChevronDown, SearchIcon, X } from "lucide-react";
import {
  getProductsQueryOptions,
  useGetProducts,
} from "./-api/use-get-products";
import { productStatusOptions } from "./-types";

export const Route = createFileRoute("/dashboard/products/")({
  component: ProductPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getProductsQueryOptions({ page: 1, pageSize: 10 })
    );
  },
});

function ProductPage() {
  const { data, isPending, error } = useGetProducts({ page: 1, pageSize: 10 });

  console.log("prods", data?.data);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;
  if (!data) return <div>No data available</div>;

  const categoryMap = new Map<
    string,
    { id: string; name: string; slug: string }
  >();

  data.data.forEach((product) => {
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

  const uniqueCategories = Array.from(categoryMap.values());

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-64">
            <Input
              placeholder="Filter products..."
              left={<SearchIcon />}
              value={
                (table.getColumn("productName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) => {
                table
                  .getColumn("productName")
                  ?.setFilterValue(event.target.value);
              }}
              className="pr-8 bg-white"
            />

            {(
              (table.getColumn("productName")?.getFilterValue() as string) ?? ""
            ).length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full p-0"
                onClick={() =>
                  table.getColumn("productName")?.setFilterValue("")
                }
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
                <SelectItem key={category?.id} value={category?.name || ""}>
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
                <DropdownMenuItem className="text-destructive">
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <Card>
        <div className="rounded-md border">
          <div className="xl:h-[70vh] overflow-hidden">
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
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 p-4">
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
