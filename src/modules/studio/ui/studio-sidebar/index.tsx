"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { LogOutIcon, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import StudioSidebarHeader from "./studio-sidebar-header";
import { Separator } from "@/components/ui/separator";
export const StudioSidebar = () => {
  const pathName = usePathname();
  const {open}= useSidebar();

  return (
    <Sidebar className="top-16 z-40" collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader />
            <SidebarMenuItem>
                <SidebarMenuButton isActive={pathName==="/studio"} tooltip={"Exit Studio"}>
                  <Link href={"/studios/videos"} className="flex items-center">
                  <VideoIcon className="mr-2 size-5"/>
                    <span className="text-sm">
                      Content
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Separator />
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={"Exit Studio"}>
                  <Link href={"/"} className="flex items-center">
                  <LogOutIcon className="mr-2 size-5"/>
                  {
                    open && 
                      <span className="text-sm whitespace-nowrap">
                        Exit Studio
                      </span>
                  }
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
