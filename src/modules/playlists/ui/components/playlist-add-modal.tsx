'use client';

import { trpc } from '@/trpc/client';
import ResponsiveDialog from '@/components/responsive-dialog';
import { LIMIT } from '@/constant';
import { Loader2Icon, SquareCheckIcon, SquareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InfiniteScroll from '@/components/infinite-scroll';
import { toast } from 'sonner';

interface PlaylistAddModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    videoId: string;
}

const PlaylistAddModal = ({
    open,
    onOpenChange,
    videoId,
}: PlaylistAddModalProps) => {
    const utils = trpc.useUtils();
    const {
        data: playlists,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = trpc.playlists.getManyForVideo.useInfiniteQuery(
        {
            limit: LIMIT,
            videoId: videoId,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            enabled: !!videoId && open,
        }
    );

    const addVideo = trpc.playlists.addVideo.useMutation({
        onSuccess: (data) => {
            utils.playlists.getManyForVideo.invalidate({
                videoId: videoId,
            });
            utils.playlists.getMany.invalidate();
            utils.playlists.getOne.invalidate({
                playlistId: data.playlistId,
            });
            utils.playlists.getPlaylistVideos.invalidate({
                playlistId: data.playlistId,
            });
            toast.success('Video added to playlist');
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });
    const removeVideo = trpc.playlists.removeVideo.useMutation({
        onSuccess: (data) => {
            utils.playlists.getManyForVideo.invalidate({
                videoId: videoId,
            });
            utils.playlists.getMany.invalidate();
            utils.playlists.getOne.invalidate({
                playlistId: data.playlistId,
            });
            utils.playlists.getPlaylistVideos.invalidate({
                playlistId: data.playlistId,
            });
            toast.success('Video Removed from the playlist');
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });

    return (
        <ResponsiveDialog
            title="Add to playlist"
            open={open}
            onOpenChange={onOpenChange}
        >
            <div className="flex flex-col gap-2">
                {isLoading && (
                    <div className="flex justify-center p-4">
                        <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
                    </div>
                )}
                {!isLoading &&
                    playlists?.pages
                        .flatMap((page) => page.items)
                        .map((playlist) => (
                            <Button
                                key={playlist.id}
                                variant={'ghost'}
                                className="w-full justify-start px-2 [&_svg]:size-5"
                                size={'lg'}
                                onClick={() => {
                                    if (playlist.containsVideo) {
                                        removeVideo.mutate({
                                            playlistId: playlist.id,
                                            videoId: videoId,
                                        });
                                    } else {
                                        addVideo.mutate({
                                            playlistId: playlist.id,
                                            videoId: videoId,
                                        });
                                    }
                                }}
                            >
                                {playlist.containsVideo ? (
                                    <SquareCheckIcon className="mr-2" />
                                ) : (
                                    <SquareIcon className="mr-2" />
                                )}
                                {playlist.name}
                            </Button>
                        ))}
                {!isLoading && (
                    <InfiniteScroll
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        isManual
                    />
                )}
            </div>
        </ResponsiveDialog>
    );
};

export default PlaylistAddModal;
