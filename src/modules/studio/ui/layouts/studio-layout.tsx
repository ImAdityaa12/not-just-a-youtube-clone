import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { HomeSidebar } from "../studio-sidebar";
import HomeNavbar from "../studio-navbar/home-navbar";

const StudioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavbar />
        <div className="flex overflow-hidden">
          <HomeSidebar />
          <div className="pt-16 w-full">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudioLayout;
