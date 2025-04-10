import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { HomeSidebar } from "../studio-sidebar";
import StudioNavbar from "../studio-navbar";

const StudioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex overflow-hidden">
          <HomeSidebar />
          <div className="pt-16 w-full">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudioLayout;
