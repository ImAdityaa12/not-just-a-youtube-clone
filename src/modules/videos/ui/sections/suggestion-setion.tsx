'use client';

import { LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import React from 'react';

interface SuggestionSectionProps {
    videoId: string;
}

const SuggestionSection = ({ videoId }: SuggestionSectionProps) => {
    const [suggestions] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
        {
            videoId,
            limit: LIMIT,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );
    return <div>{JSON.stringify(suggestions)}</div>;
};

export default SuggestionSection;
