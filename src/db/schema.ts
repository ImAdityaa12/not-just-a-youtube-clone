import { relations } from 'drizzle-orm';
import {
    pgTable,
    uuid,
    text,
    timestamp,
    uniqueIndex,
    integer,
    pgEnum,
} from 'drizzle-orm/pg-core';

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
    preview_url: text('preview_url'),
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

export const videoRelations = relations(videos, ({ one }) => ({
    user: one(usersTable, {
        fields: [videos.userId],
        references: [usersTable.id],
    }),
    category: one(categories, {
        fields: [videos.categoryId],
        references: [categories.id],
    }),
}));
