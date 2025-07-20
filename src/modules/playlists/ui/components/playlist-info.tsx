import React from 'react';
import { PlaylistsGetManyOutput } from '../../types';
import { Skeleton } from '@/components/ui/skeleton';

interface PlaylistInfoProps {
    data: PlaylistsGetManyOutput['items'][number];
}

export const PlaylistInfoSkeleton = () => {
    return (
        <div className="flex gap-3">
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="max-w-[280px] h-6 rounded shrink-0" />
                <Skeleton className="max-w-[280px] h-6 rounded shrink-0" />
            </div>
        </div>
    );
};
const PlaylistInfo = ({ data }: PlaylistInfoProps) => {
    return (
        <div className="flex gap-3">
            <div className="min-w-0 flex-1">
                <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-sm break-words">
                    {data.name}
                </h3>
                <p className="text-sm text-muted-foreground">Playlist</p>
                <p className="text-sm text-muted-foreground font-semibold hover:text-primary">
                    View Full Playlist
                </p>
            </div>
        </div>
    );
};

export default PlaylistInfo;
