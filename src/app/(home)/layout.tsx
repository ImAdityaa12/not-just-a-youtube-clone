import HomeLayout from "@/modules/home/ui/home-layout";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <HomeLayout>{children}</HomeLayout>;
};

export default Layout;
