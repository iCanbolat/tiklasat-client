"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useOrdersStore } from "@/lib/order-store";

export function OrdersStats() {
  const { orders } = useOrdersStore();

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  ).length;

  const completionRate =
    totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;
  const cancellationRate =
    totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      description: `${pendingOrders} pending`,
      icon: Package,
      trend: "up",
      trendValue: "+12%",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      description: `$${averageOrderValue.toFixed(2)} avg order`,
      icon: DollarSign,
      trend: "up",
      trendValue: "+8%",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      description: `${deliveredOrders} delivered`,
      icon: CheckCircle,
      trend: completionRate >= 80 ? "up" : "down",
      trendValue: completionRate >= 80 ? "+5%" : "-2%",
    },
    {
      title: "Cancellation Rate",
      value: `${cancellationRate}%`,
      description: `${cancelledOrders} cancelled`,
      icon: XCircle,
      trend: cancellationRate <= 10 ? "up" : "down",
      trendValue: cancellationRate <= 10 ? "-3%" : "+1%",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
        const trendColor =
          stat.trend === "up" ? "text-green-600" : "text-red-600";

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Badge
                  variant="outline"
                  className={`${trendColor} border-current`}
                >
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {stat.trendValue}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
