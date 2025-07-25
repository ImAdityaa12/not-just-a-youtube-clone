'use client';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { useAuth } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SidebarPersonalSection = () => {
    const { isSignedIn } = useAuth();
    const clerk = useClerk();
    const pathName = usePathname();
    const items = [
        {
            title: 'History',
            url: '/playlists/history',
            icon: HistoryIcon,
            auth: true,
        },
        {
            title: 'Liked videos',
            url: '/playlists/liked',
            icon: ThumbsUpIcon,
            auth: true,
        },
        {
            title: 'All playlists',
            url: '/playlists',
            icon: ListVideoIcon,
            auth: true,
        },
    ];
    return (
        <SidebarGroup>
            <SidebarGroupLabel>You</SidebarGroupLabel>
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

export default SidebarPersonalSection;
