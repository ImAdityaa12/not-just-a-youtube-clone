import React from 'react';
import { VideoGetOneOutput } from '../../types';
import VideoOwner from './video-owner';

interface VideoTopRowProps {
    video: VideoGetOneOutput;
}

const VideoTopRow = ({ video }: VideoTopRowProps) => {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-xl font-semibold">{video.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <VideoOwner user={video.user} />
            </div>
        </div>
    );
};

export default VideoTopRow;
