import Link from 'next/link';
import { CommentsGetManyOutput } from '../../types';
import UserAvatar from '@/components/user-avatar';
import { formatDistanceToNow } from 'date-fns';
import { trpc } from '@/trpc/client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    ChevronDownIcon,
    ChevronUpIcon,
    MessageSquareIcon,
    MoreVerticalIcon,
    ThumbsDownIcon,
    ThumbsUpIcon,
    Trash2Icon,
} from 'lucide-react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { CommentForm } from './comment-form';
import { CommentReplies } from './comment-replies';

interface CommentItemProps {
    comment: CommentsGetManyOutput['items'][number];
    variant?: 'comment' | 'reply';
}

export const CommmentItem = ({
    comment,
    variant = 'comment',
}: CommentItemProps) => {
    const { userId } = useAuth();
    const clerk = useClerk();

    const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
    const [isRepliesOpen, setIsRepliesOpen] = useState<boolean>(false);

    const utils = trpc.useUtils();
    const deleteComment = trpc.comments.delete.useMutation({
        onSuccess: () => {
            toast.success('Comment deleted');
            utils.comments.getMany.invalidate({
                videoId: comment.videoId,
            });
        },
        onError: (error) => {
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            } else {
                toast.error('Something went wrong');
            }
        },
    });
    const like = trpc.commentReactions.like.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({
                videoId: comment.videoId,
            });
        },
        onError: (error) => {
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            } else {
                toast.error('Something went wrong');
            }
        },
    });

    const dislike = trpc.commentReactions.disLike.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({
                videoId: comment.videoId,
            });
        },
        onError: (error) => {
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            } else {
                toast.error('Something went wrong');
            }
        },
    });
    return (
        <div>
            <div className="flex gap-4">
                <Link prefetch href={`/users/${comment.user.id}`}>
                    <UserAvatar
                        size={variant === 'comment' ? 'lg' : 'sm'}
                        imageUrl={comment.user.imageUrl}
                        name={comment.user.name}
                    />
                </Link>
                <div className="flex flex-1 min-w-[0] flex-col">
                    <Link prefetch href={`/users/${comment.userId}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm pb-0.5">
                                {comment.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.createdAt, {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm">{comment.value}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                            <Button
                                className="size-8"
                                size={'icon'}
                                disabled={like.isPending || dislike.isPending}
                                variant={'ghost'}
                                onClick={() =>
                                    like.mutate({ commentId: comment.id })
                                }
                            >
                                <ThumbsUpIcon
                                    className={cn(
                                        comment.viewerReaction === 'like'
                                            ? 'fill-black'
                                            : ''
                                    )}
                                />
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                {comment.likeCount}
                            </span>
                            <Button
                                className="size-8"
                                size={'icon'}
                                disabled={like.isPending || dislike.isPending}
                                variant={'ghost'}
                                onClick={() =>
                                    dislike.mutate({ commentId: comment.id })
                                }
                            >
                                <ThumbsDownIcon
                                    className={cn(
                                        comment.viewerReaction === 'dislike'
                                            ? 'fill-black'
                                            : ''
                                    )}
                                />
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                {comment.dislikeCount}
                            </span>
                        </div>
                        {variant === 'comment' && (
                            <Button
                                variant={'ghost'}
                                size="sm"
                                className="h-8"
                                onClick={() => {
                                    setIsReplyOpen(true);
                                }}
                            >
                                Reply
                            </Button>
                        )}
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={'ghost'}
                            size={'icon'}
                            className="size-8"
                        >
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {variant === 'comment' && (
                            <DropdownMenuItem
                                onClick={() => setIsReplyOpen(true)}
                            >
                                <MessageSquareIcon className="mr-2 size-4" />
                                Reply
                            </DropdownMenuItem>
                        )}

                        {comment.user.clerkId === userId && (
                            <DropdownMenuItem
                                onClick={() =>
                                    deleteComment.mutate({ id: comment.id })
                                }
                            >
                                <Trash2Icon className="mr-2 size-4" />
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {isReplyOpen && variant === 'comment' && (
                <div className="mt-4 pl-14">
                    <CommentForm
                        videoId={comment.videoId}
                        parentId={comment.id}
                        onSuccess={() => {
                            setIsReplyOpen(false);
                            setIsRepliesOpen(true);
                        }}
                        variant="reply"
                        onCancel={() => setIsReplyOpen(false)}
                    />
                </div>
            )}
            {comment.replyCount > 0 && variant === 'comment' && (
                <div className="pl-14">
                    <Button
                        size={'sm'}
                        variant={'teriary'}
                        onClick={() => setIsRepliesOpen((current) => !current)}
                    >
                        {isRepliesOpen ? (
                            <ChevronUpIcon />
                        ) : (
                            <ChevronDownIcon />
                        )}
                        {comment.replyCount} Reply
                    </Button>
                </div>
            )}
            {comment.replyCount > 0 &&
                variant === 'comment' &&
                isRepliesOpen && (
                    <CommentReplies
                        parentId={comment.id}
                        videoId={comment.videoId}
                    />
                )}
        </div>
    );
};
