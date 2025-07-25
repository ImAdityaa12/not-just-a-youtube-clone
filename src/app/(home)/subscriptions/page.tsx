import { LIMIT } from '@/constant';
import { SubscriptionsView } from '@/modules/subscriptions/ui/views/subscriptions-view';
import { HydrateClient, trpc } from '@/trpc/server';
import React from 'react';

export const dynamic = 'force-dynamic';

const page = () => {
    void trpc.subscriptions.getMany.prefetchInfinite({
        limit: LIMIT,
    });
    return (
        <HydrateClient>
            <SubscriptionsView />
        </HydrateClient>
    );
};

export default page;
