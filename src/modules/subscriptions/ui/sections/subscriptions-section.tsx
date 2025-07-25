'use client';

import InfiniteScroll from '@/components/infinite-scroll';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LIMIT } from '@/constant';
import { toast } from 'sonner';
import Link from 'next/link';
import SubscriptionItem, {
    SubscriptionItemSkeleton,
} from '../components/subscriptions-items';

const SubscriptionsSectionSectionSuspense = () => {
    const utils = trpc.useUtils();
    const [subscriptions, query] =
        trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
            { limit: LIMIT },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        );
    const unsubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: (data) => {
            toast.success('Unsubscribed');
            utils.subscriptions.getManySubscribed.invalidate();
            utils.users.getOne.invalidate({ id: data.creatorId });
            utils.subscriptions.getMany.invalidate();
        },
        onError: (error) => {
            toast.error(`Something went wrong, ${error.message}`);
        },
    });
    return (
        <div>
            <div className="flex flex-col gap-4">
                {subscriptions.pages
                    .flatMap((page) => page.items)
                    .map((creator) => (
                        <Link
                            prefetch
                            href={`/users/${creator.creatorId}`}
                            key={creator.creatorId}
                        >
                            <SubscriptionItem
                                name={creator.user.name}
                                imageUrl={creator.user.imageUrl}
                                subscriberCount={creator.user.subscriberCount}
                                onUnsubscribe={() => {
                                    unsubscribe.mutate({
                                        userId: creator.creatorId,
                                    });
                                }}
                                disabled={
                                    creator.user.subscriberCount === 0 ||
                                    unsubscribe.isPending
                                }
                            />
                        </Link>
                    ))}
            </div>
            <InfiniteScroll
                fetchNextPage={query.fetchNextPage}
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
            />
        </div>
    );
};

const SubscriptionsSectionSectionSkeleton = () => {
    return (
        <div>
            <div className="flex flex-col gap-4">
                {[1, 2, 3, 4, 5].map((item) => (
                    <SubscriptionItemSkeleton key={item} />
                ))}
            </div>
        </div>
    );
};

const SubscriptionsSectionSection = () => {
    return (
        <Suspense fallback={<SubscriptionsSectionSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <SubscriptionsSectionSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};

export default SubscriptionsSectionSection;
