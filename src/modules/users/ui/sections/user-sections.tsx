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

export const UserPageInfoSkeleton = () => {
    return (
        <div className="py-8">
            <div className="flex flex-col md:hidden min-h-[108px]">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-[60px] w-[60px] rounded-full" />
                    <div className="flex-1 min-w-0">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <div className="flex items-center gap-1">
                            <Skeleton className="h-3 w-20" />
                            <span className="text-muted-foreground">
                                &bull;
                            </span>
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                </div>
                <Skeleton className="w-full h-9 mt-3 rounded-full" />
            </div>

            <div className="hidden md:flex items-start gap-4 h-[160px]">
                <Skeleton className="h-[160px] w-[160px] rounded-full" />
                <div className="min-h-[160px] flex-1 min-w-0">
                    <Skeleton className="h-10 w-48 mb-3" />
                    <div className="flex items-center gap-1 mb-3">
                        <Skeleton className="h-4 w-24" />
                        <span className="text-muted-foreground">&bull;</span>
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-9 w-32 rounded-full" />
                </div>
            </div>
        </div>
    );
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
        <Suspense
            fallback={
                <div className="flex flex-col">
                    <UserPageSectionSkeleton />
                    <UserPageInfoSkeleton />
                </div>
            }
        >
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <UserSectionSuspense userId={userId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export default UserSection;
