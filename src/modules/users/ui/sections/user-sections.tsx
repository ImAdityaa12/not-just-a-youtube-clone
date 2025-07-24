'use client';

import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface UserSectionProps {
    userId: string;
}

const UserSectionSuspense = ({ userId }: UserSectionProps) => {
    const user = trpc.users.getOne.useSuspenseQuery({
        id: userId,
    });
    return <div>{JSON.stringify(user)}</div>;
};

const UserSection = ({ userId }: UserSectionProps) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <UserSectionSuspense userId={userId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export default UserSection;
