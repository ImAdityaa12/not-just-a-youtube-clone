import UserView from '@/modules/users/ui/views/user-view';
import { HydrateClient, trpc } from '@/trpc/server';
import React from 'react';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        userId: string;
    }>;
}

const page = async ({ params }: PageProps) => {
    const { userId } = await params;
    void trpc.users.getOne.prefetch({
        id: userId,
    });
    return (
        <HydrateClient>
            <UserView userId={userId} />
        </HydrateClient>
    );
};

export default page;
