import PlaylistHeaderSection from '../components/playlist-header-section';
import PlaylistVideosSection from '../sections/playlist-videos-section';

interface PlaylistVideoViewProps {
    playlistId: string;
}

export const PlaylistVideoView = ({ playlistId }: PlaylistVideoViewProps) => {
    return (
        <div className="max-w-screen-md mx-auto mb-10 px-5 pt-2.5 flex flex-col gap-y-6">
            <PlaylistHeaderSection playlistId={playlistId} />
            <PlaylistVideosSection playlistId={playlistId} />
        </div>
    );
};
