'use client';

import React from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { FALLBACK_THUMBNAIL } from '@/constant';

interface VideoPlayerProps {
    playbackId?: string | null | undefined;
    thumbnailUrl?: string | null | undefined;
    autoPlay?: boolean;
    onPlay?: () => void;
}

export const VideoPlayerSkeleton = () => {
    return <div className="aspect-video bg-black rounded-xl" />;
};

const VideoPlayer = ({
    playbackId,
    thumbnailUrl,
    autoPlay,
    onPlay,
}: VideoPlayerProps) => {
    return (
        <MuxPlayer
            playbackId={playbackId || ''}
            poster={thumbnailUrl ?? FALLBACK_THUMBNAIL}
            playerInitTime={0}
            autoPlay={autoPlay}
            thumbnailTime={0}
            className="w-full h-full object-contain"
            accentColor="#FF2056"
            onPlay={onPlay}
        />
    );
};

export default VideoPlayer;
