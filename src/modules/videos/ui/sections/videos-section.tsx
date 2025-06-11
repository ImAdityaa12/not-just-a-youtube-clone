'use client';

import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import VideoPlayer from '../components/video-player';
import VideoBanner from '../components/video-banner';
import VideoTopRow from '../components/video-top-row';
import { useAuth } from '@clerk/nextjs';

interface VideosSectionProps {
    videoId: string;
}

const VideosSection = ({ videoId }: VideosSectionProps) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <VideosSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export const VideosSectionSuspense = ({ videoId }: VideosSectionProps) => {
    const { isSignedIn } = useAuth();
    const utils = trpc.useUtils();
    const [video] = trpc.videos.getOne.useSuspenseQuery({
        id: videoId,
    });

    const createView = trpc.videoViews.create.useMutation({
        onSuccess: () => {
            utils.videos.getOne.invalidate({ id: video.id });
        },
    });

    const handlePlay = () => {
        if (!isSignedIn) return;
        createView.mutate({ id: videoId });
    };

    return (
        <>
            <div
                className={cn(
                    'aspect-video bg-black rounded-xl overflow-hidden relative',
                    video.mux_status !== 'ready' && 'rounded-b-none'
                )}
            >
                <VideoPlayer
                    autoPlay={true}
                    onPlay={handlePlay}
                    playbackId={video.mux_playback_Id}
                    thumbnailUrl={video.thumbnail_url}
                />
            </div>
            <VideoBanner status={video.mux_status} />
            <VideoTopRow video={video} />
        </>
    );
};
export default VideosSection;
