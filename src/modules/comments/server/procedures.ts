import { db } from '@/db';
import { commentReactions, comments, usersTable } from '@/db/schema';
import {
    baseProcedure,
    createTRPCRouter,
    protectedProcedure,
} from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import {
    and,
    count,
    desc,
    eq,
    getTableColumns,
    inArray,
    isNotNull,
    isNull,
    lt,
    or,
} from 'drizzle-orm';
import { z } from 'zod';

export const commentsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                videoId: z.string().uuid(),
                value: z.string(),
                parentId: z.string().uuid().nullish(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id: userId } = ctx.user;
            const { videoId, value, parentId } = input;

            const [existingComment] = await db
                .select()
                .from(comments)
                .where(inArray(comments.id, parentId ? [parentId] : []));

            if (!existingComment && parentId) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });
            }

            if (existingComment?.parentId && parentId) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                });
            }

            const [createdComment] = await db
                .insert(comments)
                .values({
                    userId,
                    videoId,
                    parentId,
                    value,
                })
                .returning();
            return createdComment;
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id } = input;
            const { id: userId } = ctx.user;

            const [deletedComment] = await db
                .delete(comments)
                .where(and(eq(comments.userId, userId), eq(comments.id, id)))
                .returning();
            if (!deletedComment) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });
            }
            return deletedComment;
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
                parentId: z.string().uuid().nullish(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { videoId, cursor, limit, parentId } = input;
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
            const viewerReactions = db.$with('viewer_reactions').as(
                db
                    .select({
                        commentId: commentReactions.commentId,
                        type: commentReactions.type,
                    })
                    .from(commentReactions)
                    .where(
                        inArray(commentReactions.userId, userId ? [userId] : [])
                    )
            );

            const replies = db.$with('replies').as(
                db
                    .select({
                        parentId: comments.parentId,
                        count: count(comments.id).as('count'),
                    })
                    .from(comments)
                    .where(isNotNull(comments.parentId))
                    .groupBy(comments.parentId)
            );

            const [totalData, data] = await Promise.all([
                db
                    .select({
                        count: count(),
                    })
                    .from(comments)
                    .where(eq(comments.videoId, videoId)),
                // for only parent comment
                // and(
                //     eq(comments.videoId, videoId),
                //     isNull(comments.parentId)
                // )
                // (),
                db
                    .with(viewerReactions, replies)
                    .select({
                        ...getTableColumns(comments),
                        user: usersTable,
                        likeCount: db.$count(
                            commentReactions,
                            and(
                                eq(commentReactions.type, 'like'),
                                eq(commentReactions.commentId, comments.id)
                            )
                        ),
                        replyCount: replies.count,
                        dislikeCount: db.$count(
                            commentReactions,
                            and(
                                eq(commentReactions.type, 'dislike'),
                                eq(commentReactions.commentId, comments.id)
                            )
                        ),
                        viewerReaction: viewerReactions.type,
                    })
                    .from(comments)
                    .where(
                        and(
                            eq(comments.videoId, videoId),
                            parentId
                                ? eq(comments.parentId, parentId)
                                : isNull(comments.parentId),
                            cursor
                                ? or(
                                      lt(comments.updatedAt, cursor.updatedAt),
                                      and(
                                          eq(
                                              comments.updatedAt,
                                              cursor.updatedAt
                                          ),
                                          lt(comments.id, cursor.id)
                                      )
                                  )
                                : undefined
                        )
                    )
                    .innerJoin(usersTable, eq(comments.userId, usersTable.id))
                    .leftJoin(
                        viewerReactions,
                        eq(viewerReactions.commentId, comments.id)
                    )
                    .leftJoin(replies, eq(comments.id, replies.parentId))
                    .orderBy(desc(comments.updatedAt))
                    .limit(limit + 1),
            ]);

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
                totalCount: totalData[0].count,
                items,
                nextCursor,
            };
        }),
});
