import { LIMIT } from '@/constant';
import { TrendingView } from '@/modules/home/ui/views/treding.view';
import { HydrateClient, trpc } from '@/trpc/server';
import React from 'react';

export const dynamic = 'force-dynamic';

const page = () => {
    void trpc.videos.getManyTrending.prefetchInfinite({
        limit: LIMIT,
    });

    return (
        <HydrateClient>
            <TrendingView />
        </HydrateClient>
    );
};

export default page;
