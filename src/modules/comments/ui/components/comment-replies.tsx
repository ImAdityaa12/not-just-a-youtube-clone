import { LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import { CornerDownRightIcon, Loader2Icon } from 'lucide-react';
import { CommmentItem } from './comment-item';
import { Button } from '@/components/ui/button';

interface CommentRepliesProps {
    parentId: string;
    videoId: string;
}

export const CommentReplies = ({ parentId, videoId }: CommentRepliesProps) => {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        trpc.comments.getMany.useInfiniteQuery(
            {
                videoId,
                limit: LIMIT,
                parentId,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        );
    return (
        <div className="pl-14">
            <div className="flex flex-col gap-4 mt-2">
                {isLoading && (
                    <div className="flex items-center justify-center">
                        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                    </div>
                )}
                {!isLoading &&
                    data?.pages
                        .flatMap((page) => page.items)
                        .map((comment) => (
                            <CommmentItem
                                key={comment.id}
                                comment={comment}
                                variant="reply"
                            />
                        ))}
            </div>
            {hasNextPage && (
                <Button
                    variant={'teriary'}
                    size={'sm'}
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    <CornerDownRightIcon />
                    Load more replies
                </Button>
            )}
        </div>
    );
};
