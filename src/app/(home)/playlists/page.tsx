import { LIMIT } from '@/constant';
import { PlaylistsView } from '@/modules/playlists/ui/views/playlists-view';
import { HydrateClient, trpc } from '@/trpc/server';
import React from 'react';

export const dynamic = 'force-dynamic';

const page = async () => {
    void trpc.playlists.getMany.prefetchInfinite({
        limit: LIMIT,
    });
    return (
        <HydrateClient>
            <PlaylistsView />
        </HydrateClient>
    );
};

export default page;
