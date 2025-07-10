"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Order } from "@/lib/order-store"
 
interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId])
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        icon: Clock,
      },
      processing: {
        className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
        icon: Package,
      },
      shipped: {
        className: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
        icon: Truck,
      },
      delivered: {
        className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        icon: CheckCircle,
      },
      cancelled: {
        className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
        icon: XCircle,
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant="outline" className={`${config.className} flex items-center gap-1.5 font-medium`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      paid: {
        className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        icon: CheckCircle,
      },
      pending: {
        className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        icon: Clock,
      },
      failed: {
        className: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
        icon: AlertCircle,
      },
      refunded: {
        className: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
        icon: RefreshCw,
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant="outline" className={`${config.className} flex items-center gap-1.5 font-medium`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No orders found</h3>
        <p className="text-muted-foreground">No orders match your current filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedOrders.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedOrders.length} order{selectedOrders.length > 1 ? "s" : ""} selected
          </span>
          <Button size="sm" variant="outline">
            Bulk Actions
          </Button>
        </div>
      )}

      <ScrollArea className="h-[600px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={selectedOrders.length === orders.length} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">#{order.orderNumber}</div>
                  <div className="text-sm text-muted-foreground">{order.id}</div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</div>
                  <div className="text-xs text-muted-foreground">
                    ${order.subtotal.toFixed(2)} + ${order.tax.toFixed(2)} tax
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">${order.total.toFixed(2)}</div>
                  {order.shipping > 0 && (
                    <div className="text-xs text-muted-foreground">+${order.shipping.toFixed(2)} shipping</div>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                <TableCell>
                  <div className="text-sm">{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</div>
                  <div className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Order
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Package className="mr-2 h-4 w-4" />
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Truck className="mr-2 h-4 w-4" />
                        Track Shipment
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
