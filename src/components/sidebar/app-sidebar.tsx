import {
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

// Menu items.
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
      to: "/",
      title: "Settings",
    }),
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader className="flex items-center justify-between px-4 py-4">
          <Home className="h-6 w-6" />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.link.title}>
                  <SidebarMenuButton asChild>
                    <Link key={item.link.to} to={item.link.to}>
                      <item.icon />
                      <span>{item.link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
