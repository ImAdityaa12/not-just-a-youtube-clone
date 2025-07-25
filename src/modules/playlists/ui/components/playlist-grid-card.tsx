import React from 'react';
import { PlaylistsGetManyOutput } from '../../types';
import Link from 'next/link';
import { FALLBACK_THUMBNAIL } from '@/constant';
import PlaylistThumbnail, {
    PlaylistThumbnailSkeleton,
} from './playlist-thumbnail';
import PlaylistInfo, { PlaylistInfoSkeleton } from './playlist-info';

interface PlaylistGridCardProps {
    data: PlaylistsGetManyOutput['items'][number];
}

export const PlaylistGridCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <PlaylistThumbnailSkeleton />
            <PlaylistInfoSkeleton />
        </div>
    );
};

const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
    return (
        <Link prefetch href={`/playlists/${data.id}`}>
            <div className="flex flex-col gap-2 w-full group">
                <PlaylistThumbnail
                    imageUrl={data.thumbnailUrl ?? FALLBACK_THUMBNAIL}
                    title={data.name}
                    videoCount={data.videoCount}
                />
                <PlaylistInfo data={data} />
            </div>
        </Link>
    );
};

export default PlaylistGridCard;
