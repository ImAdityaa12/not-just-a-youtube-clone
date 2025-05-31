import { eq } from 'drizzle-orm';
import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
    VideoAssetDeletedWebhookEvent,
} from '@mux/mux-node/resources/webhooks';
import { headers } from 'next/headers';
import { mux } from '@/lib/mux';
import { db } from '@/db';
import { videos } from '@/db/schema';

type WebhookEvent =
    | VideoAssetCreatedWebhookEvent
    | VideoAssetReadyWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetTrackReadyWebhookEvent
    | VideoAssetDeletedWebhookEvent;

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
            const previewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
            const duration = data.duration
                ? Math.round(data.duration * 1000)
                : 0;
            await db
                .update(videos)
                .set({
                    mux_status: data.status,
                    mux_playback_Id: playbackId,
                    mux_asset_Id: data.id,
                    thumbnail_url: thumbnailUrl,
                    preview_url: previewUrl,
                    video_duration: duration,
                })
                .where(eq(videos.mux_upload_id, data.upload_id as string));
            break;
        }
        case 'video.asset.errored': {
            const data = payload.data as VideoAssetErroredWebhookEvent['data'];

            if (!data) {
                return new Response('No data found', {
                    status: 400,
                });
            }

            await db
                .update(videos)
                .set({
                    mux_status: data.status,
                })
                .where(eq(videos.mux_asset_Id, data.upload_id as string));
            break;
        }
        case 'video.asset.deleted': {
            const data = payload.data as VideoAssetDeletedWebhookEvent['data'];

            if (!data.upload_id) {
                return new Response('No upload id found', {
                    status: 400,
                });
            }

            await db
                .delete(videos)
                .where(eq(videos.mux_upload_id, data.upload_id));
            break;
        }
        case 'video.asset.track.ready': {
            //typescript incorrectly says asset_id is not a property of data
            const data =
                payload.data as VideoAssetTrackReadyWebhookEvent['data'] & {
                    asset_id: string;
                };

            const assetId = data.asset_id;
            const trackId = data.id;

            if (!assetId) {
                return new Response('No Asset Id found', {
                    status: 400,
                });
            }

            await db
                .update(videos)
                .set({
                    mux_track_Id: trackId,
                    mux_track_Status: data.status,
                })
                .where(eq(videos.mux_asset_Id, assetId));
            break;
        }
    }

    return new Response('Webhook recieved', {
        status: 200,
    });
};
