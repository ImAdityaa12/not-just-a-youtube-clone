import ResponsiveDialog from '@/components/responsive-dialog';
import { UploadDropzone } from '@/lib/utils/uploadthing';
import { trpc } from '@/trpc/client';

interface BannerUploadModalProps {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const BannerUploadModal = ({
    userId,
    open,
    onOpenChange,
}: BannerUploadModalProps) => {
    const utils = trpc.useUtils();

    const onUploadComplete = () => {
        onOpenChange(false);
        utils.users.getOne.invalidate({
            id: userId,
        });
    };
    return (
        <ResponsiveDialog
            title="Upload Thumbnail"
            open={open}
            onOpenChange={onOpenChange}
        >
            <UploadDropzone
                endpoint={'bannerUplaoder'}
                onClientUploadComplete={onUploadComplete}
            />
        </ResponsiveDialog>
    );
};

export default BannerUploadModal;
