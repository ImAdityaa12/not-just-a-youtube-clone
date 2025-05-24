'use client';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const StudioUploadModal = () => {
    const utils = trpc.useUtils();
    const create = trpc.videos.create.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            toast.success('Video created');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return (
        <>
            <Button
                variant={'secondary'}
                onClick={() => create.mutate()}
                disabled={create.isPending}
            >
                {create.isPending ? (
                    <span className="w-4 h-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] mr-1"></span>
                ) : (
                    <PlusIcon />
                )}
                Create
            </Button>
        </>
    );
};

export default StudioUploadModal;
