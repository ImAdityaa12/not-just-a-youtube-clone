import { appRouter } from '@/trpc/routers/_app';
import { inferRouterOutputs } from '@trpc/server';

export type CommentsGetManyOutput = inferRouterOutputs<
    typeof appRouter
>['comments']['getMany'];
