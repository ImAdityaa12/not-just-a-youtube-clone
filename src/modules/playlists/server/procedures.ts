import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { usersTable, videoViews, videos, videosReactions } from '@/db/schema';
import { db } from '@/db';
import { and, desc, eq, getTableColumns, lt, or } from 'drizzle-orm';

import { z } from 'zod';

export const playlistsRouter = createTRPCRouter({
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
