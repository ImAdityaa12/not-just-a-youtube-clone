'use client';

import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface HomeVideosSectionProps {
    categoryId?: string;
}

const HomeVideosSectionSuspense = ({ categoryId }: HomeVideosSectionProps) => {
    const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
        { categoryId, limit: 10 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
    return <div>{JSON.stringify(videos)}</div>;
};

const HomeVideosSectionSkeleton = () => {
    return <div>HomeVideosSectionSkeleton</div>;
};

const HomeVideosSection = ({ categoryId }: HomeVideosSectionProps) => {
    return (
        <Suspense fallback={<HomeVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <HomeVideosSectionSuspense categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export default HomeVideosSection;
