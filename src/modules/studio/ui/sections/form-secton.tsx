'use client';

import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface FormSectionProps {
    videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <FormSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};

export const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
    const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });

    return <div>{JSON.stringify(video)}</div>;
};
