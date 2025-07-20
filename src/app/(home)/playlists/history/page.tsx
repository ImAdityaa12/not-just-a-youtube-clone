import { LIMIT } from '@/constant';
import { HistoryView } from '@/modules/playlists/ui/views/history-view';
import { HydrateClient, trpc } from '@/trpc/server';
import React from 'react';

const page = () => {
    void trpc.playlists.getHistory.prefetchInfinite({
        limit: LIMIT,
    });

    return (
        <HydrateClient>
            <HistoryView />
        </HydrateClient>
    );
};

export default page;
