'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LIMIT } from '@/constant';
import { snakeCaseTotitle } from '@/lib/utils';
import { VideoThumbnail } from '@/modules/videos/ui/components/video-thumbnail';
import { trpc } from '@/trpc/client';
import { format } from 'date-fns';
import { Globe2Icon, LockIcon } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const videosSectionSkeletion = () => {
    return (
        <div className="border-y">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-6 w-[510px]">Video</TableHead>
                        <TableHead>Visiblity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                        <TableHead className="text-right">Comments</TableHead>
                        <TableHead className="text-right pr-6">Likes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell className="pl-6">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-20 w-36" />
                                        <div className="flex flex-col gap-2">
                                            <Skeleton className="h-4 w-[100px]" />
                                            <Skeleton className="h-3 w-[150px]" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-[100px]" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-[100px]" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-24" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-16" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <Skeleton className="h-4 w-[50px]" />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

const VideosSection = () => {
    return (
        <Suspense fallback={videosSectionSkeletion()}>
            <ErrorBoundary fallback={<div>Error</div>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};

const VideosSectionSuspense = () => {
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
        {
            limit: LIMIT,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">
                                Video
                            </TableHead>
                            <TableHead>Visiblity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">
                                Comments
                            </TableHead>
                            <TableHead className="text-right pr-6">
                                Likes
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.pages
                            .flatMap((page) => page.items)
                            .map((video) => (
                                <Link
                                    prefetch
                                    href={`/studio/videos/${video.id}`}
                                    key={video.id}
                                    legacyBehavior
                                >
                                    <TableRow className="cursor-pointer">
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative aspect-video w-36 shrink-0">
                                                    <VideoThumbnail
                                                        thumbnailUrl={
                                                            video.thumbnail_url ??
                                                            null
                                                        }
                                                        previewUrl={
                                                            video.preview_url
                                                        }
                                                        duration={
                                                            video.video_duration
                                                        }
                                                    />
                                                </div>
                                                <div className="flex flex-col overflow-hidden gap-y-1">
                                                    <div className="text-sm line-clamp-1">
                                                        {video.title}
                                                    </div>
                                                    <div className="text-sm line-clamp-1">
                                                        {video.description ??
                                                            'No description'}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                {video.video_visibility ===
                                                'private' ? (
                                                    <LockIcon className="size-4 mr-2" />
                                                ) : (
                                                    <Globe2Icon className="size-4 mr-2" />
                                                )}
                                                {snakeCaseTotitle(
                                                    video.video_visibility
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {' '}
                                            {snakeCaseTotitle(
                                                video.mux_status ?? ''
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm truncate">
                                            {format(
                                                new Date(video.createdAt),
                                                'd MMM yyyy'
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            {video.viewCount}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            {video.commentCount}
                                        </TableCell>
                                        <TableCell className="text-right text-sm pr-6">
                                            {video.likesCount}
                                        </TableCell>
                                    </TableRow>
                                </Link>
                            ))}
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </div>
    );
};

export default VideosSection;
