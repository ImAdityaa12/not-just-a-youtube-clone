import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { videoUpdateSchema, videos } from '@/db/schema';
import { db } from '@/db';
import { mux } from '@/lib/mux';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const videosRouter = createTRPCRouter({
    update: protectedProcedure
        .input(videoUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;

            if (!input.id) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Video id is required',
                });
            }

            const [updatedVideo] = await db
                .update(videos)
                .set({
                    title: input.title,
                    description: input.description,
                    categoryId: input.categoryId,
                    video_visibility: input.video_visibility,
                    updatedAt: new Date(),
                })
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
                .returning();

            if (!updatedVideo) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Video not found',
                });
            }
        }),
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;
        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policies: ['public'],
                input: [
                    {
                        generated_subtitles: [
                            {
                                language_code: 'en',
                                name: 'English',
                            },
                        ],
                    },
                ],
            },
            cors_origin: '*', // TODO: In production we have to change this
        });
        const [video] = await db
            .insert(videos)
            .values({
                userId,
                title: 'Test',
                url: 'This is just a tesing url',
                mux_status: 'wating',
                mux_upload_id: upload.id,
            })
            .returning();

        return {
            video: video,
            url: upload.url,
        };
    }),
});
