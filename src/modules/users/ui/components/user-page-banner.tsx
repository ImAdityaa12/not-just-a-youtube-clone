import React, { useState } from 'react';
import { UserGetOneOutput } from '../../types';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Edit2Icon } from 'lucide-react';
import BannerUploadModal from './banner-upload-modal';

interface UserPageBannerProps {
    user: UserGetOneOutput;
}

const UserPageBanner = ({ user }: UserPageBannerProps) => {
    const { userId } = useAuth();

    const [openBannerUploadModal, setOpenBannerUploadModal] = useState(false);

    return (
        <div className="relative group">
            <BannerUploadModal
                userId={user.id}
                open={openBannerUploadModal}
                onOpenChange={setOpenBannerUploadModal}
            />
            <div
                className={cn(
                    'w-full max-h-[200px] h-[25vh] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl bg-gray-100',
                    user.bannerUrl ? 'bg-cover' : 'bg-gray-100'
                )}
                style={{
                    backgroundImage: user.bannerUrl
                        ? `url(${user.bannerUrl})`
                        : undefined,
                }}
            >
                {user.clerkId === userId && (
                    <Button
                        type="button"
                        size="icon"
                        className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setOpenBannerUploadModal(true)}
                    >
                        <Edit2Icon className="size-4 text-white" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default UserPageBanner;
