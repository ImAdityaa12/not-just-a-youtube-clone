'use client';

import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import FilterCarousel from '@/components/filter-carousel';

interface CategoriesSectionProps {
    categoryId?: string;
}

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
    return (
        <Suspense
            fallback={
                <FilterCarousel
                    isLoading={true}
                    value={categoryId}
                    data={[]}
                    onSelect={() => {}}
                />
            }
        >
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <CategoriesSectionSuspense categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    );
};
const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
    const [categories] = trpc.categories.getMany.useSuspenseQuery();
    const data = categories.map(({ name, id }) => {
        return {
            value: id,
            label: name,
        };
    });
    const onSelect = () => {};
    return (
        <div className="w-full overflow-hidden">
            <FilterCarousel
                value={categoryId}
                data={data}
                onSelect={onSelect}
            />
        </div>
    );
};
