import React from 'react';

import MuxUploader, {
    MuxUploaderDrop,
    MuxUploaderFileSelect,
    MuxUploaderProgress,
    MuxUploaderStatus,
} from '@mux/mux-uploader-react';

interface StudioUploaderProps {
    endpoint: string;
    onSuccess: () => void;
}
const StudioUploader = ({ endpoint, onSuccess }: StudioUploaderProps) => {
    return (
        <div>
            <MuxUploader />
        </div>
    );
};

export default StudioUploader;
