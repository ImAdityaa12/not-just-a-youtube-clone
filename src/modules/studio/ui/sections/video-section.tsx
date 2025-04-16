"use client";

import InfiniteScroll from '@/components/infinite-scroll';
import { LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary';

const VideosSection = () => {
   return(
      <Suspense fallback={<div>Loading...</div>}>
         <ErrorBoundary fallback={<div>Error</div>}>
            <VideosSectionSuspense />
         </ErrorBoundary>
      </Suspense>
   )
}

const VideosSectionSuspense = () => {
 const [data, query] = trpc.studio.getMany.useSuspenseInfiniteQuery({
    limit: LIMIT,
 }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
 });
  return (
   <div>
      {JSON.stringify(data)}
      <InfiniteScroll 
         hasNextPage={query.hasNextPage}
         isFetchingNextPage={query.isFetchingNextPage}
         fetchNextPage={query.fetchNextPage}
         isManual
      />
   </div>
  )
}

export default VideosSection