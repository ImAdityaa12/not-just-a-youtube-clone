import VideoView from '@/modules/studio/ui/views/video-view';
import { HydrateClient } from '@/trpc/server';
import React from 'react';

interface PageProps {
    params: Promise<{ videoId: string }>;
}

const page = async ({ params }: PageProps) => {
    const { videoId } = await params;
    return (
        <HydrateClient>
            <VideoView videoId={videoId} />
        </HydrateClient>
    );
};

export default page;
