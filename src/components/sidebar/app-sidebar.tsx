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
import { useNotificationsStore } from "@/lib/notification-store";

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
  const { unreadCount } = useNotificationsStore();

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
                const showBadge =
                  item.link.title === "Notifications" && unreadCount > 0;

                return (
                  <SidebarMenuItem key={item.link.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.link.title}
                    >
                      <Link
                        to={item.link.to}
                        className="flex items-center gap-2"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.link.title}</span>
                        {showBadge && (
                          <Badge
                            variant="destructive"
                            className="ml-auto flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                          >
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </Badge>
                        )}
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
