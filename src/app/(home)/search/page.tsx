import React from 'react';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{
        query: string;
        categoryId: string | undefined;
    }>;
}
const page = async ({ searchParams }: PageProps) => {
    const { query, categoryId } = await searchParams;
    return (
        <div>
            searching for {query} in category: {categoryId}
        </div>
    );
};

export default page;
