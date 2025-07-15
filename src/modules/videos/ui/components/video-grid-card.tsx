import React from 'react';
import { VideoGetManyOutput } from '../../types';
import Link from 'next/link';
import { VideoThumbnail } from './video-thumbnail';
import VideoInfo from './video-info';

interface VideoGridCardProps {
    data: VideoGetManyOutput['items'][number];
    onRemoved?: () => void;
}

const VideoGridCard = ({ data, onRemoved }: VideoGridCardProps) => {
    return (
        <div className="flex flex-col gap-2 w-full group">
            <Link href={`/videos/${data.id}`}>
                <VideoThumbnail
                    thumbnailUrl={data.thumbnail_url}
                    title={data.title}
                    duration={data.video_duration ?? 0}
                    previewUrl={data.preview_url}
                />
            </Link>
            <VideoInfo data={data} />
        </div>
    );
};

export default VideoGridCard;
