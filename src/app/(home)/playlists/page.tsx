import { PlaylistsView } from '@/modules/playlists/ui/views/playlists-view';
import { HydrateClient } from '@/trpc/server';
import React from 'react';

const page = async () => {
    return (
        <HydrateClient>
            <PlaylistsView />
        </HydrateClient>
    );
};

export default page;
