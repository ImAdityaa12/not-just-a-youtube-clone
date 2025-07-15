'use client';

import { LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import React from 'react';
import { VideoRowCard } from '../components/video-row-card';
import VideoGridCard from '../components/video-grid-card';

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

    return (
        <>
            <div className="hidden md:block space-y-3">
                {suggestions.pages
                    .flatMap((page) => page.items)
                    .map((suggestion) => (
                        <VideoRowCard
                            data={suggestion}
                            onRemove={() => {}}
                            size={'compact'}
                            key={suggestion.id}
                        />
                    ))}
            </div>
            <div className="block md:hidden space-y-10">
                {suggestions.pages
                    .flatMap((page) => page.items)
                    .map((suggestion) => (
                        <VideoGridCard data={suggestion} key={suggestion.id} />
                    ))}
            </div>
        </>
    );
};

export default SuggestionSection;
