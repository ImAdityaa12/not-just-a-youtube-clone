"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";

const SidebarPersonalSection = () => {
  const items = [
    {
      title: "History",
      url: "/playlist/history",
      icon: HistoryIcon,
      auth: true,
    },
    {
      title: "Subscriptions",
      url: "/playlist/liked",
      icon: ThumbsUpIcon,
      auth: true,
    },
    {
      title: "All playlists",
      url: "/playlists",
      icon: ListVideoIcon,
      auth: true,
    },
  ];
  return (
    <SidebarGroup>
      <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton title={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={false}
                  onClick={() => {}}
                >
                  <Link href={item.url} className="flex items-center gap-4">
                    <item.icon />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarPersonalSection;
