'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { APP_URL } from '@/constant';
import { Search, XIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';

export const HomeNavbarSearch = () => {
    return (
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            <HomeNavbarSearchSuspense />
        </Suspense>
    );
};

const HomeNavbarSearchSuspense = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const [value, setValue] = useState(query);
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const url = new URL('/search', APP_URL);
        const newQuery = value.trim();

        url.searchParams.set('query', newQuery);
        if (categoryId) {
            url.searchParams.set('categoryId', categoryId);
        }
        if (newQuery === '') {
            url.searchParams.delete('query');
        }
        setValue(newQuery);
        router.push(url.toString());
    };
    return (
        <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                {value && (
                    <Button
                        type="button"
                        variant={'ghost'}
                        size={'icon'}
                        onClick={() => setValue('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                    >
                        <XIcon className="text-gray-500" />
                    </Button>
                )}
            </div>
            <button
                disabled={!value.trim()}
                type="submit"
                className="px-5 pr-6 py-2.5 bg-gray-100 border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Search className="size-5" />
            </button>
        </form>
    );
};

export default HomeNavbarSearch;
