import { relations } from 'drizzle-orm';
import {
    pgTable,
    uuid,
    text,
    timestamp,
    uniqueIndex,
    integer,
    pgEnum,
    primaryKey,
    foreignKey,
} from 'drizzle-orm/pg-core';

import {
    createInsertSchema,
    createUpdateSchema,
    createSelectSchema,
} from 'drizzle-zod';
export const reactionType = pgEnum('reaction_type', ['like', 'dislike']);
export const usersTable = pgTable(
    'users',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        clerkId: text('clerk_id').notNull().unique(),
        name: text('name').notNull(),
        imageUrl: text('image_url').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },

    (t) => [uniqueIndex('clerk_id_idx').on(t.clerkId)]
);

export const usersRelations = relations(usersTable, ({ many }) => ({
    videos: many(videos),
    videoViews: many(videoViews),
    videosReactions: many(videosReactions),
    subcriptions: many(subscriptions, {
        relationName: 'subscriptions_viewerId_fkey',
    }),
    subscribers: many(subscriptions, {
        relationName: 'subscriptions_creatorId_fkey',
    }),
    comments: many(comments),
    commentReactions: many(commentReactions),
    playlists: many(playlists),
}));

export const subscriptions = pgTable('subscriptions', {
    viewerId: uuid('viewer_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    creatorId: uuid('creator_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
    viewer: one(usersTable, {
        fields: [subscriptions.viewerId],
        references: [usersTable.id],
        relationName: 'subscriptions_viewerId_fkey',
    }),
    creator: one(usersTable, {
        fields: [subscriptions.creatorId],
        references: [usersTable.id],
        relationName: 'subscriptions_creatorId_fkey',
    }),
}));

export const categories = pgTable(
    'categories',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: text('name').notNull(),
        description: text('description'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [uniqueIndex('name_idx').on(t.name)]
);

export const categoriesRelations = relations(categories, ({ many }) => ({
    videos: many(videos),
}));

export const visiblityEnum = pgEnum('visibility', ['public', 'private']);

export const videos = pgTable('videos', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description'),
    url: text('url').notNull(),
    categoryId: uuid('category_id').references(() => categories.id, {
        onDelete: 'set null',
    }),
    mux_status: text('mux_status'),
    mux_upload_id: text('mux_upload_id').unique(),
    mux_asset_Id: text('mux_asset_id').unique(),
    mux_playback_Id: text('mux_playback_id').unique(),
    mux_track_Id: text('mux_track_id').unique(),
    mux_track_Status: text('mux_track_status'),
    thumbnail_url: text('thumbnail_url'),
    thumbnail_key: text('thumbnail_key'),
    preview_url: text('preview_url'),
    preview_key: text('preview_key'),
    video_duration: integer('video_duration').default(0).notNull(),
    video_visibility: visiblityEnum('video_visibility')
        .default('private')
        .notNull(),
    userId: uuid('user_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);

export const videoRelations = relations(videos, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [videos.userId],
        references: [usersTable.id],
    }),
    category: one(categories, {
        fields: [videos.categoryId],
        references: [categories.id],
    }),
    views: many(videoViews),
    reactions: many(videosReactions),
    comments: many(comments),
}));

export const comments = pgTable(
    'comments',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        userId: uuid('user_id')
            .references(() => usersTable.id, { onDelete: 'cascade' })
            .notNull(),
        videoId: uuid('video_id')
            .references(() => videos.id, { onDelete: 'cascade' })
            .notNull(),
        value: text('value').notNull(),
        parentId: uuid('parent_id'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => {
        return [
            foreignKey({
                columns: [table.parentId],
                foreignColumns: [table.id],
                name: 'comments_parent_id_fkey',
            }).onDelete('cascade'),
        ];
    }
);

export const commentSelectSchema = createSelectSchema(comments);
export const commentInsertSchema = createInsertSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);

