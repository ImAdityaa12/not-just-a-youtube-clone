import { formatDuration } from '@/lib/utils';
import Image from 'next/image';

interface VideoThumbnailProps {
    thumbnailUrl?: string | null;
    previewUrl?: string | null;
    duration: number | null;
}
export const VideoThumbnail = ({
    thumbnailUrl,
    previewUrl,
    duration = 0,
}: VideoThumbnailProps) => {
    return (
        <div className="relative group">
            <div className="relative w-full overflow-hidden aspect-video rounded-lg">
                <Image
                    src={thumbnailUrl ?? '/placeholder.svg'}
                    fill
                    className="size-full object-cover group-hover:opacity-0 "
                    alt="Video Thumbnail"
                />
                <Image
                    unoptimized={!!previewUrl}
                    src={previewUrl ?? '/placeholder.svg'}
                    fill
                    className="size-full object-cover group-hover:opacity-100 opacity-0"
                    alt="Video Preview"
                />
            </div>

            <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/50 text-white text-xs font-medium">
                {formatDuration(duration ?? 0)}
            </div>
        </div>
    );
};
