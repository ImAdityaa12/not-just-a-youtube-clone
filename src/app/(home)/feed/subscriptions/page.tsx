import { LIMIT } from '@/constant';
import { SubscriptionView } from '@/modules/home/ui/views/subscription-view';
import { HydrateClient, trpc } from '@/trpc/server';
import React from 'react';

export const dynamic = 'force-dynamic';

const page = () => {
    void trpc.subscriptions.getManySubscribed.prefetchInfinite({
        limit: LIMIT,
    });

    return (
        <HydrateClient>
            <SubscriptionView />
        </HydrateClient>
    );
};

export default page;
