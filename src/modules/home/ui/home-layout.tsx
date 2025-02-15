import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import HomeNavbar from "./home-navbar/home-navbar";
import { HomeSidebar } from "./home-sidebar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavbar />
        <div className="flex pt-16">
          <HomeSidebar />
          <div>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HomeLayout;
