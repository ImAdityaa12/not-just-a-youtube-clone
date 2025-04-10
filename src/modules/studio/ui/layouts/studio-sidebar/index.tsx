import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import StudioNavbar from "../../studio-navbar";
import { StudioSidebar } from "../../studio-sidebar";

const StudioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex overflow-hidden">
          <StudioSidebar />
          <div className="pt-16 w-full">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudioLayout;
