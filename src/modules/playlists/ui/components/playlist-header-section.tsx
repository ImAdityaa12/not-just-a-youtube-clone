import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';

interface PlaylistHeaderSection {
    playlistId: string;
}

const PlaylistSectionSuspense = ({ playlistId }: PlaylistHeaderSection) => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">History</h1>
                <p className="text-xs text-muted-foreground">
                    Videos from the playlist
                </p>
            </div>
            <Button variant={'outline'} size={'icon'} className="rounded-full">
                <Trash2Icon />
            </Button>
        </div>
    );
};

const PlaylistHeaderSection = ({ playlistId }: PlaylistHeaderSection) => {
    return (
        <Suspense>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <PlaylistSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export default PlaylistHeaderSection;
