import React from 'react';

import MuxUploader, {
    MuxUploaderDrop,
    MuxUploaderFileSelect,
    MuxUploaderProgress,
    MuxUploaderStatus,
} from '@mux/mux-uploader-react';
import { UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudioUploaderProps {
    endpoint: string;
    onSuccess: () => void;
}

const uploaderId = 'video-uploader';
const StudioUploader = ({ endpoint, onSuccess }: StudioUploaderProps) => {
    return (
        <div>
            <MuxUploader
                endpoint={endpoint}
                onSuccess={onSuccess}
                id={uploaderId}
                className="hidden group/uploader"
            />
            <MuxUploaderDrop muxUploader={uploaderId} className="group/drop">
                <div
                    slot="heading"
                    className="flex flex-col items-center gap-6"
                >
                    <div className="flex items-center justify-center rounded-full bg-muted h-32 w-32">
                        <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300" />
                    </div>
                    <div className="flex flex-col gap-2 text-center">
                        <p className="text-sm">
                            Drag and drop videos files to upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Your videos will be private until you public them
                        </p>
                    </div>
                    <MuxUploaderFileSelect muxUploader={uploaderId}>
                        <Button type="button" className="rounded-full">
                            Select Files
                        </Button>
                    </MuxUploaderFileSelect>
                </div>
                <span slot="separator" className="hidden /" />
                <MuxUploaderStatus
                    muxUploader={uploaderId}
                    className="text-sm"
                />
                <MuxUploaderProgress
                    muxUploader={uploaderId}
                    className="text-sm"
                    type="percentage"
                />
                <MuxUploaderProgress muxUploader={uploaderId} type="bar" />
            </MuxUploaderDrop>
        </div>
    );
};

export default StudioUploader;
