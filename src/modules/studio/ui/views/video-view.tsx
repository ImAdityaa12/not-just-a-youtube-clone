import React from 'react';
import { FormSection } from '../sections/form-secton';

interface VideoPageProps {
    videoId: string;
}

const VideoView = ({ videoId }: VideoPageProps) => {
    return (
        <div className="px-4 pt-2.5">
            <FormSection videoId={videoId} />
        </div>
    );
};

export default VideoView;
