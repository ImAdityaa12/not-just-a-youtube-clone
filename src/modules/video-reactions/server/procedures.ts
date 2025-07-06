import { db } from '@/db';
import { videosReactions } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const videoReactionsRouter = createTRPCRouter({
    like: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { id: videoId } = input;

            const [existingVideoReactions] = await db
                .select()
                .from(videosReactions)
                .where(
                    and(
                        eq(videosReactions.videoId, videoId),
                        eq(videosReactions.userId, userId),
                        eq(videosReactions.type, 'like')
                    )
                );

            if (existingVideoReactions) {
                const [deletedViewerReaction] = await db
                    .delete(videosReactions)
                    .where(
                        and(
                            eq(videosReactions.userId, userId),
                            eq(videosReactions.videoId, videoId)
                        )
                    )
                    .returning();
                return deletedViewerReaction;
            }

            const [createdVideoReaction] = await db
                .insert(videosReactions)
                .values({
                    userId,
                    videoId,
                    type: 'like',
                })
                .onConflictDoUpdate({
                    target: [videosReactions.userId, videosReactions.videoId],
                    set: {
                        type: 'like',
                    },
                })
                .returning();

            return createdVideoReaction;
        }),
    disLike: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { id: videoId } = input;

            const [existingVideoReactionDislike] = await db
                .select()
                .from(videosReactions)
                .where(
                    and(
                        eq(videosReactions.videoId, videoId),
                        eq(videosReactions.userId, userId),
                        eq(videosReactions.type, 'dislike')
                    )
                );

            if (existingVideoReactionDislike) {
                const [deletedViewerReaction] = await db
                    .delete(videosReactions)
                    .where(
                        and(
                            eq(videosReactions.userId, userId),
                            eq(videosReactions.videoId, videoId)
                        )
                    )
                    .returning();
                return deletedViewerReaction;
            }

            const [createdVideoReaction] = await db
                .insert(videosReactions)
                .values({
                    userId,
                    videoId,
                    type: 'dislike',
                })
                .onConflictDoUpdate({
                    target: [videosReactions.userId, videosReactions.videoId],
                    set: {
                        type: 'dislike',
                    },
                })
                .returning();

            return createdVideoReaction;
        }),
});
