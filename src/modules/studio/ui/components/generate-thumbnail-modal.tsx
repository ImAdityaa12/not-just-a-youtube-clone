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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ThumbnailGenerateModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    prompt: z.string().min(1, {
        message: 'Prompt is required',
    }),
});

const ThumbnailGenerateModal = ({
    videoId,
    open,
    onOpenChange,
}: ThumbnailGenerateModalProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: '',
        },
    });

    const generateThumnail = trpc.videos.generateThumbnail.useMutation({
        onSuccess: () => {
            onOpenChange(false);
            toast.success(
                'Background job started it will some time to complete it till then you can sit back and relax'
            );
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        generateThumnail.mutate({
            id: videoId,
            propmt: data.prompt,
        });
    };

    return (
        <ResponsiveDialog
            title="Upload Thumbnail"
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
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prompt</FormLabel>
                                <FormControl />
                                <Textarea
                                    {...field}
                                    cols={30}
                                    rows={5}
                                    placeholder="Enter a prompt"
                                />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={generateThumnail.isPending}
                            className="flex gap-2 items-center"
                        >
                            {generateThumnail.isPending && (
                                <Loader2 className="animate-spin" />
                            )}
                            Generate
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveDialog>
    );
};

export default ThumbnailGenerateModal;
