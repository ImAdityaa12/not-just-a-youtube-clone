import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import React, { useEffect } from 'react'
import { Button } from './ui/button';

interface InfiniteScrollProps {
    isManual?: boolean;
    hasNextPage: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage: () => void;
}

const InfiniteScroll= ({
    isManual = false,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
}: InfiniteScrollProps) => {
    const { targetRef, isIntersecting } = useIntersectionObserver({
        threshold: 0.5,
        rootMargin: '100px',
    })

    useEffect(()=> {
        if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
            fetchNextPage()    
        }
    }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage, isManual])

  return (
    <div className='flex flex-col items-center gap-4 p-4'>
        <div 
            ref={targetRef}
            className='h1'
        />
        {
            hasNextPage ? (
                <Button
                    variant='secondary'
                    disabled={!hasNextPage || isFetchingNextPage}
                    onClick={()=> fetchNextPage()}
                >
                    {
                        isFetchingNextPage ? 'Loading...' : 'Load More'
                    }
                </Button>
            ) : (
                <div>You have reached the end</div>
            )
        }
    </div>
  )
}

export default  InfiniteScroll;