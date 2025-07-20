import React from 'react';
import { PlaylistsGetManyOutput } from '../../types';
import Link from 'next/link';
import { FALLBACK_THUMBNAIL } from '@/constant';
import PlaylistThumbnail from './playlist-thumbnail';

interface PlaylistGridCardProps {
    data: PlaylistsGetManyOutput['items'][number];
}

const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
    return (
        <Link href={`/playlists/${data.id}`}>
            <div className="flex flex-col gap-2 w-full group">
                <PlaylistThumbnail
                    imageUrl={FALLBACK_THUMBNAIL}
                    title={data.name}
                    videoCount={data.videoCount}
                />
            </div>
        </Link>
    );
};

export default PlaylistGridCard;
