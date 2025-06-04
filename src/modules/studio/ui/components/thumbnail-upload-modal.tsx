import ResponsiveDialog from '@/components/responsive-dialog';
import { UploadDropzone } from '@/lib/utils/uploadthing';
import { trpc } from '@/trpc/client';

interface ThumbnailUploadModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ThumbnailUploadModal = ({
    videoId,
    open,
    onOpenChange,
}: ThumbnailUploadModalProps) => {
    const utils = trpc.useUtils();

    const onUploadComplete = () => {
        onOpenChange(false);
        utils.studio.getOne.invalidate({
            id: videoId,
        });
        utils.studio.getMany.invalidate();
    };
    return (
        <ResponsiveDialog
            title="Upload Thumbnail"
            open={open}
            onOpenChange={onOpenChange}
        >
            <UploadDropzone
                endpoint={'imageUploader'}
                input={{ videoId }}
                onClientUploadComplete={onUploadComplete}
            />
        </ResponsiveDialog>
    );
};

export default ThumbnailUploadModal;
