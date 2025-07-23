import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    ListPlusIcon,
    MoreVerticalIcon,
    ShareIcon,
    Trash2Icon,
} from 'lucide-react';

import { toast } from 'sonner';
import { APP_URL } from '@/constant';
import PlaylistAddModal from '@/modules/playlists/ui/components/playlist-add-modal';

interface VideoMenuProps {
    videoId: string;
    variant?: 'ghost' | 'secondary';
    onRemove?: () => void;
}

const VideoMenu = ({
    videoId,
    variant = 'ghost',
    onRemove,
}: VideoMenuProps) => {
    const [openPlalistAddModal, setOpenPlaylistAddModal] = useState(false);

    const onShare = async () => {
        const fullUrl = `${APP_URL}/videos/${videoId}`;
        try {
            await navigator.clipboard.writeText(fullUrl);
            toast.success('Linked copied to clipboard');
        } catch (error) {
            toast.error('Failed to copy link to clipboard');
        }
    };
    return (
        <>
            <PlaylistAddModal
                open={openPlalistAddModal}
                onOpenChange={setOpenPlaylistAddModal}
                videoId={videoId}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={variant} size={'icon'}>
                        <MoreVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenuItem onClick={onShare}>
                        <ShareIcon className="mr-2 size-4" />
                        Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            setOpenPlaylistAddModal(true);
                        }}
                    >
                        <ListPlusIcon className="mr-2 size-4" />
                        Add to playlist
                    </DropdownMenuItem>
                    {onRemove && (
                        <DropdownMenuItem
                            onClick={() => {
                                onRemove();
                            }}
                        >
                            <Trash2Icon className="mr-2 size-4" />
                            Remove
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default VideoMenu;
