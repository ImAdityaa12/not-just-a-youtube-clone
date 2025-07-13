'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { LIMIT } from '@/constant';
import { CommentForm } from '@/modules/comments/ui/components/comment-form';
import { CommmentItem } from '@/modules/comments/ui/components/comment-item';
import { trpc } from '@/trpc/client';
import { Loader2Icon } from 'lucide-react';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface CommentsSectionProps {
    videoId: string;
}

const CommentSectinSkeleton = () => {
    return (
        <div className="mt-6 flex justify-center items-center">
            <Loader2Icon className="text-muted-foreground size-7 animate-spin" />
        </div>
    );
};

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
    return (
        <Suspense fallback={<CommentSectinSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};

const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
    const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
        {
            videoId,
            limit: LIMIT,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );
    return (
        <div className="mt-5">
            <div className="flex flex-col gap-6">
                <h1 className="text-xl font-bold">
                    {comments.pages[0].totalCount} Comments
                </h1>
                <CommentForm videoId={videoId} />
            </div>
            <div className="flex flex-col gap-4 mt-2">
                {comments.pages
                    .flatMap((page) => page.items)
                    .map((comment) => (
                        <CommmentItem key={comment.id} comment={comment} />
                    ))}
            </div>
            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
                isManual
            />
        </div>
    );
};

export default CommentsSection;
