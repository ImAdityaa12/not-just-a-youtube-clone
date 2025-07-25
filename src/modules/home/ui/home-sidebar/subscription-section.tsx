'use client';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user-avatar';
import { LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import { ListIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const LoadingSkeleton = () => {
    return (
        <>
            {[1, 2, 3, 4, 5].map((i) => (
                <SidebarMenu key={i}>
                    <SidebarMenuButton disabled>
                        <Skeleton className="size-6 rounded-fulll shrink-0" />
                        <Skeleton className="h-4 w-full" />
                    </SidebarMenuButton>
                </SidebarMenu>
            ))}
        </>
    );
};

const SubscriptionSection = () => {
    const pathName = usePathname();
    const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
        {
            limit: LIMIT,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {isLoading && <LoadingSkeleton />}
                    {data?.pages
                        .flatMap((page) => page.items)
                        .map((item) => (
                            <SidebarMenuItem key={item.creatorId}>
                                <SidebarMenuButton
                                    tooltip={item.user.name}
                                    isActive={
                                        pathName === `/users/${item.creatorId}`
                                    }
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
                    {!isLoading && (
                        <SidebarMenuButton
                            asChild
                            isActive={pathName === '/subscriptions'}
                        >
                            <Link
                                href="/subscriptions"
                                className="flex items-center gap-4"
                            >
                                <ListIcon />
                                <span className="text-sm">
                                    All Subscriptions
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export default SubscriptionSection;
