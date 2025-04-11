import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { videos } from "@/db/schema";
import { db } from "@/db";
export const studioRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(videos);
    return data;
  }),
});
