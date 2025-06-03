'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { trpc } from '@/trpc/client';
import {
    CopyCheck,
    CopyIcon,
    Globe2Icon,
    LockIcon,
    MoreVerticalIcon,
    TrashIcon,
} from 'lucide-react';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { videoUpdateSchema } from '@/db/schema';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import VideoPlayer from '@/modules/videos/ui/components/video-player';
import Link from 'next/link';
import { snakeCaseTotitle } from '@/lib/utils';

interface FormSectionProps {
    videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <FormSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
    const utils = trpc.useUtils();

    const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
    const [categories] = trpc.categories.getMany.useSuspenseQuery();

    const update = trpc.videos.update.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            utils.studio.getOne.invalidate({ id: videoId });
            toast.success('Video updated');
        },
        onError: (error) => {
            throw new Error(error.message);
        },
    });

    const form = useForm<z.infer<typeof videoUpdateSchema>>({
        resolver: zodResolver(videoUpdateSchema),
        defaultValues: video,
    });

    const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
        update.mutate(data);
    };

    const fullUrl = `${
        process.env.VERCEL_URL || 'http://localhost:3000'
    }/videos/${videoId}`;

    const [isCopied, setIsCopied] = useState(false);

    const onCopy = async () => {
        await navigator.clipboard.writeText(fullUrl);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Video Details</h1>
                        <p className="text-xs text-muted-foreground">
                            Manage your video details
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Button type="submit" disabled={update.isPending}>
                            Submit
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={'ghost'} size={'icon'}>
                                    <MoreVerticalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <TrashIcon className="size-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="space-y-8 lg:col-span-3">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Title
                                            {/* TODO: Add AI Generate Button */}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Add a title to your video"
                                            />
                                        </FormControl>
                                    </FormItem>
                                );
                            }}
                        ></FormField>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Description
                                            {/* TODO: Add AI Generate Button */}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ''}
                                                rows={10}
                                                className="resize-none pr-10"
                                                placeholder="Add a description to your video"
                                            />
                                        </FormControl>
                                    </FormItem>
                                );
                            }}
                        ></FormField>
                        {/* TODO: Add Thumbnail Field here */}
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={
                                                field.value ?? undefined
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => {
                                                    return (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={category.id}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                );
                            }}
                        ></FormField>
                    </div>
                    <div className="flex flex-col gap-y-8 lg:col-span-2">
                        <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                            <div className="aspect-video overflow-hidden relative">
                                <VideoPlayer
                                    playbackId={video.mux_playback_Id}
                                    thumbnailUrl={video.thumbnail_url}
                                />
                            </div>
                            <div className="p-4 flex flex-col gap-y-6">
                                <div className="flex justify-between items-center gap-x-2">
                                    <div className="flex- flex-col gap-y-1">
                                        <p className="text-muted-forground text-xs">
                                            Video link
                                        </p>
                                        <div className="flex items-center gap-x-2">
                                            <Link
                                                href={`/studio/videos/${video.id}`}
                                            >
                                                <p className="line-clamp-1 text-blue-500">
                                                    http://localhost:3000/studio/videos/816cd05c-433c-4903-bb54-f1a3f7af4ff7
                                                </p>
                                            </Link>
                                            <Button
                                                type="button"
                                                variant={'ghost'}
                                                size={'icon'}
                                                className="shrink-0"
                                                onClick={onCopy}
                                                disabled={isCopied}
                                            >
                                                {isCopied ? (
                                                    <CopyCheck />
                                                ) : (
                                                    <CopyIcon />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-muted-foreground text-xs">
                                            Video Status
                                        </p>
                                        <p className="text-sm">
                                            {snakeCaseTotitle(
                                                video.mux_status ?? 'Preparing'
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-y-1">
                                        <p className="text-muted-foreground text-xs">
                                            Subtitle Status
                                        </p>
                                        <p className="text-sm">
                                            {snakeCaseTotitle(
                                                video.mux_track_Status ??
                                                    'No Subtitle'
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name="video_visibility"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Select Visibility</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={
                                                field.value ?? undefined
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="public">
                                                    <div className="flex items-center">
                                                        <Globe2Icon className="size-4 mr-2" />
                                                        Public
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="private">
                                                    <div className="flex items-center">
                                                        <LockIcon className="size-4 mr-2" />
                                                        Private
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                );
                            }}
                        ></FormField>
                    </div>
                </div>
            </form>
        </Form>
    );
};
