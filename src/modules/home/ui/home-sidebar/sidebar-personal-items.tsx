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

const SidebarPersonalSection = () => {
    const { isSignedIn } = useAuth();
    const clerk = useClerk();
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
                                isActive={false}
                                onClick={() => {
                                    if (item.auth && !isSignedIn) {
                                        return clerk.openSignIn();
                                    }
                                }}
                            >
                                <Link
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
