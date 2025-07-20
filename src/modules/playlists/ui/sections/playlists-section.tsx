'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LIMIT } from '@/constant';
import PlaylistGridCard, {
    PlaylistGridCardSkeleton,
} from '../components/playlist-grid-card';

const PlaylistsSectionSuspense = () => {
    const [playlists, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
        { limit: LIMIT },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );
    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
                {playlists.pages
                    .flatMap((page) => page.items)
                    .map((playlist) => (
                        <PlaylistGridCard key={playlist.id} data={playlist} />
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

const PlaylistsSectionSkeleton = () => {
    return (
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <PlaylistGridCardSkeleton key={i} />
            ))}
        </div>
    );
};

const PlaylistsSection = () => {
    return (
        <Suspense fallback={<PlaylistsSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <PlaylistsSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};

export default PlaylistsSection;
