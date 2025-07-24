import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { subscriptions, usersTable, videos } from '@/db/schema';
import { db } from '@/db';
import { eq, getTableColumns, inArray, isNotNull } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const usersRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ input, ctx }) => {
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
            const viewerSubscriptions = db.$with('viewerSubscriptions').as(
                db
                    .select()
                    .from(subscriptions)
                    .where(
                        inArray(subscriptions.viewerId, userId ? [userId] : [])
                    )
            );
            const [existingUser] = await db
                .with(viewerSubscriptions)
                .select({
                    ...getTableColumns(usersTable),
                    viewerSubscribed: isNotNull(
                        viewerSubscriptions.viewerId
                    ).mapWith(Boolean),
                    videoCount: db.$count(
                        videos,
                        eq(videos.userId, usersTable.id)
                    ),
                    subscriberCount: db.$count(
                        subscriptions,
                        eq(subscriptions.creatorId, usersTable.id)
                    ),
                })
                .from(usersTable)
                .leftJoin(
                    viewerSubscriptions,
                    eq(viewerSubscriptions.creatorId, usersTable.id)
                )
                .where(eq(usersTable.id, input.id));

            if (!existingUser) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Video not found',
                });
            }

            return existingUser;
        }),
});
