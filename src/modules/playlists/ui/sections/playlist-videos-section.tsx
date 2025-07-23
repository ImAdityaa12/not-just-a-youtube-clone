'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import VideoGridCard from '@/modules/videos/ui/components/video-grid-card';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LIMIT } from '@/constant';
import { VideoRowCard } from '@/modules/videos/ui/components/video-row-card';

interface PlaylistVideosSectionProps {
    playlistId: string;
}

const PlaylistVideosSectionSuspense = ({
    playlistId,
}: PlaylistVideosSectionProps) => {
    const [videos, query] =
        trpc.playlists.getPlaylistVideos.useSuspenseInfiniteQuery(
            { limit: LIMIT, playlistId },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        );
    console.log(videos);
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <VideoGridCard data={video} key={video.id} />
                    ))}
            </div>
            <div className="hidden flex-col gap-4  md:flex">
                {videos.pages
                    .flatMap((page) => page.items)
                    .map((video) => (
                        <VideoRowCard
                            data={video}
                            key={video.id}
                            size={'compact'}
                        />
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

const PlaylistVideosSectionSkeleton = () => {
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

const PlaylistVideosSection = ({ playlistId }: PlaylistVideosSectionProps) => {
    return (
        <Suspense fallback={<PlaylistVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <PlaylistVideosSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export default PlaylistVideosSection;
