import { db } from '@/db';
import {
    subscriptions,
    usersTable,
    videos,
    videosReactions,
    videoViews,
} from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { and, desc, eq, getTableColumns, lt, or } from 'drizzle-orm';
import { z } from 'zod';

export const subscriptionsRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(
            z.object({
                cursor: z
                    .object({
                        creatorId: z.string().uuid(),
                        updatedAt: z.date(),
                    })
                    .nullish(),
                limit: z.number().min(1).max(100),
               
            })
        )
        .query(async ({ input, ctx }) => {
            const { cursor, limit } = input;
            const { id: userId } = ctx.user;

            const data = await db
                .select({
                    ...getTableColumns(subscriptions),
                    user: {
                        ...getTableColumns(usersTable),
                        subscriberCount: db.$count(
                            subscriptions,
                            eq(subscriptions.creatorId, userId)
                        ),
                    },
                })
                .from(subscriptions)
                .innerJoin(usersTable, eq(subscriptions.creatorId, usersTable.id))
                .where(
                    and(
                        eq(subscriptions.viewerId, userId),
                        cursor
                            ? or(
                                  lt(subscriptions.updatedAt, cursor.updatedAt),
                                  and(
                                      eq(subscriptions.updatedAt, cursor.updatedAt),
                                      lt(subscriptions.creatorId, cursor.creatorId)
                                  )
                              )
                            : undefined
                    )
                )
                .orderBy(desc(subscriptions.updatedAt), desc(subscriptions.creatorId))
                .limit(limit + 1);
            const hasMore = data.length > limit;
            const items = hasMore ? data.slice(0, -1) : data;
            const lastItem = items[items.length - 1];
            const nextCursor = hasMore
                ? {
                      id: lastItem.creatorId,
                      updatedAt: lastItem.updatedAt,
                  }
                : null;

            return {
                items,
                nextCursor,
            };
        }),
    create: protectedProcedure
        .input(
            z.object({
                userId: z.string().uuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { userId } = input;
            if (userId === ctx.user.id) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                });
            }

            const [subscription] = await db
                .insert(subscriptions)
                .values({
                    viewerId: ctx.user.id,
                    creatorId: userId,
                })
                .returning();
            return subscription;
        }),
    remove: protectedProcedure
        .input(
            z.object({
                userId: z.string().uuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { userId } = input;
            if (userId === ctx.user.id) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                });
            }

            const [deletedSubscription] = await db
                .delete(subscriptions)
                .where(
                    and(
                        eq(subscriptions.viewerId, ctx.user.id),
                        eq(subscriptions.creatorId, userId)
                    )
                )
                .returning();
            return deletedSubscription;
        }),
    getManySubscribed: protectedProcedure
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
        .query(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { cursor, limit } = input;

            const viewerSubscriptions = db
                .$with('viewer_subscriptions')
                .as(
                    db
                        .select({ userId: subscriptions.creatorId })
                        .from(subscriptions)
                        .where(eq(subscriptions.viewerId, userId))
                );

            const data = await db
                .with(viewerSubscriptions)
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
                .innerJoin(
                    viewerSubscriptions,
                    eq(videos.userId, viewerSubscriptions.userId)
                )
                .where(
                    and(
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
