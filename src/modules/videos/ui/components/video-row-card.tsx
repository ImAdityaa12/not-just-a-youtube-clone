import { cva, VariantProps } from 'class-variance-authority';
import { VideoGetManyOutput } from '../../types';
import Link from 'next/link';
import { VideoThumbnail } from './video-thumbnail';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/user-avatar';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import UserInfo from '../users/ui/components/user-info';
import VideoMenu from './video-menu';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { LIMIT } from '@/constant';

const videoRowCardVariants = cva('group flex min-w-0', {
    variants: {
        size: {
            default: 'gap-4',
            compact: 'gap-2',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

const thumbnailVariants = cva('relative flex-none', {
    variants: {
        size: {
            default: 'w-[38%]',
            compact: 'w-[168px]',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
    data: VideoGetManyOutput['items'][number];
    onRemove?: () => void;
}

export const VideoRowCardSkeleton = ({
    size = 'default',
}: VariantProps<typeof videoRowCardVariants>) => {
    return (
        <>
            {Array.from({ length: LIMIT }).map((_, i) => (
                <div className={videoRowCardVariants({ size })} key={i}>
                    <div className={thumbnailVariants({ size })}>
                        <Skeleton className="aspect-video" />
                    </div>

                    <div className="flex flex-col flex-1 min-w-0 gap-y-4">
                        <div className="flex justify-between gap-x-2">
                            <Skeleton className="h-10 w-4/5 md:w-5/6" />
                        </div>

                        <div className="flex items-center gap-x-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-5 w-1/2 md:w-1/4" />
                        </div>
                        <Skeleton className="h-5 w-1/2 md:w-3/4" />
                        <Skeleton className="h-5 w-1/2 md:w-3/4" />
                        <Skeleton className="h-5 w-1/2 md:w-3/4" />
                        <Skeleton className="h-5 w-1/2 md:w-3/4" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            ))}
        </>
    );
};

export const VideoRowCard = ({
    data,
    onRemove,
    size = 'default',
}: VideoRowCardProps) => {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat('en', {
            notation: 'compact',
        }).format(data.viewCount);
    }, [data.viewCount]);

    const compactCompactLikes = useMemo(() => {
        return Intl.NumberFormat('en', {
            notation: 'compact',
        }).format(data.likeCount);
    }, [data.likeCount]);
    return (
        <div className={videoRowCardVariants({ size })}>
            <Link
                prefetch
                href={`/videos/${data.id}`}
                className={thumbnailVariants({ size })}
            >
                <VideoThumbnail
                    title={data.title}
                    thumbnailUrl={data.thumbnail_url}
                    duration={data.video_duration}
                    previewUrl={data.preview_url}
                />
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-x-2">
                    <Link
                        prefetch
                        href={`/videos/${data.id}`}
                        className="flex min-w-0 flex-col"
                    >
                        <h3
                            className={cn(
                                'font-medium line-clamp-2',
                                size === 'compact' ? 'text-sm' : 'text-base'
                            )}
                        >
                            {data.title}
                        </h3>
                        {size === 'default' && (
                            <p className="text-xs text-muted-foreground">
                                {compactViews} views • {compactCompactLikes}{' '}
                                likes
                            </p>
                        )}

                        {size === 'default' && (
                            <>
                                <div className="flex items-center gap-2 my-3">
                                    <UserAvatar
                                        size={'sm'}
                                        imageUrl={data.user.imageUrl}
                                        name={data.user.name}
                                    />
                                    <UserInfo
                                        size={'sm'}
                                        name={data.user.name}
                                    />
                                </div>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <p className="text-xs text-muted-foreground w-fit line-clamp-2 text-start">
                                            {data.description ??
                                                'No description'}
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="bottom"
                                        align="center"
                                        className="bg-black/70"
                                    >
                                        <p>From the video Description</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        )}
                        {size === 'compact' && (
                            <UserInfo size={'sm'} name={data.user.name} />
                        )}
                        {size === 'compact' && (
                            <p className="text-xs text-muted-foreground">
                                {compactViews} views • {compactCompactLikes}{' '}
                                likes
                            </p>
                        )}
                    </Link>
                    <div className="flex-none">
                        <VideoMenu videoId={data.id} onRemove={onRemove} />
                    </div>
                </div>
            </div>
        </div>
    );
};
