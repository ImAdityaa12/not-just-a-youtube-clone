import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import SidebarMainSection from "./sidebar-main-section";
import { Separator } from "@/components/ui/separator";
import SidebarPersonalSection from "./sidebar-personal-items";
export const HomeSidebar = () => {
  return (
    <Sidebar className="top-16 z-40 border-none">
      <SidebarContent className="">
        <SidebarMainSection />
        <Separator />
        <SidebarPersonalSection />
      </SidebarContent>
    </Sidebar>
  );
};
