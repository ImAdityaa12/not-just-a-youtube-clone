'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LIMIT } from '@/constant';
import PlaylistGridCard from '../components/playlist-grid-card';

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
        <div>
            {/* Mobile skeleton - matches flex-col with grid card style */}
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {Array.from({ length: 10 }).map((_, i) => (
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

            {/* Desktop skeleton - matches flex-col with row card style */}
            <div className="hidden flex-col gap-4 gap-y-10 md:flex">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="group flex min-w-0 gap-2">
                        <div className="relative flex-none w-[168px]">
                            <Skeleton className="aspect-video w-full rounded-xl" />
                        </div>

                        <div className="flex flex-col flex-1 min-w-0 gap-y-1">
                            <div className="flex justify-between gap-x-2">
                                <div className="flex min-w-[400px] flex-col gap-y-2">
                                    <Skeleton className="h-4 w-4/5" />{' '}
                                    <Skeleton className="h-3 w-1/4" />{' '}
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-6 w-6 rounded-full" />{' '}
                                        <Skeleton className="h-3 w-1/3" />{' '}
                                    </div>
                                    <Skeleton className="h-3 w-2/3" />{' '}
                                </div>
                                <Skeleton className="h-6 w-6 rounded-full flex-none" />{' '}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
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
