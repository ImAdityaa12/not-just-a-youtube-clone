'use client';

import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import UserPageBanner from '../components/user-page-banner';
import { Skeleton } from '@/components/ui/skeleton';
import UserPageInfo from '../components/user-page-info';

interface UserSectionProps {
    userId: string;
}

export const UserPageSectionSkeleton = () => {
    return <Skeleton className="w-full max-h-[200px] h-[15vh] md:[25vh]" />;
};

const UserSectionSuspense = ({ userId }: UserSectionProps) => {
    const [user] = trpc.users.getOne.useSuspenseQuery({
        id: userId,
    });
    return (
        <div className="flex flex-col">
            <UserPageBanner user={user} />
            <UserPageInfo user={user} />
        </div>
    );
};

const UserSection = ({ userId }: UserSectionProps) => {
    return (
        <Suspense fallback={<UserPageSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <UserSectionSuspense userId={userId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export default UserSection;
