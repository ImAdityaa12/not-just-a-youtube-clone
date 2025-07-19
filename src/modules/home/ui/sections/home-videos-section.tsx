'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import VideoGridCard from '@/modules/videos/ui/components/video-grid-card';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface HomeVideosSectionProps {
    categoryId?: string;
}

const HomeVideosSectionSuspense = ({ categoryId }: HomeVideosSectionProps) => {
    const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
        { categoryId, limit: 10 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
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

const HomeVideosSectionSkeleton = () => {
    return <div>HomeVideosSectionSkeleton</div>;
};

const HomeVideosSection = ({ categoryId }: HomeVideosSectionProps) => {
    return (
        <Suspense fallback={<HomeVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <HomeVideosSectionSuspense categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export default HomeVideosSection;
