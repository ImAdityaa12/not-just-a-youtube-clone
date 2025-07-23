import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import {
    playlistVideos,
    playlists,
    usersTable,
    videoViews,
    videos,
    videosReactions,
} from '@/db/schema';
import { db } from '@/db';
import { and, desc, eq, getTableColumns, lt, or, sql } from 'drizzle-orm';

import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const playlistsRouter = createTRPCRouter({
    remove: protectedProcedure
        .input(
            z.object({
                playlistId: z.string().uuid(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { playlistId } = input;
            const [existingPlaylist] = await db
                .select()
                .from(playlists)
                .where(
                    and(
                        eq(playlists.id, playlistId),
                        eq(playlists.userId, userId)
                    )
                );
            if (!existingPlaylist) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Playlist not found',
                });
            }
            await db.delete(playlists).where(eq(playlists.id, playlistId));
            return existingPlaylist;
        }),
    getOne: protectedProcedure
        .input(
            z.object({
                playlistId: z.string().uuid(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { playlistId } = input;
            const [existingPlaylist] = await db
                .select()
                .from(playlists)
                .where(
                    and(
                        eq(playlists.id, playlistId),
                        eq(playlists.userId, userId)
                    )
                );
            if (!existingPlaylist) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Playlist not found',
                });
            }
            return existingPlaylist;
        }),
    getPlaylistVideos: protectedProcedure
        .input(
            z.object({
                cursor: z
                    .object({
                        id: z.string().uuid(),
                        updatedAt: z.date(),
                    })
                    .nullish(),
                limit: z.number().min(1).max(100),
                playlistId: z.string().uuid(),
            })
        )
        .query(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { cursor, limit, playlistId } = input;

            const [existingPlaylist] = await db
                .select()
                .from(playlists)
                .where(
                    and(
                        eq(playlists.id, playlistId),
                        eq(playlists.userId, userId)
                    )
                );
            if (!existingPlaylist) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Playlist not found',
                });
            }

            const videoFromPlaylist = db.$with('viewer_video_views').as(
                db
                    .select({
                        videoId: playlistVideos.videoId,
                    })
                    .from(playlistVideos)
                    .where(eq(playlistVideos.playlistId, playlistId))
            );

            const data = await db
                .with(videoFromPlaylist)
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
                    videoFromPlaylist,
                    eq(videos.id, videoFromPlaylist.videoId)
                )
                .where(
                    and(
                        eq(videos.video_visibility, 'public'),
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
    removeVideo: protectedProcedure
        .input(
            z.object({
                playlistId: z.string().uuid(),
                videoId: z.string().uuid(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { playlistId, videoId } = input;

            const [existingPlaylist] = await db
                .select()
                .from(playlists)
                .where(
                    and(
                        eq(playlists.id, playlistId),
                        eq(playlists.userId, userId)
                    )
                );

            if (!existingPlaylist) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });
            }

            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(eq(videos.id, videoId));

            if (!existingVideo) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });
            }

            const [existingPlaylistVideo] = await db
                .select()
                .from(playlistVideos)
                .where(
                    and(
                        eq(playlistVideos.playlistId, playlistId),
                        eq(playlistVideos.videoId, videoId)
                    )
                );

            if (!existingPlaylistVideo) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });
            }

            const [deletedPlaylistVideo] = await db
                .delete(playlistVideos)
                .where(
                    and(
                        eq(playlistVideos.playlistId, playlistId),
                        eq(playlistVideos.videoId, videoId)
                    )
                )
                .returning();

            return deletedPlaylistVideo;
        }),
    addVideo: protectedProcedure
        .input(
            z.object({
                playlistId: z.string().uuid(),
                videoId: z.string().uuid(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { playlistId, videoId } = input;

            const [existingPlaylist] = await db
                .select()
                .from(playlists)
                .where(
                    and(
                        eq(playlists.id, playlistId),
                        eq(playlists.userId, userId)
                    )
                );

            if (!existingPlaylist) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });
            }

            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(eq(videos.id, videoId));
            if (!existingVideo) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                });
            }

            const [existingPlaylistVideo] = await db
                .select()
                .from(playlistVideos)
                .where(
                    and(
                        eq(playlistVideos.playlistId, playlistId),
                        eq(playlistVideos.videoId, videoId)
                    )
                );

            if (existingPlaylistVideo) {
                throw new TRPCError({
                    code: 'CONFLICT',
                });
            }

            const [createdPlaylistVideos] = await db
                .insert(playlistVideos)
                .values({
                    playlistId,
                    videoId,
                })
                .returning();

            return createdPlaylistVideos;
        }),
    getManyForVideo: protectedProcedure
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
        .query(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { cursor, limit, videoId } = input;

            const data = await db
                .select({
                    ...getTableColumns(playlists),
                    videoCount: db.$count(
                        playlistVideos,
                        eq(playlistVideos.playlistId, playlists.id)
                    ),
                    user: usersTable,
                    containsVideo: videoId
                        ? sql<boolean>`
                        (
                            SELECT EXISTS(
                                SELECT 1
                                FROM playlist_videos pv
                                WHERE pv.playlist_id = ${playlists.id} AND pv.video_id = ${videoId}
                            )
                        )
                    `
                        : sql<boolean>`false`,
                })
                .from(playlists)
                .innerJoin(usersTable, eq(playlists.userId, usersTable.id))
                .where(
                    and(
                        eq(playlists.userId, userId),
                        cursor
                            ? or(
                                  lt(playlists.updatedAt, cursor.updatedAt),
                                  and(
                                      eq(playlists.updatedAt, cursor.updatedAt),
                                      lt(playlists.id, cursor.id)
                                  )
                              )
                            : undefined
                    )
                )
                .orderBy(desc(playlists.updatedAt), desc(playlists.id))
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
        .query(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { cursor, limit } = input;

            const data = await db
                .select({
                    ...getTableColumns(playlists),
                    videoCount: db.$count(
                        playlistVideos,
                        eq(playlistVideos.playlistId, playlists.id)
                    ),
                    user: usersTable,
                    thumbnailUrl: sql<string | null>`(
                        SELECT v.thumbnail_url
                        FROM ${playlistVideos} pv
                        JOIN ${videos} v ON v.id = pv.video_id
                        WHERE pv.playlist_id = ${playlists.id}
                        ORDER BY pv.updated_at DESC
                        LIMIT 1
                    )`,
                })
                .from(playlists)
                .innerJoin(usersTable, eq(playlists.userId, usersTable.id))
                .where(
                    and(
                        eq(playlists.userId, userId),
                        cursor
                            ? or(
                                  lt(playlists.updatedAt, cursor.updatedAt),
                                  and(
                                      eq(playlists.updatedAt, cursor.updatedAt),
                                      lt(playlists.id, cursor.id)
                                  )
                              )
                            : undefined
                    )
                )
                .orderBy(desc(playlists.updatedAt), desc(playlists.id))
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
            })
        )
        .query(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { cursor, limit } = input;

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
            })
        )
        .query(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { cursor, limit } = input;

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
