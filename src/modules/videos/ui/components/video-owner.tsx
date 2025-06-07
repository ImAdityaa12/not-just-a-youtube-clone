import React from 'react';
import { VideoGetOneOutput } from '../../types';
import Link from 'next/link';
import UserAvatar from '@/components/user-avatar';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import SubscriptionButton from '../subscriptions/ui/components/subscription-button';
import UserInfo from '../users/ui/components/user-info';

interface VideoOwnerProps {
    user: VideoGetOneOutput['user'];
    videoId: string;
}

const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
    const { userId: clerkUserId } = useAuth();
    return (
        <div className="flex items-center  justify-between sm:justify-start gap-3 min-w-0">
            <Link href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar
                        size={'lg'}
                        imageUrl={user.imageUrl}
                        name={user.name}
                    />
                    <div className="flex flex-col min-w-0">
                        <UserInfo name={user.name} size={'lg'} />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {/* TODO: Add Subscribers Count Properly*/}
                            {0} Subscribers
                        </span>
                    </div>
                </div>
            </Link>
            {user.clerkId === clerkUserId ? (
                <Button variant={'secondary'}>
                    <Link href={`/studio/videos/${videoId}`}>Edit Video</Link>
                </Button>
            ) : (
                <SubscriptionButton
                    disabled={false}
                    isSubscribed={false}
                    size={'sm'}
                    onClick={() => {}}
                />
            )}
        </div>
    );
};

export default VideoOwner;
