'use client';

import { comments } from '@/db/schema';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface CommentsSectionProps {
    videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};

const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
    const [comments] = trpc.comments.getMany.useSuspenseQuery({
        videoId,
    });
    return <div>{JSON.stringify(comments)}</div>;
};

export default CommentsSection;
