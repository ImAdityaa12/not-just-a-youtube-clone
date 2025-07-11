import { db } from '@/db';
import { videos } from '@/db/schema';
import { openai } from '@/lib/openai';
import { serve } from '@upstash/workflow/nextjs';
import { and, eq } from 'drizzle-orm';

interface InputType {
    userId: string;
    videoId: string;
}

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.
- Do no include " in starting and ending of title.
`;

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

    const title = await context.run('generate-title', async () => {
        const completion = await openai.chat.completions.create({
            model: 'openai/gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: transcript,
                },
                {
                    role: 'system',
                    content: TITLE_SYSTEM_PROMPT,
                },
            ],
        });
        console.log(completion);
        return completion.choices[0].message.content;
    });
    if (!title) {
        throw new Error('Something went wrong');
    }
    await context.run('update-video', async () => {
        await db
            .update(videos)
            .set({
                title: title || 'Not able to set title',
            })
            .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    });
});
