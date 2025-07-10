import {
  Bell,
  FolderTree,
  Home,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Link, linkOptions } from "@tanstack/react-router";
import { Badge } from "../ui/badge";
import { useLocation } from "@tanstack/react-router";
import { useInfiniteNotifications } from "@/routes/dashboard/notifications/-api/use-get-notifications";

const items = [
  {
    link: linkOptions({
      to: "/dashboard",
      title: "Dashboard",
    }),
    icon: LayoutDashboard,
  },
  {
    link: linkOptions({
      to: "/dashboard/categories",
      title: "Categories",
    }),
    icon: FolderTree,
  },
  {
    link: linkOptions({
      to: "/dashboard/products",
      title: "Products",
    }),
    icon: ShoppingBag,
  },
  {
    link: linkOptions({
      to: "/dashboard/orders",
      title: "Orders",
    }),
    icon: ShoppingCart,
  },
  {
    link: linkOptions({
      to: "/dashboard/notifications",
      title: "Notifications",
    }),
    icon: Bell,
  },
  // {
  //   link: linkOptions({
  //     to: "/",
  //     title: "Settings",
  //   }),
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  const pathname = useLocation({ select: (loc) => loc.pathname });
  const { data } = useInfiniteNotifications({
    pageSize: 10,
    isRead: false,
  });

  const notifications = data?.pages[0].data ?? [];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader className="flex items-center justify-between px-4 py-4">
          <Home className="h-6 w-6" />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname === item.link.to ||
                  (item.link.to !== "/dashboard" &&
                    pathname?.startsWith(item.link.to));

                const isNotifications = item.link.title === "Notifications";

                return (
                  <SidebarMenuItem key={item.link.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.link.title}
                      className="h-9"
                    >
                      <Link
                        to={item.link.to}
                        className="flex items-center gap-2 relative"
                      >
                        <div className="relative">
                          <item.icon className="h-5 w-5" />
                          {isNotifications && notifications.length > 0 && (
                            <Badge
                              variant="destructive"
                              className="absolute -right-2 -top-2 flex h-[18px] w-[18px] items-center justify-center rounded-full p-0 text-[10.5px] font-bold min-w-4"
                            >
                              {notifications.length > 9
                                ? "9+"
                                : notifications.length}
                            </Badge>
                          )}
                        </div>
                        <span>{item.link.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
