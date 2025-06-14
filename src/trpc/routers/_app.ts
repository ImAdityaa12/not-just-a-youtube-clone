import { categoriesRouter } from '@/modules/categories/server/procedures';
import { studioRouter } from '@/modules/studio/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedures';

import { createTRPCRouter } from '../init';
import { videoViewsRouter } from '@/modules/video-views/server/procedures';

export const appRouter = createTRPCRouter({
    categories: categoriesRouter,
    studio: studioRouter,
    videos: videosRouter,
    videoViews: videoViewsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
