import Link from 'next/link';
import { CommentsGetManyOutput } from '../../types';
import UserAvatar from '@/components/user-avatar';

interface CommentItemProps {
    comment: CommentsGetManyOutput[number];
}

export const CommmentItem = ({ comment }: CommentItemProps) => {
    return (
        <div>
            <div className="flex gap-4">
                <Link href={`users/${comment.userId}`} />
                <UserAvatar
                    size={'lg'}
                    imageUrl={comment.user.imageUrl}
                    name={comment.user.name}
                />
            </div>
        </div>
    );
};
