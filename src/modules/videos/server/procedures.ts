import {
    baseProcedure,
    createTRPCRouter,
    protectedProcedure,
} from '@/trpc/init';
import {
    subscriptions,
    usersTable,
    videoUpdateSchema,
    videoViews,
    videos,
    videosReactions,
} from '@/db/schema';
import { db } from '@/db';
import { mux } from '@/lib/mux';
import { and, eq, getTableColumns, inArray, isNotNull } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { UTApi } from 'uploadthing/server';
import { workflow } from '@/lib/qstash-workflow';
import { create } from 'domain';

export const videosRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input, ctx }) => {
            const { id } = input;
            const { clerkUserId } = ctx;
            let userId;

            const [user] = await db
                .select()
                .from(usersTable)
                .where(
                    inArray(
                        usersTable.clerkId,
                        clerkUserId ? [clerkUserId] : []
                    )
                );
            if (user) {
                userId = user.id;
            }
            const viewerReaction = db.$with('viewerReactions').as(
                db
                    .select({
                        videoId: videosReactions.videoId,
                        type: videosReactions.type,
                    })
                    .from(videosReactions)
                    .where(
                        inArray(videosReactions.userId, userId ? [userId] : [])
                    )
            );
            const viewerSubscriptions = db.$with('viewerSubscriptions').as(
                db
                    .select()
                    .from(subscriptions)
                    .where(
                        inArray(subscriptions.viewerId, userId ? [userId] : [])
                    )
            );
            const [existingVideo] = await db
                .with(viewerReaction, viewerSubscriptions)
                .select({
                    ...getTableColumns(videos),
                    user: {
                        ...getTableColumns(usersTable),
                        subsciberCount: db.$count(
                            subscriptions,
                            eq(subscriptions.creatorId, usersTable.id)
                        ),
                        viewerSubscribed: isNotNull(
                            viewerSubscriptions.viewerId
                        ).mapWith(Boolean),
                    },
                    viewCount: db.$count(
                        videoViews,
                        eq(videoViews.videoId, videos.id)
                    ),
                    likeCount: db.$count(
                        videosReactions,
                        and(
                            eq(videosReactions.videoId, videos.id),
                            eq(videosReactions.type, 'like')
                        )
                    ),
                    dislikeCount: db.$count(
                        videosReactions,
                        and(
                            eq(videosReactions.videoId, videos.id),
                            eq(videosReactions.type, 'dislike')
                        )
                    ),
                    viewerReaction: viewerReaction.type,
                })
                .from(videos)
                .innerJoin(usersTable, eq(usersTable.id, videos.userId))
                .leftJoin(viewerReaction, eq(viewerReaction.videoId, videos.id))
                .leftJoin(
                    viewerSubscriptions,
                    eq(viewerSubscriptions.creatorId, usersTable.id)
                )
                .where(eq(videos.id, id));
            // .groupBy(videos.id, usersTable.id, viewerReactions.type);
            if (!existingVideo) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Video not found',
                });
            }

            return existingVideo;
        }),
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
        .input(z.object({ id: z.string().uuid(), propmt: z.string().min(10) }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { workflowRunId } = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/thumbnail`,
                body: {
                    userId,
                    videoId: input.id,
                    prompt: input.propmt,
                },
            });

            return workflowRunId;
        }),
    revalidate: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { id } = input;
            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));
            if (!existingVideo) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });
            }

            if (!existingVideo.mux_upload_id) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                });
            }

            const upload = await mux.video.uploads.retrieve(
                existingVideo.mux_upload_id
            );

            if (!upload || !upload.asset_id) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });
            }
            const asset = await mux.video.assets.retrieve(upload.asset_id);

            const playbackId = asset.playback_ids?.[0].id;

            const duration = asset.duration
                ? Math.round(asset.duration * 1000)
                : 0;
            const [updatedAsset] = await db
                .update(videos)
                .set({
                    mux_status: asset.status,
                    mux_playback_Id: playbackId,
                    video_duration: duration,
                    mux_asset_Id: asset.id,
                })
                .where(and(eq(videos.id, id), eq(videos.userId, userId)))
                .returning();

            return updatedAsset;
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
