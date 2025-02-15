import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import SidebarMainSection from "./main-section";
export const HomeSidebar = () => {
  return (
    <Sidebar className="top-16 z-40 border-none">
      <SidebarContent className="bg-red-500">
        <SidebarMainSection />
      </SidebarContent>
    </Sidebar>
  );
};
