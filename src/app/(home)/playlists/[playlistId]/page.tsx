import { LIMIT } from '@/constant';
import { PlaylistVideoView } from '@/modules/playlists/ui/views/playlist-video-view';
import { HydrateClient, trpc } from '@/trpc/server';
import React from 'react';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        playlistId: string;
    }>;
}

const page = async ({ params }: PageProps) => {
    const { playlistId } = await params;
    void trpc.playlists.getPlaylistVideos.prefetchInfinite({
        limit: LIMIT,
        playlistId,
    });

    return (
        <HydrateClient>
            <PlaylistVideoView playlistId={playlistId} />
        </HydrateClient>
    );
};

export default page;
