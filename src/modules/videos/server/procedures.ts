import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { videos } from '@/db/schema';
import { db } from '@/db';
import { mux } from '@/lib/mux';

export const videosRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;
        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policies: ['public'],
            },
            cors_origin: '*', // TODO: In production we have to change this
        });
        const [video] = await db
            .insert(videos)
            .values({
                userId,
                title: 'Test',
                url: 'Test',
            })
            .returning();

        return {
            video: video,
            url: upload.url,
        };
    }),
});
