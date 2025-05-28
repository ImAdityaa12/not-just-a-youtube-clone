import { eq } from 'drizzle-orm';
import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
} from '@mux/mux-node/resources/webhooks';
import { headers } from 'next/headers';
import { mux } from '@/lib/mux';
import { db } from '@/db';
import { videos } from '@/db/schema';

type WebhookEvent =
    | VideoAssetCreatedWebhookEvent
    | VideoAssetReadyWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetTrackReadyWebhookEvent;

const SIGN_IN_SECRET = process.env.MUX_SIGNIN_SECRET!;

export const POST = async (request: Request) => {
    if (!SIGN_IN_SECRET) {
        throw new Error('MUX_SIGNIN_SECRET is not set');
    }

    const headersPayload = await headers();
    const muxSignature = headersPayload.get('mux-signature');

    if (!muxSignature) {
        return new Response('No mux signature found', {
            status: 400,
        });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    mux.webhooks.verifySignature(
        body,
        {
            'mux-signature': muxSignature,
        },
        SIGN_IN_SECRET
    );

    switch (payload.type as WebhookEvent['type']) {
        case 'video.asset.created': {
            const data = payload.data as VideoAssetCreatedWebhookEvent['data'];

            if (!data) {
                return new Response('No data found', {
                    status: 400,
                });
            }
            await db
                .update(videos)
                .set({
                    mux_asset_Id: data.id,
                    mux_status: data.status,
                })
                .where(eq(videos.mux_upload_id, data.upload_id as string));
            break;
        }
        case 'video.asset.ready': {
            const data = payload.data as VideoAssetCreatedWebhookEvent['data'];
            if (!data) {
                return new Response('No data found', {
                    status: 400,
                });
            }
            if (!data.playback_ids) {
                return new Response('No playback ids found', {
                    status: 400,
                });
            }
            const playbackId = data.playback_ids[0].id || 'null';
            if (!data.upload_id) {
                return new Response('No upload id found', {
                    status: 400,
                });
            }
            if (!playbackId) {
                return new Response('No playback id found', {
                    status: 400,
                });
            }

            const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;

            await db
                .update(videos)
                .set({
                    mux_status: data.status,
                    mux_playback_Id: playbackId,
                    mux_asset_Id: data.id,
                    thumbnail_url: thumbnailUrl,
                })
                .where(eq(videos.mux_upload_id, data.upload_id as string));
            break;
        }
    }

    return new Response('Webhook recieved', {
        status: 200,
    });
};
