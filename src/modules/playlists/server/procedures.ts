import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import {
    playlists,
    usersTable,
    videoViews,
    videos,
    videosReactions,
} from '@/db/schema';
import { db } from '@/db';
import { and, desc, eq, getTableColumns, lt, or } from 'drizzle-orm';

import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const playlistsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1).max(255),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { name } = input;

            const [createdPlaylist] = await db
                .insert(playlists)
                .values({
                    userId,
                    name,
                })
                .returning();

            if (!createdPlaylist) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                });
            }

            return createdPlaylist;
        }),
    getLiked: protectedProcedure
        .input(
            z.object({
                cursor: z
                    .object({
                        id: z.string().uuid(),
                        likedAt: z.date(),
                    })
                    .nullish(),
                limit: z.number().min(1).max(100),
                categoryId: z.string().nullish(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { cursor, limit, categoryId } = input;

            const viewerVideoReactions = db.$with('viewer_video_reactions').as(
                db
                    .select({
                        videoId: videosReactions.videoId,
                        likedAt: videosReactions.updatedAt,
                    })
                    .from(videosReactions)
                    .where(
                        and(
                            eq(videosReactions.userId, userId),
                            eq(videosReactions.type, 'like')
                        )
                    )
            );

            const data = await db
                .with(viewerVideoReactions)
                .select({
                    ...getTableColumns(videos),
                    user: usersTable,
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
                    likedAt: viewerVideoReactions.likedAt,
                })
                .from(videos)
                .innerJoin(usersTable, eq(videos.userId, usersTable.id))
                .innerJoin(
                    viewerVideoReactions,
                    eq(videos.id, viewerVideoReactions.videoId)
                )
                .where(
                    and(
                        eq(videos.video_visibility, 'public'),
                        categoryId
                            ? eq(videos.categoryId, categoryId)
                            : undefined,
                        cursor
                            ? or(
                                  lt(
                                      viewerVideoReactions.likedAt,
                                      cursor.likedAt
                                  ),
                                  and(
                                      eq(
                                          viewerVideoReactions.likedAt,
                                          cursor.likedAt
                                      ),
                                      lt(
                                          viewerVideoReactions.videoId,
                                          cursor.id
                                      )
                                  )
                              )
                            : undefined
                    )
                )
                .orderBy(desc(viewerVideoReactions.likedAt), desc(videos.id))
                .limit(limit + 1);
            const hasMore = data.length > limit;
            const items = hasMore ? data.slice(0, -1) : data;
            const lastItem = items[items.length - 1];
            const nextCursor = hasMore
                ? {
                      id: lastItem.id,
                      likedAt: lastItem.likedAt,
                  }
                : null;

            return {
                items,
                nextCursor,
            };
        }),
    getHistory: protectedProcedure
        .input(
            z.object({
                cursor: z
                    .object({
                        id: z.string().uuid(),
                        viewedAt: z.date(),
                    })
                    .nullish(),
                limit: z.number().min(1).max(100),
                categoryId: z.string().nullish(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { cursor, limit, categoryId } = input;

            const viewerVideoViews = db.$with('viewer_video_views').as(
                db
                    .select({
                        videoId: videoViews.videoId,
                        viewedAt: videoViews.updatedAt,
                    })
                    .from(videoViews)
                    .where(eq(videoViews.userId, userId))
            );

            const data = await db
                .with(viewerVideoViews)
                .select({
                    ...getTableColumns(videos),
                    user: usersTable,
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
                    viewedAt: viewerVideoViews.viewedAt,
                })
                .from(videos)
                .innerJoin(usersTable, eq(videos.userId, usersTable.id))
                .innerJoin(
                    viewerVideoViews,
                    eq(videos.id, viewerVideoViews.videoId)
                )
                .where(
                    and(
                        eq(videos.video_visibility, 'public'),
                        categoryId
                            ? eq(videos.categoryId, categoryId)
                            : undefined,
                        cursor
                            ? or(
                                  lt(
                                      viewerVideoViews.viewedAt,
                                      cursor.viewedAt
                                  ),
                                  and(
                                      eq(
                                          viewerVideoViews.viewedAt,
                                          cursor.viewedAt
                                      ),
                                      lt(viewerVideoViews.videoId, cursor.id)
                                  )
                              )
                            : undefined
                    )
                )
                .orderBy(desc(viewerVideoViews.viewedAt), desc(videos.id))
                .limit(limit + 1);
            const hasMore = data.length > limit;
            const items = hasMore ? data.slice(0, -1) : data;
            const lastItem = items[items.length - 1];
            const nextCursor = hasMore
                ? {
                      id: lastItem.id,
                      viewedAt: lastItem.viewedAt,
                  }
                : null;

            return {
                items,
                nextCursor,
            };
        }),
});
