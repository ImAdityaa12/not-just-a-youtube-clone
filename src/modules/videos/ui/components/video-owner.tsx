import React from 'react';
import { VideoGetOneOutput } from '../../types';
import Link from 'next/link';
import UserAvatar from '@/components/user-avatar';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import UserInfo from '../users/ui/components/user-info';
import SubscriptionButton from '@/modules/subscriptions/ui/components/subscription-button';
import { useSubscription } from '@/hooks/use-subscription';

interface VideoOwnerProps {
    user: VideoGetOneOutput['user'];
    videoId: string;
}

const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
    const { userId: clerkUserId, isLoaded } = useAuth();
    const { isPending, onClick } = useSubscription({
        isSubscribed: user.viewerSubscribed,
        userId: user.id,
        fromVideoId: videoId,
    });
    return (
        <div className="flex items-center  justify-between sm:justify-start gap-3 min-w-0">
            <Link prefetch href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar
                        size={'lg'}
                        imageUrl={user.imageUrl}
                        name={user.name}
                    />
                    <div className="flex flex-col min-w-0">
                        <UserInfo name={user.name} size={'lg'} />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {user.subsciberCount} Subscribers
                        </span>
                    </div>
                </div>
            </Link>
            {user.clerkId === clerkUserId ? (
                <Button variant={'secondary'}>
                    <Link prefetch href={`/studio/videos/${videoId}`}>
                        Edit Video
                    </Link>
                </Button>
            ) : (
                <SubscriptionButton
                    disabled={isPending || !isLoaded}
                    isSubscribed={user.viewerSubscribed}
                    size={'sm'}
                    onClick={onClick}
                />
            )}
        </div>
    );
};

export default VideoOwner;
