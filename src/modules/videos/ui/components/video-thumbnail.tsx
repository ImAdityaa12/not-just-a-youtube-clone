import Image from 'next/image';

interface VideoThumbnailProps {
    thumbnailUrl: string | null;
}
export const VideoThumbnail = ({ thumbnailUrl }: VideoThumbnailProps) => {
    return (
        <div className="relative">
            {/* Thumbnail Wrapper */}
            <div className="relative w-full overflow-hidden aspect-video rounded-lg">
                <Image
                    src={thumbnailUrl ?? '/placeholder.svg'}
                    fill
                    className="size-full object-cover"
                    alt="Video Thumbnail Placeholder"
                />
            </div>
            {/* Video Duration Box */}
            <div></div>
        </div>
    );
};
