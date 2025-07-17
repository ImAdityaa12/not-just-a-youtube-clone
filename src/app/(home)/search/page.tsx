import SearchView from '@/modules/search/ui/views/search-view';
import { HydrateClient, trpc } from '@/trpc/server';
import React from 'react';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{
        query: string;
        categoryId: string | undefined;
    }>;
}
const page = async ({ searchParams }: PageProps) => {
    const { query, categoryId } = await searchParams;
    void trpc.categories.getMany.prefetch();
    return (
        <HydrateClient>
            <SearchView categoryId={categoryId} query={query} />
        </HydrateClient>
    );
};

export default page;
