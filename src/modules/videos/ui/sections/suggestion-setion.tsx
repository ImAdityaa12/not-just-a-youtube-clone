'use client';

import { LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { VideoRowCard } from '../components/video-row-card';
import VideoGridCard from '../components/video-grid-card';
import InfiniteScroll from '@/components/infinite-scroll';
import { Loader2Icon } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

interface SuggestionSectionProps {
    videoId: string;
    isManual?: boolean;
}
const SuggestionSection = ({ videoId, isManual }: SuggestionSectionProps) => {
    return (
        <Suspense fallback={<Loader2Icon className="animate-spin" />}>
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
