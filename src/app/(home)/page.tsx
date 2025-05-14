import { HomeView } from '@/modules/home/ui/views/home-view';
import { HydrateClient, trpc } from '@/trpc/server';
import React from 'react';

interface Pageprops {
    searchParams: Promise<{
        categoryId?: string;
    }>;
}
export const dynamic = 'force-dynamic';
const page = async ({ searchParams }: Pageprops) => {
    const { categoryId } = await searchParams;
    void trpc.categories.getMany.prefetch();
    return (
        <HydrateClient>
            <HomeView categoryId={categoryId} />
        </HydrateClient>
    );
};

export default page;
