"use client";

import { LIMIT } from '@/constant';
import { trpc } from '@/trpc/client';
import React from 'react'

const VideosSection = () => {
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