"use client";

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
 const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery({
    limit: LIMIT,
 }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
 });
  return (
    <div>{
        JSON.stringify(data)
    }</div>
  )
}

export default VideosSection