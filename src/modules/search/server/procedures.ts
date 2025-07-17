import {
    baseProcedure,
    createTRPCRouter,
    protectedProcedure,
} from '@/trpc/init';
import { z } from 'zod';
import { videos } from '@/db/schema';
import { db } from '@/db';
import { eq, and, or, lt, desc, ilike } from 'drizzle-orm';
export const searchRouter = createTRPCRouter({
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
                query: z.string().nullish(),
                categoryId: z.string().nullish(),
            })
        )
        .query(async ({ input }) => {
            const { cursor, limit, query, categoryId } = input;
            const data = await db
                .select()
                .from(videos)
                .where(
                    and(
                        ilike(videos.title, `%${query}%`),
                        categoryId
                            ? eq(videos.categoryId, categoryId)
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
