'use client';
import { HomeIcon, PlaySquareIcon, FlameIcon } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useAuth, useClerk } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

const SidebarMainSection = () => {
    const { isSignedIn } = useAuth();
    const clerk = useClerk();
    const pathName = usePathname();

    const items = [
        {
            title: 'Home',
            url: '/',
            icon: HomeIcon,
        },
        {
            title: 'Subscriptions',
            url: '/feed/subscriptions',
            icon: PlaySquareIcon,
            auth: true,
        },
        {
            title: 'Trending',
            url: '/feed/trending',
            icon: FlameIcon,
        },
    ];
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={pathName === item.url}
                                onClick={(e) => {
                                    if (item.auth && !isSignedIn) {
                                        e.preventDefault();
                                        return clerk.openSignIn();
                                    }
                                }}
                            >
                                <Link
                                    prefetch
                                    href={item.url}
                                    className="flex items-center gap-4"
                                >
                                    <item.icon />
                                    <span className="text-sm">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default SidebarMainSection;
