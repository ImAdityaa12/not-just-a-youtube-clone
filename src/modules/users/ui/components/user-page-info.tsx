import React from 'react';
import { UserGetOneOutput } from '../../types';
import UserAvatar from '@/components/user-avatar';
import { useAuth, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SubscriptionButton from '@/modules/subscriptions/ui/components/subscription-button';
import { useSubscription } from '@/hooks/use-subscription';
import { cn } from '@/lib/utils';

interface UserPageInfoProps {
    user: UserGetOneOutput;
}

const UserPageInfo = ({ user }: UserPageInfoProps) => {
    const { userId } = useAuth();
    const clerk = useClerk();
    const { isPending, onClick } = useSubscription({
        isSubscribed: user.viewerSubscribed,
        userId: user.id,
    });
    return (
        <div className="py-8">
            <div className="flex flex-col md:hidden">
                <div className="flex items-center gap-3">
                    <UserAvatar
                        name={user.name}
                        size="lg"
                        imageUrl={user.imageUrl}
                        className="h-[60px] w-[60px]"
                        onClick={() => {
                            if (user.clerkId === userId) {
                                clerk.openUserProfile();
                            }
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold">{user.name}</h1>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <span>{user.subscriberCount} subscribers</span>
                            <span>&bull;</span>
                            <span>{user.videoCount} videos</span>
                        </div>
                    </div>
                </div>
                {userId === user.clerkId ? (
                    <Button
                        variant={'secondary'}
                        asChild
                        className="w-full mt-3 rounded-full"
                    >
                        <Link prefetch href="/studio">
                            Go to studio
                        </Link>
                    </Button>
                ) : (
                    <SubscriptionButton
                        disabled={isPending}
                        onClick={onClick}
                        isSubscribed={user.viewerSubscribed}
                        className="w-full mt-3"
                    />
                )}
            </div>
            <div className="hidden md:flex items-start gap-4">
                <UserAvatar
                    name={user.name}
                    size="xl"
                    imageUrl={user.imageUrl}
                    className={cn(
                        userId === user.clerkId &&
                            'cursor-pointer hover:opacity-80 transition-opacity'
                    )}
                    onClick={() => {
                        if (user.clerkId === userId) {
                            clerk.openUserProfile();
                        }
                    }}
                />
                <div className="flex-1 min-w-0">
                    <h1 className="text-4xl font-bold">{user.name}</h1>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
                        <span>{user.subscriberCount} subscribers</span>
                        <span>&bull;</span>
                        <span>{user.videoCount} videos</span>
                    </div>
                    {userId === user.clerkId ? (
                        <Button
                            variant={'secondary'}
                            asChild
                            className="mt-3 rounded-full"
                        >
                            <Link prefetch href="/studio">
                                Go to studio
                            </Link>
                        </Button>
                    ) : (
                        <SubscriptionButton
                            disabled={isPending}
                            onClick={onClick}
                            isSubscribed={user.viewerSubscribed}
                            className="mt-3"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPageInfo;
