import { db } from '@/db';
import { usersTable, videos } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError, UTApi } from 'uploadthing/server';
import { z } from 'zod';

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: '4MB',
            maxFileCount: 1,
        },
    })
        .input(
            z.object({
                videoId: z.string(),
            })
        )
        .middleware(async ({ input }) => {
            const { userId: clerkUserId } = await auth();
            if (!clerkUserId) throw new UploadThingError('Unauthorized');

            const [user] = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.clerkId, clerkUserId));

            if (!user) {
                throw new UploadThingError('Unauthorized');
            }

            const [existingVideo] = await db
                .select({
                    thumbnail_key: videos.thumbnail_key,
                })
                .from(videos)
                .where(
                    and(
                        eq(videos.id, input.videoId),
                        eq(videos.userId, user.id)
                    )
                );

            if (!existingVideo) {
                throw new UploadThingError('Video not found');
            }

            if (existingVideo.thumbnail_key) {
                await new UTApi().deleteFiles(existingVideo.thumbnail_key);
            }

            db.update(videos)
                .set({
                    thumbnail_key: null,
                    thumbnail_url: null,
                })
                .where(
                    and(
                        eq(videos.id, input.videoId),
                        eq(videos.userId, user.id)
                    )
                );
            return { user, ...input };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db
                .update(videos)
                .set({
                    thumbnail_url: file.url,
                    thumbnail_key: file.key,
                })
                .where(
                    and(
                        eq(videos.id, metadata.videoId),
                        eq(videos.userId, metadata.user.id)
                    )
                );
            console.log('Upload complete for userId:', metadata.user.id);

            console.log('file url', file.url);

            return { uploadedBy: metadata.user.id };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
