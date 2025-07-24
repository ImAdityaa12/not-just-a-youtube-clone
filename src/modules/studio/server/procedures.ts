import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';
import {
    comments,
    usersTable,
    videos,
    videosReactions,
    videoViews,
} from '@/db/schema';
import { db } from '@/db';
import { eq, and, or, lt, desc, getTableColumns } from 'drizzle-orm';
export const studioRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { id } = input;

            const [video] = await db
                .select()
                .from(videos)
                .where(and(eq(videos.id, id), eq(videos.userId, userId)));

            if (!video) {
                throw new Error('Video not found');
            }
            return video;
        }),
    getMany: protectedProcedure
        .input(
            z.object({
                cursor: z
                    .object({
                        id: z.string().uuid(),
                        updatedAt: z.date(),
                    })
                    .nullish(),
                limit: z.number().min(1).max(100),
            })
        )
        .query(async ({ ctx, input }) => {
            const { cursor, limit } = input;
            const { id: userId } = ctx.user;
            const data = await db
                .select({
                    ...getTableColumns(videos),
                    user: usersTable,
                    viewCount: db.$count(
                        videoViews,
                        eq(videoViews.videoId, videos.id)
                    ),
                    commentCount: db.$count(
                        comments,
                        eq(comments.videoId, videos.id)
                    ),
                    likesCount: db.$count(
                        videosReactions,
                        and(
                            eq(videosReactions.videoId, videos.id),
                            eq(videosReactions.type, 'like')
                        )
                    ),
                })
                .from(videos)
                .innerJoin(usersTable, eq(videos.userId, usersTable.id))
                .where(
                    and(
                        eq(videos.userId, userId),
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
