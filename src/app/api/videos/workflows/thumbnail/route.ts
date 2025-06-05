import { db } from '@/db';
import { videos } from '@/db/schema';
import { geminiClient } from '@/lib/gemini-client';
import { Modality } from '@google/genai';
import { serve } from '@upstash/workflow/nextjs';
import { and, eq } from 'drizzle-orm';
import { UTApi } from 'uploadthing/server';

interface InputType {
    userId: string;
    videoId: string;
    prompt: string;
}
async function uploadToUploadThing(
    imageBuffer: Buffer,
    filename = 'gemini-generated-image.png'
) {
    try {
        const file = new File([imageBuffer], filename, { type: 'image/png' });

        const response = await new UTApi().uploadFiles([file]);

        if (response[0].data) {
            return { url: response[0].data.url, key: response[0].data.key };
        } else {
            const errorDetails = response[0].error;
            console.error('Upload failed with error:', errorDetails);
            throw new Error(`Upload failed: ${JSON.stringify(errorDetails)}`);
        }
    } catch (error) {
        console.error('UploadThing upload error:', error);
        throw error;
    }
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
    const thumbnnail = await context.run('generate-thumbnail', async () => {
        const generatedImageData = await geminiClient.models.generateContent({
            model: 'gemini-2.0-flash-preview-image-generation',
            contents: prompt,
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });
        if (!generatedImageData) {
            throw new Error('Something went wrong in generating image');
        }

        for (const part of generatedImageData.candidates?.[0]?.content?.parts ??
            []) {
            if (part.text) {
                console.log('Generated text:', part.text);
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const buffer = Buffer.from(imageData ?? '', 'base64');

                const imageUrl = await uploadToUploadThing(
                    buffer,
                    `${videoId}-generatedAIthumbnail.png`
                );

                return imageUrl;
            }
        }
    });

    await context.run('update-video', async () => {
        if (video.thumbnail_key) {
            await new UTApi().deleteFiles(video.thumbnail_key);
            await db
                .update(videos)
                .set({
                    thumbnail_key: null,
                    thumbnail_url: null,
                })
                .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
        }
        await db
            .update(videos)
            .set({
                thumbnail_url: thumbnnail?.url,
                thumbnail_key: thumbnnail?.key,
            })
            .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    });
});
