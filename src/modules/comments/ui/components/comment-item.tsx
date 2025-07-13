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
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';

interface CommentItemProps {
    comment: CommentsGetManyOutput['items'][number];
}

export const CommmentItem = ({ comment }: CommentItemProps) => {
    const { userId } = useAuth();
    const clerk = useClerk();

    const utils = trpc.useUtils()
    const deleteComment = trpc.comments.delete.useMutation({
        onSuccess: () => {
            toast.success('Comment deleted');
            utils.comments.getMany.invalidate({
                videoId: comment.videoId
            })
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
                <Link
                    href={`/users/$import { comment } from 'postcss';
{comment.userId}`}
                />
                <UserAvatar
                    size={'lg'}
                    imageUrl={comment.user.imageUrl}
                    name={comment.user.name}
                />
                <div className="flex flex-1 min-w-[0] flex-col">
                    <Link href={`/users/${comment.userId}`}>
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
                    {/* Add Reactions */}
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
                        <DropdownMenuItem onClick={() => {}}>
                            <MessageSquareIcon className="mr-2 size-4" />
                            Reply
                        </DropdownMenuItem>
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
        </div>
    );
};
