import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import HomeNavbar from "../home-navbar/home-navbar";
import { HomeSidebar } from "../home-sidebar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
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

export default HomeLayout;
