import { Skeleton } from '@/components/ui/skeleton';
import { FALLBACK_THUMBNAIL } from '@/constant';
import { cn } from '@/lib/utils';
import { ListVideoIcon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo } from 'react';

interface PlaylistThumbnailProps {
    title: string;
    videoCount: number;
    imageUrl?: string | null;
    className?: string;
}

export const PlaylistThumbnailSkeleton = () => {
    return (
        <div className="relative w-full overflow-hidden rounded-xl  aspect-video">
            <Skeleton className="size-full" />
        </div>
    );
};
const PlaylistThumbnail = ({
    imageUrl,
    title,
    videoCount,
    className,
}: PlaylistThumbnailProps) => {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat('en', {
            notation: 'compact',
        }).format(videoCount);
    }, [videoCount]);
    return (
        <div className={cn('relative pt-3', className)}>
            <div className="relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] overflow-hidden rounded-xl bg-black/20 aspect-video" />
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] overflow-hidden rounded-xl bg-black/25 aspect-video" />
                <div className="relative overflow-hidden w-full rounded-xl aspect-video">
                    <Image
                        src={imageUrl ?? FALLBACK_THUMBNAIL}
                        alt={title}
                        className="w-full h-full object-cover"
                        fill
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex items-center gap-x-2">
                            <PlayIcon className="size-4 text-white fill-white" />
                            <span className="text-white font-medium">
                                Play All
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-x-1">
                <ListVideoIcon className="size-4" />
                {compactViews} videos
            </div>
        </div>
    );
};

export default PlaylistThumbnail;
