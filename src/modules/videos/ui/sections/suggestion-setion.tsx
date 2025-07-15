'use client';

import { LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { VideoRowCard } from '../components/video-row-card';
import VideoGridCard from '../components/video-grid-card';
import InfiniteScroll from '@/components/infinite-scroll';
import { ErrorBoundary } from 'react-error-boundary';

interface SuggestionSectionProps {
    videoId: string;
    isManual?: boolean;
}

const SuggestionSectionSkeleton = () => {
    return (
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex gap-x-2">
                    <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-md bg-muted-foreground/30 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-[200px] rounded-md bg-muted-foreground/30 animate-pulse" />
                        <div className="h-4 w-[100px] rounded-md bg-muted-foreground/30 animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
};

const SuggestionSection = ({ videoId, isManual }: SuggestionSectionProps) => {
    return (
        <Suspense fallback={<SuggestionSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <SuggestionSectionSuspense
                    videoId={videoId}
                    isManual={isManual}
                />
            </ErrorBoundary>
        </Suspense>
    );
};
const SuggestionSectionSuspense = ({
    videoId,
    isManual,
}: SuggestionSectionProps) => {
    const [suggestions, query] =
        trpc.suggestions.getMany.useSuspenseInfiniteQuery(
            {
                videoId,
                limit: LIMIT,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        );

    return (
        <>
            <div className="hidden md:block space-y-3">
                {suggestions.pages
                    .flatMap((page) => page.items)
                    .map((suggestion) => (
                        <VideoRowCard
                            data={suggestion}
                            onRemove={() => {}}
                            size={'compact'}
                            key={suggestion.id}
                        />
                    ))}
            </div>
            <div className="block md:hidden space-y-10">
                {suggestions.pages
                    .flatMap((page) => page.items)
                    .map((suggestion) => (
                        <VideoGridCard data={suggestion} key={suggestion.id} />
                    ))}
            </div>
            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
                isManual={isManual}
            />
        </>
    );
};

export default SuggestionSection;
