import { db } from '@/db';
import { comments, usersTable } from '@/db/schema';
import {
    baseProcedure,
    createTRPCRouter,
    protectedProcedure,
} from '@/trpc/init';
import { and, count, desc, eq, getTableColumns, lt, or } from 'drizzle-orm';
import { z } from 'zod';

export const commentsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                videoId: z.string().uuid(),
                value: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { videoId, value } = input;

            const [createdComment] = await db
                .insert(comments)
                .values({
                    userId,
                    videoId,
                    value,
                })
                .returning();
            return createdComment;
        }),
    getMany: baseProcedure
        .input(
            z.object({
                videoId: z.string().uuid(),
                cursor: z
                    .object({
                        id: z.string().uuid(),
                        updatedAt: z.date(),
                    })
                    .nullish(),
                limit: z.number().min(1).max(100),
            })
        )
        .query(async ({ input }) => {
            const { videoId, cursor, limit } = input;
            const [totalData] = await db
                .select({
                    count: count(),
                })
                .from(comments)
                .where(eq(comments.videoId, videoId));
            const data = await db
                .select({
                    ...getTableColumns(comments),
                    user: usersTable,
                })
                .from(comments)
                .where(
                    and(
                        eq(comments.videoId, videoId),
                        cursor
                            ? or(
                                  lt(comments.updatedAt, cursor.updatedAt),
                                  and(
                                      eq(comments.updatedAt, cursor.updatedAt),
                                      lt(comments.id, cursor.id)
                                  )
                              )
                            : undefined
                    )
                )
                .innerJoin(usersTable, eq(comments.userId, usersTable.id))
                .orderBy(desc(comments.updatedAt))
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
                totalCount: totalData.count,
                items,
                nextCursor,
            };
        }),
});
