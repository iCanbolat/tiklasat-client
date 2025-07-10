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
import { Search, Download, Plus } from "lucide-react";
import { useOrdersStore } from "@/lib/order-store";
import { OrdersStats } from "./-components/order-stats";
import { OrdersFilters } from "./-components/order-filters";
import { OrdersTable } from "./-components/order-table";

export const Route = createFileRoute("/dashboard/orders/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    orders,
    filteredOrders,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
  } = useOrdersStore();

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
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

      <OrdersStats />

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage all customer orders with advanced filtering options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by ID, customer, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Status ({statusCounts.all})
                </SelectItem>
                <SelectItem value="pending">
                  Pending ({statusCounts.pending})
                </SelectItem>
                <SelectItem value="processing">
                  Processing ({statusCounts.processing})
                </SelectItem>
                <SelectItem value="shipped">
                  Shipped ({statusCounts.shipped})
                </SelectItem>
                <SelectItem value="delivered">
                  Delivered ({statusCounts.delivered})
                </SelectItem>
                <SelectItem value="cancelled">
                  Cancelled ({statusCounts.cancelled})
                </SelectItem>
              </SelectContent>
            </Select>
            <OrdersFilters />
          </div>
          <OrdersTable orders={filteredOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
