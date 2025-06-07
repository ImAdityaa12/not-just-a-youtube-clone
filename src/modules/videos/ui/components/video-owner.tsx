import React from 'react';
import { VideoGetOneOutput } from '../../types';

interface VideoOwnerProps {
    user: VideoGetOneOutput['user'];
}

const VideoOwner = ({ user }: VideoOwnerProps) => {
    return <div>{user.name}</div>;
};

export default VideoOwner;
