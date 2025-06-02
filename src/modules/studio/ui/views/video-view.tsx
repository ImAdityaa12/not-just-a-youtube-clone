import React from 'react';

interface VideoPageProps {
    videoId: string;
}

const VideoView = ({ videoId }: VideoPageProps) => {
    return <div className="px-4 pt-2.5">{videoId}</div>;
};

export default VideoView;
