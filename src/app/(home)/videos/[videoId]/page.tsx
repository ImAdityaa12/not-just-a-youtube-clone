import VideoView from '@/modules/videos/ui/views/video-view';
import { HydrateClient, trpc } from '@/trpc/server';
import { LIMIT } from '@/constant';
import React from 'react';

interface PageProps {
    params: Promise<{
        videoId: string;
    }>;
}

const page = async ({ params }: PageProps) => {
    const { videoId } = await params;

    void trpc.videos.getOne.prefetch({
        id: videoId,
    });
    // TODO: Don't forget to add prefetchInfinite
    void trpc.comments.getMany.prefetchInfinite({
        videoId,
        limit: LIMIT,
    });
    return (
        <HydrateClient>
            <VideoView videoId={videoId} />
        </HydrateClient>
    );
};

export default page;
