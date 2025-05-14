'use client';

interface FilterCarouselProps {
    value?: string | undefined;
    isLoading?: boolean;
    onSelect: (value: string | null) => void;
    data: {
        value: string;
        label: string;
    }[];
}

import React, { useEffect, useState } from 'react';
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from './ui/carousel';
import { Badge } from './ui/badge';
import { useSidebar } from './ui/sidebar';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

const FilterCarousel = ({
    value,
    isLoading,
    onSelect,
    data,
}: FilterCarouselProps) => {
    const { open } = useSidebar();

    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }
        setCurrent(api.selectedScrollSnap() + 1);
        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);
    return (
        <div className="relative">
            <div
                className={cn(
                    'absolute left-12 top-0 bottom-0 w-12 h-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none',
                    current === 1 && 'hidden',
                )}
            />
            <Carousel
                setApi={setApi}
                opts={{
                    align: 'start',
                    dragFree: true,
                }}
                className={cn(
                    'px-12 max-sm:hidden w-full py-1 mx-auto max-w-[calc(100vw-300px)]',
                    !open && 'max-w-[calc(100vw-100px)]',
                )}
            >
                <CarouselContent className="-ml-3 max-w-full">
                    {isLoading && (
                        <>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-20 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-24 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-28 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-20 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-32 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-20 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-32 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-20 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-32 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-20 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-32 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-20 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-32 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-20 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-32 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-20 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-32 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-20 h-6 rounded-lg" />
                            </CarouselItem>
                            <CarouselItem className="pl-3 basis-auto">
                                <Skeleton className="w-32 h-6 rounded-lg" />
                            </CarouselItem>
                        </>
                    )}

                    {!isLoading && (
                        <CarouselItem
                            className="pl-3 basis-auto"
                            onClick={() => onSelect?.(null)}
                        >
                            <Badge
                                variant={
                                    value === undefined
                                        ? 'default'
                                        : 'secondary'
                                }
                                className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                            >
                                All
                            </Badge>
                        </CarouselItem>
                    )}

                    {!isLoading &&
                        data.map(({ value, label }) => (
                            <CarouselItem
                                key={value}
                                className="pl-3 basis-auto"
                            >
                                <Badge
                                    variant={
                                        value === undefined
                                            ? 'default'
                                            : 'secondary'
                                    }
                                    className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                                    onClick={() => onSelect(value)}
                                >
                                    {label}
                                </Badge>
                            </CarouselItem>
                        ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 z-20" />
                <CarouselNext className="right-0 z-20" />
            </Carousel>
        </div>
    );
};

export default FilterCarousel;
