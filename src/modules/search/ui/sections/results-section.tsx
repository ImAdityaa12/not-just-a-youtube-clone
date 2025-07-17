'use client';

import { LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import React from 'react';

interface ResultsViewProps {
    query: string | undefined;
    categoryId: string | undefined;
}

const ResultsSection = ({ query, categoryId }: ResultsViewProps) => {
    const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
        { query, categoryId, limit: LIMIT },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

    return <div>{JSON.stringify(results)}</div>;
};

export default ResultsSection;
