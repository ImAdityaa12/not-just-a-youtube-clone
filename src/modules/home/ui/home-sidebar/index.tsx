import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import SidebarMainSection from './sidebar-main-section';
import { Separator } from '@/components/ui/separator';
import SidebarPersonalSection from './sidebar-personal-items';
import SubscriptionSection from './subscription-section';
import { SignedIn } from '@clerk/nextjs';
export const HomeSidebar = () => {
    return (
        <Sidebar className="top-16 z-40 border-none" collapsible="icon">
            <SidebarContent>
                <SidebarMainSection />
                <Separator />
                <SidebarPersonalSection />
                <SignedIn>
                    <>
                        <Separator />
                        <SubscriptionSection />
                    </>
                </SignedIn>
            </SidebarContent>
        </Sidebar>
    );
};
