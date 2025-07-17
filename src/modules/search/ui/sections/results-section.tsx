'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { LIMIT } from '@/constant';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoGridCard from '@/modules/videos/ui/components/video-grid-card';
import {
    VideoRowCard,
    VideoRowCardSkeleton,
} from '@/modules/videos/ui/components/video-row-card';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ResultsViewProps {
    query: string | undefined;
    categoryId: string | undefined;
}

export const ResultsSection = ({ query, categoryId }: ResultsViewProps) => {
    return (
        <Suspense fallback={<VideoRowCardSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <ResultsSectionSuspense query={query} categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    );
};

const ResultsSectionSuspense = ({ query, categoryId }: ResultsViewProps) => {
    const isMobile = useIsMobile();

    const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
        { query, categoryId, limit: LIMIT },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

    return (
        <>
            {isMobile ? (
                <div className="flex flex-col gap-4">
                    {results.pages
                        .flatMap((page) => page.items)
                        .map((video) => (
                            <VideoGridCard data={video} key={video.id} />
                        ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {results.pages
                        .flatMap((page) => page.items)
                        .map((video) => (
                            <VideoRowCard data={video} key={video.id} />
                        ))}
                </div>
            )}
            <InfiniteScroll
                hasNextPage={resultQuery.hasNextPage}
                fetchNextPage={resultQuery.fetchNextPage}
                isFetchingNextPage={resultQuery.isFetchingNextPage}
            />
        </>
    );
};

export default ResultsSection;
