import { db } from '@/db';
import { videos } from '@/db/schema';
import { serve } from '@upstash/workflow/nextjs';
import { and, eq } from 'drizzle-orm';
import OpenAI from 'openai';

interface InputType {
    userId: string;
    videoId: string;
}

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENAI_API_THUMBBNAIL_KEY!,
    // defaultHeaders: {
    //     'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
    //     'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
    // },
});

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

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
