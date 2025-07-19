'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import VideoGridCard from '@/modules/videos/ui/components/video-grid-card';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LIMIT } from '@/constant';

const SubscriptionsVideosSectionSuspense = () => {
    const [videos, query] =
        trpc.subscriptions.getManySubscribed.useSuspenseInfiniteQuery(
            { limit: LIMIT },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        );
    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
                {videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <VideoGridCard data={video} key={video.id} />
                    ))}
            </div>
            <InfiniteScroll
                fetchNextPage={query.fetchNextPage}
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
            />
        </div>
    );
};

const SubscriptionsVideosSectionSkeleton = () => {
    return (
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 w-full">
                    <Skeleton className="aspect-video w-full rounded-xl" />
                    <div className="flex gap-3">
                        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-4/5" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="w-6 h-6 rounded shrink-0" />
                    </div>
                </div>
            ))}
        </div>
    );
};

const SubscriptionsVideosSection = () => {
    return (
        <Suspense fallback={<SubscriptionsVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <SubscriptionsVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};

export default SubscriptionsVideosSection;
