import { LIMIT } from '@/constant';
import { LikedView } from '@/modules/playlists/ui/views/liked-views';
import { HydrateClient, trpc } from '@/trpc/server';
import React from 'react';

const page = () => {
    void trpc.playlists.getLiked.prefetchInfinite({
        limit: LIMIT,
    });

    return (
        <HydrateClient>
            <LikedView />
        </HydrateClient>
    );
};

export default page;
