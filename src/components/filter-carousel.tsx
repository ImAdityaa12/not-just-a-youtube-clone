"use client";

interface FilterCarouselProps {
  value: string | undefined;
  isLoading?: boolean;
  onSelect?: (valye: string | null) => void;
  data: {
    value: string;
    label: string;
  }[];
}

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Badge } from "./ui/badge";
import { useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";

const FilterCarousel = ({
  value,
  isLoading,
  onSelect,
  data,
}: FilterCarouselProps) => {
  const { open } = useSidebar();
  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className={cn(
          "px-12 max-sm:hidden w-full py-1 mx-auto max-w-[calc(100vw-300px)]",
          !open && "max-w-[calc(100vw-100px)]"
        )}
      >
        <CarouselContent className="-ml-3 max-w-full">
          <CarouselItem className="pl-3 basis-auto">
            <Badge
              variant={value === undefined ? "default" : "secondary"}
              className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
            >
              All
            </Badge>
          </CarouselItem>
          {!isLoading &&
            data.map(({ value, label }) => (
              <CarouselItem key={value} className="pl-3 basis-auto">
                <Badge
                  variant={value === undefined ? "default" : "secondary"}
                  className="rounded-lg px-3 py-1 cursor-pointer whitespace-nowrap text-sm"
                  onClick={() => onSelect?.(value)}
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
