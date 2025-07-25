'use client';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import UserAvatar from '@/components/user-avatar';
import { LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import { useAuth } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SubscriptionSection = () => {
    const pathName = usePathname();
    const {data} = trpc.subscriptions.getMany.useInfiniteQuery({
        limit: LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {data?.pages.flatMap((page) => page.items).map((item) => (
                        <SidebarMenuItem key={item.creatorId}>
                            <SidebarMenuButton
                                tooltip={item.user.name}
                                isActive={pathName === `/users/${item.creatorId}`}
                                asChild
                            >
                                <Link
                                    href={`/users/${item.creatorId}`}
                                    className="flex items-center gap-4"
                                >
                                    <UserAvatar
                                    size={'xs'}
                                        imageUrl={item.user.imageUrl}
                                        name={item.user.name}
                                    />
                                    <span className="text-sm">
                                        {item.user.name}
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

export default SubscriptionSection;
