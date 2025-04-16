"use client";

import InfiniteScroll from '@/components/infinite-scroll';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
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
 const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery({
    limit: LIMIT,
 }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
 });

  return (
   <div>
      <div className='border-y'>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className='pl-6 w-[510px]'>Video</TableHead>
                  <TableHead>Visiblity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className='text-right'>Views</TableHead>
                  <TableHead className='text-right'>Comments</TableHead>
                  <TableHead className='text-right pr-6'>Likes</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {
                  videos.pages.flatMap((page) => page.items).map((video) => (
                     <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                        <TableRow className='cursor-pointer'>
                           <TableCell>
                              {video.title}
                           </TableCell>
                           <TableCell>
                              Visibility
                           </TableCell>
                           <TableCell>
                              Visibility
                           </TableCell>
                           <TableCell>
                              Visibility
                           </TableCell>
                           <TableCell>
                              Visibility
                           </TableCell>
                           <TableCell>
                              Visibility
                           </TableCell>
                           <TableCell>
                              Visibility
                           </TableCell>

                        </TableRow>
                     </Link> 
                  ))
               }
            </TableBody>           
         </Table>
      </div>
      <InfiniteScroll 
         hasNextPage={query.hasNextPage}
         isFetchingNextPage={query.isFetchingNextPage}
         fetchNextPage={query.fetchNextPage}
      />
   </div>
  )
}

export default VideosSection