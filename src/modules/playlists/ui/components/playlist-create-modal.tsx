import ResponsiveDialog from '@/components/responsive-dialog';

import { z } from 'zod';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PlaylistCreateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Prompt is required',
    }),
});

const PlaylistCreateModal = ({
    open,
    onOpenChange,
}: PlaylistCreateModalProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    });

    const create = trpc.playlists.create.useMutation({
        onSuccess: () => {
            form.reset();
            toast.success('Playlist created succesfully!');
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        create.mutate(data);
    };

    return (
        <ResponsiveDialog
            title="Create a playlist"
            open={open}
            onOpenChange={onOpenChange}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prompt</FormLabel>
                                <FormControl />
                                <Input
                                    {...field}
                                    placeholder="My favorite videos"
                                />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={create.isPending}
                            className="flex gap-2 items-center"
                        >
                            {create.isPending && (
                                <Loader2 className="animate-spin" />
                            )}
                            Create
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveDialog>
    );
};

export default PlaylistCreateModal;
