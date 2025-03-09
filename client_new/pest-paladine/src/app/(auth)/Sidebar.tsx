"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Scan, Camera, Users } from "lucide-react"; // Icons similar to your reference image

const sidebarLinks = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutGrid },
  { title: "My Detections", url: "/detections", icon: Scan },
  { title: "Live Feed", url: "/live-feed", icon: Camera },
  { title: "Our Team", url: "/our-team", icon: Users}
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="h-screen border-r bg-white w-64">
      {/* Sidebar Header */}
      <SidebarHeader className="px-6 py-8">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Pest Paladine Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            Pest Paladin
          </span>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-2">
              {sidebarLinks.map(({ title, url, icon: Icon }) => {
                const isActive = pathname.startsWith(url);

                return (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton asChild className="[&>svg]:size-6">
                      <Link
                        href={url}
                        className={`flex items-center gap-5 px-4 py-7 rounded-xl transition 
                        text-xl font-normal tracking-wide
                        ${
                          isActive
                            ? "bg-green-100 text-green-700 shadow-xl hover:bg-green-100 hover:text-green-700"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        }
                        `}
                      >
                        <Icon className="h-10 w-10" />
                        <span>{title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
