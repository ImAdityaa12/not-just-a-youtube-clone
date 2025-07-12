'use client';

import { comments } from '@/db/schema';
import { trpc } from '@/trpc/client';
import React from 'react';

interface CommentsSectionProps {
    videoId: string;
}

const CommentsSection = ({ videoId }: CommentsSectionProps) => {
    const [comments] = trpc.comments.getMany.useSuspenseQuery({
        videoId,
    });
    return <div>{JSON.stringify(comments)}</div>;
};

export default CommentsSection;
