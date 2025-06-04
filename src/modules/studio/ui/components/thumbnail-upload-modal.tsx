import ResponsiveDialog from '@/components/responsive-dialog';
import { UploadDropzone } from '@/lib/utils/uploadthing';

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
    return (
        <ResponsiveDialog
            title="Upload Thumbnail"
            open={open}
            onOpenChange={onOpenChange}
        >
            <UploadDropzone endpoint={'imageUploader'} />
        </ResponsiveDialog>
    );
};

export default ThumbnailUploadModal;
