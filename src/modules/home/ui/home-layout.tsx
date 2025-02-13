import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import HomeNavbar from "./home-navbar/home-navbar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="w-full pt-16">
        <HomeNavbar />
        <div>{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default HomeLayout;
