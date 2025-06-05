import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { videoUpdateSchema, videos } from '@/db/schema';
import { db } from '@/db';
import { mux } from '@/lib/mux';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { UTApi } from 'uploadthing/server';
import { workflow } from '@/lib/qstash-workflow';

export const videosRouter = createTRPCRouter({
    generateDescription: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
                body: {
                    userId,
                    videoId: input.id,
                },
            });

            return workflowRunId;
        }),
    generateTitle: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
                body: {
                    userId,
                    videoId: input.id,
                },
            });

            return workflowRunId;
        }),
    generateThumbnail: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
                body: {
                    userId,
                    videoId: input.id,
                },
            });

            return workflowRunId;
        }),
    restore: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

            if (!existingVideo) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Video not found',
                });
            }

            if (!existingVideo.mux_playback_Id) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Video playback id not found',
                });
            }

            if (existingVideo.thumbnail_key) {
                await new UTApi().deleteFiles(existingVideo.thumbnail_key);

                db.update(videos)
                    .set({
                        thumbnail_key: null,
                        thumbnail_url: null,
                    })
                    .where(
                        and(eq(videos.id, input.id), eq(videos.userId, userId))
                    );
            }

            const tempThumbnailUrl = `https://image.mux.com/${existingVideo.mux_playback_Id}/thumbnail.jpg`;
            const uploadedThumbnail = await new UTApi().uploadFilesFromUrl({
                url: tempThumbnailUrl,
            });

            if (!uploadedThumbnail.data) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Video thumbnail not uploaded',
                });
            }

            const { key: thumbnailKey, url: thumbnailUrl } =
                uploadedThumbnail.data;

            const [updatedVideo] = await db
                .update(videos)
                .set({
                    thumbnail_key: thumbnailKey,
                    thumbnail_url: thumbnailUrl,
                })
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
                .returning();

            return updatedVideo;
        }),
    remove: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const [removeVideo] = await db
                .delete(videos)
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
                .returning();

            if (!removeVideo) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Video not found',
                });
            }

            return removeVideo;
        }),
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
            return updatedVideo;
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