export const commentRelations = relations(comments, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [comments.userId],
        references: [usersTable.id],
    }),
    video: one(videos, {
        fields: [comments.videoId],
        references: [videos.id],
    }),
    parent: one(comments, {
        fields: [comments.parentId],
        references: [comments.id],
        relationName: 'comments_parent_id_fkey',
    }),
    reactions: many(commentReactions),
    replies: many(comments, {
        relationName: 'comments_parent_id_fkey',
    }),
}));

export const commentReactions = pgTable(
    'comments_reactions',
    {
        userId: uuid('user_id')
            .references(() => usersTable.id, { onDelete: 'cascade' })
            .notNull(),
        commentId: uuid('comment_id')
            .references(() => comments.id, { onDelete: 'cascade' })
            .notNull(),
        type: reactionType('type').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [
        primaryKey({
            name: 'comments_reaction_pk',
            columns: [t.userId, t.commentId],
        }),
    ]
);

export const commentReactionsRealation = relations(
    commentReactions,
    ({ one }) => ({
        user: one(usersTable, {
            fields: [commentReactions.userId],
            references: [usersTable.id],
        }),
        comment: one(comments, {
            fields: [commentReactions.commentId],
            references: [comments.id],
        }),
    })
);
export const videoViews = pgTable(
    'video_views',
    {
        userId: uuid('user_id')
            .references(() => usersTable.id, { onDelete: 'cascade' })
            .notNull(),
        videoId: uuid('video_id')
            .references(() => videos.id, { onDelete: 'cascade' })
            .notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [
        primaryKey({
            name: 'videos_views_pk',
            columns: [t.userId, t.videoId],
        }),
    ]
);

export const videoViewrelations = relations(videoViews, ({ one }) => ({
    user: one(usersTable, {
        fields: [videoViews.userId],
        references: [usersTable.id],
    }),
    video: one(videos, {
        fields: [videoViews.videoId],
        references: [videos.id],
    }),
}));

export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoViewInsertSchema = createInsertSchema(videoViews);
export const videoViewUpdateSchema = createUpdateSchema(videoViews);

export const videosReactions = pgTable(
    'videos_reactions',
    {
        userId: uuid('user_id')
            .references(() => usersTable.id, { onDelete: 'cascade' })
            .notNull(),
        videoId: uuid('video_id')
            .references(() => videos.id, { onDelete: 'cascade' })
            .notNull(),
        type: reactionType('type').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [
        primaryKey({
            name: 'video_reactions_pk',
            columns: [t.userId, t.videoId],
        }),
    ]
);

export const videoReactionsRelations = relations(
    videosReactions,
    ({ one }) => ({
        user: one(usersTable, {
            fields: [videosReactions.userId],
            references: [usersTable.id],
        }),
        video: one(videos, {
            fields: [videosReactions.videoId],
            references: [videos.id],
        }),
    })
);

export const videoReactionsSelectSchema = createSelectSchema(videosReactions);
export const videoReactionsInsertSchema = createInsertSchema(videosReactions);
export const videoReactionsUpdateSchema = createUpdateSchema(videosReactions);

export const playlistVideos = pgTable(
    'playlist_videos',
    {
        playlistId: uuid('playlist_id')
            .references(() => playlists.id, {
                onDelete: 'cascade',
            })
            .notNull(),
        videoId: uuid('video_id')
            .references(() => videos.id, {
                onDelete: 'cascade',
            })
            .notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [
        {
            name: 'playlist_videos_pk',
            columns: [t.playlistId, t.videoId],
        },
    ]
);

export const playlistVideoRelations = relations(playlistVideos, ({ one }) => {
    return {
        playlist: one(playlists, {
            fields: [playlistVideos.playlistId],
            references: [playlists.id],
        }),
        video: one(videos, {
            fields: [playlistVideos.videoId],
            references: [videos.id],
        }),
    };
});

export const playlists = pgTable('playlists', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    userId: uuid('user_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const playlistRelations = relations(playlists, ({ one, many }) => {
    return {
        user: one(usersTable, {
            fields: [playlists.userId],
            references: [usersTable.id],
        }),
        playlistVideos: many(playlistVideos),
    };
});
