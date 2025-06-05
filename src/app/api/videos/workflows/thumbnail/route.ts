import { db } from '@/db';
import { videos } from '@/db/schema';
import { openai } from '@/lib/openai';
import { serve } from '@upstash/workflow/nextjs';
import { and, eq } from 'drizzle-orm';

interface InputType {
    userId: string;
    videoId: string;
    prompt: string;
}

export const { POST } = serve(async (context) => {
    const input = (await context.requestPayload) as InputType;
    const { videoId, userId, prompt } = input;
    const video = await context.run('get-video', async () => {
        const data = await db
            .select()
            .from(videos)
            .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

        if (!data[0]) {
            throw new Error('Video not found');
        }

        return data[0];
    });

    const thumbnnail = await context.run('generate-thumbnail', async () => {});

    await context.run('update-video', async () => {
        await db
            .update(videos)
            .set({})
            .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    });
});
