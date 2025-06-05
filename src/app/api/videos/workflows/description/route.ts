import { db } from '@/db';
import { videos } from '@/db/schema';
import { openai } from '@/lib/openai';
import { serve } from '@upstash/workflow/nextjs';
import { and, eq } from 'drizzle-orm';

interface InputType {
    userId: string;
    videoId: string;
}

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

export const { POST } = serve(async (context) => {
    const input = (await context.requestPayload) as InputType;
    const { videoId, userId } = input;
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
    const transcript = await context.run('get-transcript', async () => {
        const trackUrl = `https://stream.mux.com/${video.mux_playback_Id}/text/${video.mux_track_Id}.txt`;
        const response = await fetch(trackUrl);
        const text = await response.text();
        if (!text) {
            throw new Error('Transcript not found');
        }

        return text;
    });

    const descripton = await context.run('generate-description', async () => {
        const completion = await openai.chat.completions.create({
            model: 'openai/gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: transcript,
                },
                {
                    role: 'system',
                    content: DESCRIPTION_SYSTEM_PROMPT,
                },
            ],
        });
        return completion.choices[0].message.content;
    });
    if (!descripton) {
        throw new Error('Something went wrong');
    }
    await context.run('update-video', async () => {
        await db
            .update(videos)
            .set({
                description: descripton || 'Not able to set description',
            })
            .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    });
});
