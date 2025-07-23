'use client';

import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface PlaylistHeaderSection {
    playlistId: string;
}

const PlaylistHeaderSectionSkeleton = () => {
    return (
        <div className="flex flex-col gap-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
        </div>
    );
};

const PlaylistSectionSuspense = ({ playlistId }: PlaylistHeaderSection) => {
    const router = useRouter();
    const utils = trpc.useUtils();
    const [playlist] = trpc.playlists.getOne.useSuspenseQuery({
        playlistId,
    });
    const removePlaylist = trpc.playlists.remove.useMutation({
        onSuccess: () => {
            toast.success('Playlist removed successfully');
            utils.playlists.getOne.invalidate({
                playlistId,
            });
            utils.playlists.getMany.invalidate();
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });

    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">{playlist.name}</h1>
                <p className="text-xs text-muted-foreground">
                    Videos from the playlist
                </p>
            </div>
            <Button
                variant={'outline'}
                size={'icon'}
                className="rounded-full"
                disabled={removePlaylist.isPending}
                onClick={() => {
                    removePlaylist.mutate({
                        playlistId,
                    });
                }}
            >
                <Trash2Icon />
            </Button>
        </div>
    );
};

const PlaylistHeaderSection = ({ playlistId }: PlaylistHeaderSection) => {
    return (
        <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <PlaylistSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export default PlaylistHeaderSection;
