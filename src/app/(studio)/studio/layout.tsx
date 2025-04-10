import StudioLayout from "@/modules/studio/ui/layouts/studio-layout";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <StudioLayout>{children}</StudioLayout>;
};

export default Layout;
