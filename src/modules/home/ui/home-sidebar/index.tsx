import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import SidebarMainSection from "./sidebar-main-section";
export const HomeSidebar = () => {
  return (
    <Sidebar className="top-16 z-40 border-none">
      <SidebarContent className="">
        <SidebarMainSection />
      </SidebarContent>
    </Sidebar>
  );
};
