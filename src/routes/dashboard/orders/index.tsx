import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Plus, X, LoaderCircle } from "lucide-react";
import { useGetOrders } from "./-api/use-get-orders";
import { OrdersStats } from "./-components/order-stats";
import { OrdersFilters } from "./-components/order-filters";
import { OrdersTable } from "./-components/order-table";
import { useDebounce } from "@/hooks/use-debounce";

export const Route = createFileRoute("/dashboard/orders/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isPending, error } = useGetOrders({
    page,
    pageSize,
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
    search: debouncedSearchTerm.length >= 2 ? debouncedSearchTerm : undefined,
  });

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">
            Error loading orders
          </h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  const orders = data?.data || [];
  const orderCountsByStatus = data?.orderCountsByStatus || {};

  const statusCounts = {
    all: orders.length,
    PENDING: orderCountsByStatus.PENDING || 0,
    PROCESSING: orderCountsByStatus.PROCESSING || 0,
    SHIPPED: orderCountsByStatus.SHIPPED || 0,
    DELIVERED: orderCountsByStatus.DELIVERED || 0,
    CANCELLED: orderCountsByStatus.CANCELLED || 0,
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>
      <OrdersStats
        analytics={data?.analytics}
        orderCounts={orderCountsByStatus}
      />{" "}
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage all customer orders with advanced filtering options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
              <div className="relative flex-1">
                <Input
                  placeholder="Search orders by ID, customer, or product..."
                  left={<Search className="h-4 w-4" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white"
                />
                {searchTerm.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full p-0"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Status ({statusCounts.all})
                  </SelectItem>
                  <SelectItem value="PENDING">
                    Pending ({statusCounts.PENDING})
                  </SelectItem>
                  <SelectItem value="PROCESSING">
                    Processing ({statusCounts.PROCESSING})
                  </SelectItem>
                  <SelectItem value="SHIPPED">
                    Shipped ({statusCounts.SHIPPED})
                  </SelectItem>
                  <SelectItem value="DELIVERED">
                    Delivered ({statusCounts.DELIVERED})
                  </SelectItem>
                  <SelectItem value="CANCELLED">
                    Cancelled ({statusCounts.CANCELLED})
                  </SelectItem>
                </SelectContent>
              </Select>

              <OrdersFilters />
            </div>
          </div>

          {isPending ? (
            <div className="flex items-center justify-center py-12">
              <LoaderCircle className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <OrdersTable
              orders={orders}
              statusFilter={statusFilter}
              pagination={data?.pagination}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
