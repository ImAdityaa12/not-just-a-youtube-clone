import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
// import dotenv from "dotenv";
// dotenv.config({
//   path: ".env.local",
// });
export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

    if (!SIGNING_SECRET) {
        throw new Error(
            'Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local',
        );
    }

    const wh = new Webhook(SIGNING_SECRET);

    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error: Could not verify webhook:', err);
        return new Response('Error: Verification error', {
            status: 400,
        });
    }

    const eventType = evt.type;
    console.log(eventType);
    if (eventType === 'user.created') {
        const data = evt.data;
        await db.insert(usersTable).values({
            clerkId: data.id,
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url,
        });
    }

    if (eventType === 'user.deleted') {
        const data = evt.data;
        if (!data.id) {
            return new Response('Error: Missing user id', {
                status: 400,
            });
        }
        await db.delete(usersTable).where(eq(usersTable.clerkId, data.id));
    }
    if (eventType === 'user.updated') {
        const data = evt.data;
        if (!data.id) {
            return new Response('Error: Missing user id', {
                status: 400,
            });
        }
        await db
            .update(usersTable)
            .set({
                name: `${data.first_name} ${data.last_name}`,
                imageUrl: data.image_url,
            })
            .where(eq(usersTable.clerkId, data.id));
    }
    return new Response('Webhook received', { status: 200 });
}
