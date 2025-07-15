import {
    baseProcedure,
    createTRPCRouter,
    protectedProcedure,
} from '@/trpc/init';
import { z } from 'zod';
import { usersTable, videos, videosReactions, videoViews } from '@/db/schema';
import { db } from '@/db';
import { eq, and, or, lt, desc, getTableColumns, not } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
export const suggestinsRouter = createTRPCRouter({
    getMany: baseProcedure
        .input(
            z.object({
                cursor: z
                    .object({
                        id: z.string().uuid(),
                        updatedAt: z.date(),
                    })
                    .nullish(),
                limit: z.number().min(1).max(100),
                videoId: z.string().uuid(),
            })
        )
        .query(async ({ input }) => {
            const { cursor, limit } = input;
            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(eq(videos.id, input.videoId));

            if (!existingVideo) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });
            }
            const data = await db
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
                })
                .from(videos)
                .innerJoin(usersTable, eq(videos.userId, usersTable.id))
                .where(
                    and(
                        not(eq(videos.id, input.videoId)),
                        eq(videos.video_visibility, 'public'),
                        existingVideo.categoryId
                            ? eq(videos.categoryId, existingVideo.categoryId)
                            : undefined,
                        cursor
                            ? or(
                                  lt(videos.updatedAt, cursor.updatedAt),
                                  and(
                                      eq(videos.updatedAt, cursor.updatedAt),
                                      lt(videos.id, cursor.id)
                                  )
                              )
                            : undefined
                    )
                )
                .orderBy(desc(videos.updatedAt), desc(videos.id))
                .limit(limit + 1);
            const hasMore = data.length > limit;
            const items = hasMore ? data.slice(0, -1) : data;
            const lastItem = items[items.length - 1];
            const nextCursor = hasMore
                ? {
                      id: lastItem.id,
                      updatedAt: lastItem.updatedAt,
                  }
                : null;

            return {
                items,
                nextCursor,
            };
        }),
});
