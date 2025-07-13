'use client';

import { comments } from '@/db/schema';
import { CommentForm } from '@/modules/comments/ui/components/comment-form';
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
    return (
        <div className="mt-5">
            <div className="flex flex-col gap-6">
                <h1>0 Comments</h1>
                <CommentForm videoId={videoId} />
            </div>
            {JSON.stringify(comments)}
        </div>
    );
};

export default CommentsSection;
