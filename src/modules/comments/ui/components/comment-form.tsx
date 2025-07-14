import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from '@/components/user-avatar';
import { commentInsertSchema } from '@/db/schema';
import { trpc } from '@/trpc/client';
import { useClerk, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface CommentFormProps {
    videoId: string;
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    variant?: 'comment' | 'reply';
}

export const CommentForm = ({
    videoId,
    onSuccess,
    onCancel,
    parentId,
    variant = 'comment',
}: CommentFormProps) => {
    const { user } = useUser();
    const clerk = useClerk();
    const utils = trpc.useUtils();
    const create = trpc.comments.create.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({
                videoId,
            });
            utils.comments.getMany.invalidate({
                videoId,
                parentId,
            });
            form.reset();
            toast.success('Comment Added');
            onSuccess?.();
        },
        onError: (error) => {
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            } else {
                toast.error('Something went wrong');
            }
        },
    });
    const form = useForm<z.infer<typeof commentInsertSchema>>({
        resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
        defaultValues: {
            parentId,
            videoId,
            value: '',
        },
    });

    const handleSubmit = (values: z.infer<typeof commentInsertSchema>) => {
        create.mutate(values);
    };

    const handleCancel = () => {
        form.reset();
        onCancel?.();
    };

    return (
        <Form {...form}>
            <form
                className="flex gap-4 group"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <UserAvatar
                    size="lg"
                    imageUrl={user?.imageUrl || '/user.svg'}
                    name={user?.username || ''}
                />
                <div className="flex-1">
                    <FormField
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder={
                                            variant === 'comment'
                                                ? 'Add a comment...'
                                                : 'Reply to this comment'
                                        }
                                        className="resize-none bg-transparent overflow-hidden min-h-0"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="justify-end gap-2 mt-2 flex">
                        {onCancel && (
                            <Button
                                variant="ghost"
                                size={'sm'}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            size={'sm'}
                            disabled={create.isPending}
                        >
                            {variant === 'comment' ? 'Comment' : 'Reply'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};
